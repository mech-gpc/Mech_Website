/**
 * Department Admin Panel (Apps Script web app).
 * Add / edit / hide / delete the website's lists: Notices, Academic Calendar, Downloads, Staff,
 * Faculty training, Projects, NPTEL courses and NPTEL stars. Each list is one tab of the bound Google Sheet.
 * Only the e-mail in ADMINS can use it; every server call re-checks it. See SETUP.md.
 */
var ADMINS = ['mechgpc1994@gmail.com'];
var FOLDER_NAME = 'Website uploads';          // Drive folder for uploads (created in the admin's Drive)
var MAX_BYTES = 20 * 1024 * 1024;

var YESNO = ['Yes', 'No'];
// key = column heading (lower case, spaces as _). aliases = other accepted headings.
// file: 'pdf' | 'image' -> the field accepts an upload or a pasted link.  top: new rows go to the top of the tab.
var SCHEMA = {
  notices: { tab: 'Notices', label: 'Notices', top: true, fields: [
    { key: 'title', label: 'Title', required: true, aliases: ['name', 'document_name', 'notice', 'subject'] },
    { key: 'link', label: 'Document', file: 'pdf', required: true, aliases: ['document_link', 'file_link', 'url', 'file'] },
    { key: 'date', label: 'Date', type: 'date', aliases: ['notice_date'] },
    { key: 'category', label: 'Category', list: ['General', 'Exam', 'Academic', 'Admission', 'Scholarship', 'Training & Placement'], aliases: ['type'] },
    { key: 'semester', label: 'Semester', options: ['', '1', '2', '3', '4', '5', '6'], aliases: ['sem'] },
    { key: 'details', label: 'Details', aliases: ['description', 'text'] } ] },
  calendar: { tab: 'Calendar', label: 'Academic Calendar', top: true, fields: [
    { key: 'title', label: 'Title (e.g. Academic Calendar - Term 262)', required: true, aliases: ['name', 'term'] },
    { key: 'link', label: 'Calendar PDF', file: 'pdf', required: true, aliases: ['url'] },
    { key: 'details', label: 'Details', aliases: ['text', 'description'] },
    { key: 'badge', label: 'Badge (e.g. NEW)' } ] },
  downloads: { tab: 'Downloads', label: 'Downloads', fields: [
    { key: 'title', label: 'Title', required: true, aliases: ['name'] },
    { key: 'link', label: 'File or folder link', file: 'pdf', required: true, aliases: ['url'] },
    { key: 'details', label: 'Details', aliases: ['text', 'description'] },
    { key: 'icon', label: 'Icon name (Material Symbols, e.g. menu_book)' },
    { key: 'badge', label: 'Badge (e.g. NEW)' } ] },
  staff: { tab: 'Staff', label: 'Faculty & Staff', fields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'designation', label: 'Designation' },
    { key: 'role', label: 'Category', options: ['Faculty', 'Technical staff', 'Supporting staff'], required: true },
    { key: 'position', label: 'Position (e.g. I/C HOD)' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'joined_institute', label: 'Joined institute (year)' } ] },
  training: { tab: 'Training', label: 'Faculty Training', top: true, fields: [
    { key: 'year', label: 'Academic year (e.g. 2026-27)', required: true },
    { key: 'faculty', label: 'Faculty', required: true },
    { key: 'programme', label: 'Programme', required: true },
    { key: 'organiser', label: 'Organiser' },
    { key: 'period', label: 'Period (dd/mm/yyyy to dd/mm/yyyy)' },
    { key: 'duration', label: 'Duration (e.g. 2 Days)' },
    { key: 'type', label: 'Type', list: ['FDP / STTP / Short-term Course', 'MOOC / NPTEL', 'Industrial Training', 'Induction Programme', 'Workshop'] },
    { key: 'mode', label: 'Mode', options: ['', 'Offline', 'Online'] },
    { key: 'certificate', label: 'Certificate', options: YESNO },
    { key: 'achievement', label: 'Achievement' },
    { key: 'area', label: 'Area' },
    { key: 'partner', label: 'Partner' },
    { key: 'partner_type', label: 'Partner type' } ] },
  projects: { tab: 'Projects', label: 'Student Projects', fields: [
    { key: 'academic_year', label: 'Academic year (e.g. 2025-26)', required: true },
    { key: 'course', label: 'Course (e.g. Project-II)' },
    { key: 'group', label: 'Group no.', type: 'number' },
    { key: 'title', label: 'Project title', required: true },
    { key: 'guide', label: 'Guide' },
    { key: 'students', label: 'No. of students', type: 'number' },
    { key: 'report_available', label: 'Report available', options: YESNO } ] },
  nptelCourses: { tab: 'NPTEL Courses', label: 'NPTEL Courses', top: true, fields: [
    { key: 'faculty', label: 'Faculty', required: true },
    { key: 'course', label: 'Course', required: true },
    { key: 'session', label: 'Session (e.g. Jan-Apr 2026)' },
    { key: 'weeks', label: 'Weeks', type: 'number' },
    { key: 'score_percent', label: 'Score %', type: 'number' } ] },
  nptelStars: { tab: 'NPTEL Stars', label: 'NPTEL Stars', top: true, fields: [
    { key: 'name', label: 'Faculty name', required: true },
    { key: 'title', label: 'Title (e.g. NPTEL Discipline Star)' },
    { key: 'discipline', label: 'Discipline' },
    { key: 'session', label: 'Session (e.g. Jul-Dec 2025)' },
    { key: 'image', label: 'Certificate image', file: 'image' } ] }
};

