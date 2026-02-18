function getAdminCode() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ADMIN_SHEET);
  return sheet.getRange("B2").getValue().toString();
}

function verifyAdminLogin(inputKey) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ADMIN_SHEET);
    
    // Fetching the value from cell B1
    const masterKey = sheet.getRange("B1").getValue().toString().trim();
    
    // Return true if it matches exactly, otherwise false
    return inputKey.toString().trim() === masterKey;
  } catch (e) {
    Logger.log("Authorization Error: " + e.toString());
    return false;
  }
}

function fetchData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Registration");
    
    if (!sheet) {
      throw new Error("Registry Error: 'Registration' sheet not found.");
    }

    const data = sheet.getDataRange().getValues();
    
    // Check if registry is empty (only headers or less)
    if (data.length <= 1) {
      return [];
    }

    const formattedData = data.slice(1).map(row => {
      return {
        name: row[0],
        roll: row[2],
        descriptor: row[3] // This is the JSON string created during Enrollment
      };
    }).filter(item => item.descriptor && item.descriptor !== "");

    return formattedData;

  } catch (e) {
    Logger.log("Error in fetchData: " + e.message);
    throw new Error("Terminal Sync Failure: Unable to access biometric registry.");
  }
}

function getAttendanceData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATT_SHEET);
    
    if (!sheet) {
      throw new Error("Sheet '" + ATT_SHEET + "' not found.");
    }

    // Get the entire range of data from the sheet
    const range = sheet.getDataRange();
    const values = range.getDisplayValues(); // getDisplayValues preserves date formatting

    return values;
  } catch (e) {
    Logger.log("Error in getAttendanceData: " + e.toString());
    throw new Error("Could not retrieve attendance data: " + e.message);
  }
}

function getRegistrationData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(REG_SHEET);
    
    if (!sheet) {
      throw new Error("Registry database ('" + REG_SHEET + "') not found.");
    }

    // Access the full dataset
    const range = sheet.getDataRange();
    const values = range.getDisplayValues(); 

    // Verification check: Ensure there is at least a header row
    if (values.length === 0) {
      return [];
    }

    Logger.log("Successfully retrieved " + (values.length - 1) + " student records.");
    return values;

  } catch (e) {
    Logger.log("Critical Registry Error: " + e.toString());
    throw new Error("Unable to access Biometric Registry: " + e.message);
  }
}

function getAttendanceDataforAnalytics() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATT_SHEET);
    
    if (!sheet) {
      throw new Error("Sheet '" + ATT_SHEET + "' not found.");
    }

    // Get the entire range of data from the sheet
    const range = sheet.getDataRange();
    const values = range.getDisplayValues(); // getDisplayValues preserves date formatting

    return values;
  } catch (e) {
    Logger.log("Error in getAttendanceData: " + e.toString());
    throw new Error("Could not retrieve attendance data: " + e.message);
  }
}

function getAttendanceDataforAnalysis() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATT_SHEET);
    
    if (!sheet) {
      throw new Error("Sheet '" + ATT_SHEET + "' not found.");
    }

    // Get the entire range of data from the sheet
    const range = sheet.getDataRange();
    const values = range.getDisplayValues(); // getDisplayValues preserves date formatting

    return values;
  } catch (e) {
    Logger.log("Error in getAttendanceData: " + e.toString());
    throw new Error("Could not retrieve attendance data: " + e.message);
  }
}
