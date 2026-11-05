# Admin panel and Google Sheet setup (one time, about 15 minutes)

Sign in as **mechgpc1994@gmail.com** throughout. Only this address can use the panel.

## A. Put the data in Google Sheets
1. Open your existing notices spreadsheet (the one with the **Notices** tab).
2. **File > Import > Upload** `Website_Data_Sheets.xlsx` > **Insert new sheet(s)**. This adds the tabs
   **Staff, Training, Projects, NPTEL Courses, NPTEL Stars, Downloads, Calendar**, already filled with today's website data.
   Keep the tab names exactly as they are. Keep row 1 headings (the order of columns may change, the names must not).
3. For **each** new tab: **File > Share > Publish to web** > pick the tab > **Comma-separated values (.csv)** > Publish. Copy the URL.
4. Paste the 7 URLs into `assets/js/notices-config.js`:
   - `CALENDAR_SHEET_CSV` = Calendar tab
   - `DOWNLOADS_SHEET_CSV` = Downloads tab
   - `SHEETS.staff`, `.training`, `.projects`, `.nptelCourses`, `.nptelStars` = the other tabs
   Commit and push once. Any URL left as `""` simply keeps using the built-in data, so you can switch tabs on one at a time.

Published sheets are public, so keep only website-facing data in these tabs.

## B. Deploy the admin panel
1. In the same spreadsheet: **Extensions > Apps Script**. Delete the sample code and paste `Code.gs`.
   Add a file: **+ > HTML**, name it exactly `Admin`, paste `Admin.html`. Save.
2. **Deploy > New deployment > Web app**
   - Execute as: **User accessing the web app**
   - Who has access: **Anyone with a Google account**
   Deploy, approve the Sheets and Drive permissions, copy the `/exec` URL and bookmark it.
3. Open it. Pick a list, add or edit an entry, then check the sheet and the website.

After changing the code later: Deploy > Manage deployments > Edit > New version.

## Everyday use
- **Faculty joins:** Faculty & Staff > fill the form > Publish (added at the bottom of the list).
- **Faculty leaves:** Faculty & Staff > **Hide** (kept in the sheet, removed from the site) or **Delete**.
- **Position changes (new HOD):** **Edit** the person, change Position, Save changes. Clear the old HOD's Position.
- **New circular / calendar / manual:** pick the list, upload the PDF, Publish.
- **NPTEL star certificate:** NPTEL Stars > upload the image (JPG/PNG), Publish.
- Order on the website follows the order of rows in the sheet (Notices, Training, NPTEL are sorted newest first by the panel).
- You can also edit the sheet directly; the panel is just a safer form for it.

## Notes
- Uploads go to the Drive folder "Website uploads", shared as view-only by link.
- If a sheet cannot be reached, the website automatically falls back to the data built into it.
- Anyone else who opens the panel sees "Access denied". To add an admin, add the address to `ADMINS` in `Code.gs` and deploy a new version.