function doGet() {
  if (!allowed_()) {
    return HtmlService.createHtmlOutput('<p style="font:16px sans-serif;padding:2em">Access denied. Sign in with the department Google account.</p>').setTitle('Admin');
  }
  return HtmlService.createHtmlOutputFromFile('Admin').setTitle('Mechanical Dept - Admin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function allowed_() {
  var m = (Session.getActiveUser().getEmail() || '').toLowerCase();
  return !!m && ADMINS.indexOf(m) > -1;
}
function guard_() { if (!allowed_()) throw new Error('Not authorised'); }

function getSchema() { guard_(); return SCHEMA; }

function schema_(kind) { var s = SCHEMA[kind]; if (!s) throw new Error('Unknown list'); return s; }
function sheet_(kind) {
  var s = schema_(kind), sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(s.tab);
  if (!sh) throw new Error('Tab "' + s.tab + '" not found in the spreadsheet. Import Website_Data_Sheets.xlsx (see SETUP.md).');
  return sh;
}
function norm_(h) { return String(h).trim().toLowerCase().replace(/[\s\-]+/g, '_'); }
function headers_(sh) { return sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0].map(norm_); }
function colOf_(head, f) {
  var names = [f.key].concat(f.aliases || []);
  for (var i = 0; i < names.length; i++) { var k = head.indexOf(names[i]); if (k > -1) return k; }
  return -1;
}
function showCol_(sh, create) {
  var head = headers_(sh), c = Math.max(head.indexOf('show'), head.indexOf('visible'));
  if (c < 0 && create) { c = head.length; sh.getRange(1, c + 1).setValue('Show').setFontWeight('bold'); }
  return c;
}

function list(kind) {
  guard_();
  var s = schema_(kind), sh = sheet_(kind), n = sh.getLastRow();
  if (n < 2) return [];
  var head = headers_(sh), sc = showCol_(sh, false);
  var data = sh.getRange(2, 1, n - 1, sh.getLastColumn()).getDisplayValues(), out = [];
  data.forEach(function (r, i) {
    var o = { row: i + 2, values: {}, show: sc > -1 ? r[sc] : 'Yes' }, any = false;
    s.fields.forEach(function (f) { var c = colOf_(head, f); o.values[f.key] = c > -1 ? r[c] : ''; if (c > -1 && r[c]) any = true; });
    if (any) out.push(o);
  });
  return out;
}

// row = 0 adds a new entry; row >= 2 replaces the fields of that entry.
function save(kind, row, values) {
  guard_();
  var s = schema_(kind); values = values || {};
  var vals = {};
  s.fields.forEach(function (f) {
    var v = values[f.key];
    if (v && typeof v === 'object' && v.data) v = upload_(v, f.file);
    v = v == null ? '' : String(v).trim().slice(0, 1000);
    if (f.required && !v) throw new Error(f.label.replace(/ \(.*/, '') + ' is required');
    if (f.file && v && !/^(https:\/\/|assets\/)/i.test(v)) throw new Error(f.label + ': provide an upload or a full https:// link');
    if (f.type === 'number' && v && isNaN(Number(v))) throw new Error(f.label + ' must be a number');
    vals[f.key] = v;
  });
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var sh = sheet_(kind), head = headers_(sh);
    s.fields.forEach(function (f) {                       // create any missing column
      if (colOf_(head, f) < 0) { sh.getRange(1, head.length + 1).setValue(f.label.replace(/ \(.*/, '')).setFontWeight('bold'); head.push(f.key); }
    });
    var sc = showCol_(sh, true); head = headers_(sh);
    var isNew = !row;
    if (isNew) {
      if (s.top) { sh.insertRowAfter(1); row = 2; } else { row = Math.max(2, sh.getLastRow() + 1); }
    } else if (row < 2 || row > sh.getLastRow()) { throw new Error('Row no longer exists - refresh the list'); }
    var cur = isNew ? new Array(head.length).fill('') : sh.getRange(row, 1, 1, head.length).getDisplayValues()[0];
    s.fields.forEach(function (f) { cur[colOf_(head, f)] = vals[f.key]; });
    if (isNew) cur[sc] = 'Yes';
    sh.getRange(row, 1, 1, head.length).setNumberFormat('@').setValues([cur]);
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function setShow(kind, row, show) {
  guard_();
  var sh = sheet_(kind);
  if (row < 2 || row > sh.getLastRow()) throw new Error('Row no longer exists - refresh the list');
  var c = showCol_(sh, true);
  sh.getRange(row, c + 1).setNumberFormat('@').setValue(show ? 'Yes' : 'No');
  return true;
}

function remove(kind, row) {
  guard_();
  var sh = sheet_(kind);
  if (row < 2 || row > sh.getLastRow()) throw new Error('Row no longer exists - refresh the list');
  sh.deleteRow(row);
  return true;
}

function upload_(f, type) {
  var name = String(f.name || 'file'), isImg = type === 'image';
  if (isImg ? !/\.(jpe?g|png|webp)$/i.test(name) : !/\.pdf$/i.test(name)) throw new Error(isImg ? 'Only JPG, PNG or WebP images are accepted' : 'Only PDF files are accepted');
  var bytes = Utilities.base64Decode(f.data);
  if (bytes.length > MAX_BYTES) throw new Error('File is larger than 20 MB');
  var mime = isImg ? (/png$/i.test(name) ? 'image/png' : /webp$/i.test(name) ? 'image/webp' : 'image/jpeg') : 'application/pdf';
  var it = DriveApp.getFoldersByName(FOLDER_NAME), folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
  var file = folder.createFile(Utilities.newBlob(bytes, mime, name.replace(/[^\w.\- ()]/g, '_')));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return isImg ? 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1600'
               : 'https://drive.google.com/file/d/' + file.getId() + '/view?usp=sharing';
}
