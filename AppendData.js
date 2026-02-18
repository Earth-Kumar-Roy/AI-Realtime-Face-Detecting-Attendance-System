function appendData(payload) {

  if (!payload) throw new Error("No payload received.");

  const { name, email, roll, descriptor } = payload;

  if (!name || !email || !roll || !descriptor)
    throw new Error("Missing required fields.");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const regSheet = ss.getSheetByName(REG_SHEET);
  const attSheet = ss.getSheetByName(ATT_SHEET);

  if (!regSheet || !attSheet)
    throw new Error("Required sheets not found.");

  const existingRolls = regSheet
    .getRange(2, 3, Math.max(regSheet.getLastRow() - 1, 1))
    .getValues()
    .flat()
    .map(String);

  if (existingRolls.includes(String(roll))) {
    throw new Error("Roll number already registered.");
  }

  regSheet.appendRow([
    name,
    email,
    roll,
    descriptor,     // JSON string
    "ENROLLED"
  ]);

  attSheet.appendRow([
    name,
    email,
    roll
  ]);

  return "Registration Successful";
}



function processAttendance(payload) {

  const dateString = payload.date;                    // format: YYYY-MM-DD
  const attendanceRecords = payload.attendanceRecords; // array of {roll, name, time}

  if (!dateString || !attendanceRecords) {
    throw new Error("Invalid payload.");
  }

  const formattedDate = formatDateForHeader(dateString);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ATT_SHEET);

  const data = sheet.getDataRange().getValues();

  if (data.length < 1) {
    throw new Error("Attendance sheet empty.");
  }

  const headers = data[0];

  let dateColIndex = headers.indexOf(formattedDate);

  if (dateColIndex === -1) {
    dateColIndex = headers.length;
    sheet.getRange(1, dateColIndex + 1).setValue(formattedDate);
  }

  const rollRowMap = {};

  for (let i = 1; i < data.length; i++) {
    const roll = String(data[i][2]);
    rollRowMap[roll] = i + 1; // actual sheet row
  }

  attendanceRecords.forEach(record => {
    const roll = String(record.roll);
    const time = record.time; // 24h format: "14:35"

    if (rollRowMap[roll]) {
      const rowNumber = rollRowMap[roll];

      // Write TIME instead of "P"
      sheet.getRange(rowNumber, dateColIndex + 1).setValue(time);

      const email = sheet.getRange(rowNumber, 2).getValue();
      const name = sheet.getRange(rowNumber, 1).getValue();

      sendAttendanceEmail(name, email, formattedDate, time);
    }
  });

  return "Attendance processed successfully.";
}

function formatDateForHeader(dateString) {

  const dateObj = new Date(dateString);

  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return month + "/" + day + "/" + year;
}


function sendAttendanceEmail(name, email, date, time) {  

  if (!email) return;

  const subject = "Attendance Marked - " + date;

  const body =
    "Hello " + name + ",\n\n" +
    "Your attendance has been successfully recorded on " + date + " at " + time + ".\n\n" +  
    "Regards,\nAI Realtime Face Detecting Attendance System";

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: "AI Realtime Face Detecting Attendance System"
  });
}
