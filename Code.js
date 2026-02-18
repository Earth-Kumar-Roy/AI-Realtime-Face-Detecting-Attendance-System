function doGet() {
  return HtmlService.createTemplateFromFile('AdminLogin')
    .evaluate()
    .setTitle("AI Realtime Face Detecting Attendance System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ================= LOAD OTHER PAGES =================
function loadPage(pageName) {
  const template = HtmlService.createTemplateFromFile(pageName);
  return template.evaluate().getContent();
}

/* ================= Constriants ================= */

const SPREADSHEET_ID = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const REG_SHEET = "XXXXXXXXXXXX";
const ATT_SHEET = "XXXXXXXXXX";
const ADMIN_SHEET = "XXXXX";
