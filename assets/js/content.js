/* =====================================================================
   EDIT THIS FILE TO UPDATE THE WEBSITE
   ---------------------------------------------------------------------
   - NOTICES    -> Notice Board page + "Latest notices" on Home
   - ACTIVITIES -> Activity page + "Recent activities" on Home
   - DOWNLOADS  -> Download page + quick links on Home
   - HOD        -> "Message from the Head of Department" on Home
   - FACULTY_LINKS -> Faculty Corner page (Drive folders shared only with faculty)
   Newest items go at the TOP of each list. Keep the commas and quotes.
   ===================================================================== */

/* VISITOR COUNTER (GoatCounter, free, no cookies)
   Put your GoatCounter code between the quotes, e.g. "gpcmech" for gpcmech.goatcounter.com.
   Leave it "" and no visits are counted and no counter is shown. */
window.VISIT_COUNTER_CODE = "mechwebsite";
window.VISIT_COUNTER_START = 1000;

/* MICROSOFT CLARITY (free): heatmaps and anonymous session recordings
   Shows where visitors click, how far they scroll, and where they get stuck.
   Sign up at https://clarity.microsoft.com with mechgpchhotaudepur@gmail.com, add a project for this
   website, then copy the Project ID (Settings -> Overview, e.g. "q1w2e3r4t5") between the quotes.
   Leave it "" and Clarity is switched off. */
window.CLARITY_PROJECT_ID = "";

/* NOTICES FROM A GOOGLE SHEET
   Paste the sheet's "Publish to web" CSV link between the quotes below, e.g.
   "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv"
   Once it is set, notices come from the sheet and the NOTICES list below is only
   used as a backup if the sheet can't be reached. Leave it "" to use the list. */
window.NOTICES_SHEET_CSV = "";

/* Notice fields:
     date:     "2026-10-10" (YYYY-MM-DD) or "" if no date
     category: "Exam" | "Academic" | "Workshop" | "Admission" | "General"
     title, text: what students should know
     link:     URL of the PDF / Drive file, or "" if none            */
window.NOTICES = [
  {
    date: "",
    category: "Academic",
    title: "Class Coordinator List",
    text: "Class coordinators for each semester of the Mechanical Engineering diploma.",
    link: "https://drive.google.com/drive/folders/1TZj_ucwLjfiqIxKd9nuzv6m1PWwkYoy8?usp=sharing",
  },
];

/* Activity fields:
     youtube:  the video ID (the part after watch?v= in the YouTube link)
     category: "Project & Exhibition" | "Industrial Visit" | "Sports & Culture" | "Awareness"
     year:     "2025" or "" if not known
     title, text ("" is fine), link (optional extra link)          */
window.ACTIVITIES = [
  { youtube: "jBYtiCcspv0", category: "Sports & Culture", year: "2025",
    title: "Sports Week 2025", text: "", link: "" },
  { youtube: "IycKb1dhUdA", category: "Industrial Visit", year: "",
    title: "Industrial visit at SEKO Shivam Engitech Private Limited", text: "", link: "" },
  { youtube: "xe8e20yyZuc", category: "Awareness", year: "",
    title: "Vikas Saptah", text: "", link: "" },
  { youtube: "QVEnMTi5g2k", category: "Industrial Visit", year: "",
    title: "Visit to Siemens Centre of Excellence", text: "", link: "" },
  { youtube: "bjZFTeRDTug", category: "Project & Exhibition", year: "2024",
    title: "Project Fair 2024, Government Polytechnic Chhotaudepur", text: "", link: "" },
  { youtube: "ggZJIOchn10", category: "Project & Exhibition", year: "2024",
    title: "Model Presentation 2024", text: "", link: "" },
  { youtube: "emQEKTMBigI", category: "Project & Exhibition", year: "2024",
    title: "Project Fair 2024, Mechanical Department", text: "", link: "" },
  { youtube: "DLtYzkD5usc", category: "Industrial Visit", year: "",
    title: "Industrial visit at Shree Parantap Institute of CNC Programming (Mechanical Branch)", text: "", link: "" },
  { youtube: "dhS1A6qHRGw", category: "Industrial Visit", year: "",
    title: "Industrial visit at Shree Parantap Institute of CNC Programming", text: "",
    link: "http://parantapcnc.com/" },
  { youtube: "WoB2mxtSpw8", category: "Project & Exhibition", year: "",
    title: "Poster Presentation Event",
    text: "An academic gathering showcasing student research work and promoting knowledge exchange within mechanical engineering.", link: "" },
  { youtube: "sw0vlnMkjfI", category: "Sports & Culture", year: "2024",
    title: "Sports Week 2024", text: "", link: "" },
  { youtube: "NmMBPZTtD5U", category: "Awareness", year: "",
    title: "World Environment Day celebration",
    text: "A celebration highlighting environmental conservation and sustainability, and the role of mechanical engineering in addressing environmental challenges.", link: "" },
  { youtube: "CA3vbZK_nTY", category: "Project & Exhibition", year: "2023",
    title: "Project Fair 2023",
    text: "A showcase of the innovative and impactful projects undertaken by mechanical engineering students.", link: "" },
];

/* MESSAGE FROM THE HEAD OF DEPARTMENT (shown on the Home page)
   Fill in the name and the message. Leave message "" and the section stays hidden.
   photo: upload the HOD's photo to assets/img/ (e.g. assets/img/hod.jpg) and put the path here,
          or leave "" to show initials instead.
   Start a new paragraph in the message with \n\n                                              */
window.HOD = {
  name: "",
  designation: "Head of Department, Mechanical Engineering",
  photo: "",
  message: "",
};

/* Download fields: title, text, icon (Material Symbols name), link */
window.DOWNLOADS = [
  { title: "Student Fees Payment", text: "Pay fees online through the e-Shiksha ERP portal", icon: "payments",
    link: "https://erp.eshiksa.net/esh/index.php?plugin=Login&action=index" },
  { title: "Syllabus (New)", text: "Current GTU curriculum for all semesters", icon: "menu_book",
    link: "https://drive.google.com/drive/folders/1Qo0YH-Qe9ZoJ9MOmHO3X0T_PvgNm_asL?usp=sharing" },
  { title: "Lab Manuals (New Syllabus)", text: "Practical manuals as per the new syllabus", icon: "science",
    link: "https://drive.google.com/drive/folders/1GCslWGyRF3LX-OgEA76mdFmzEQzCvCoU?usp=sharing" },
  { title: "Subject & Class Coordinators", text: "Subject and class coordinator information", icon: "groups",
    link: "https://drive.google.com/drive/folders/1TZj_ucwLjfiqIxKd9nuzv6m1PWwkYoy8?usp=sharing" },
  { title: "Student Application Form", text: "Student application forms", icon: "assignment",
    link: "https://drive.google.com/drive/folders/1uudWV_cuo4ltYxFic5W97CPMNqUnvTDy?usp=sharing" },
  { title: "Academic Calendar (Institute)", text: "Term dates, exams and holidays of GP Chhotaudepur", icon: "calendar_month",
    link: "academic-calendar.html" },
  { title: "GTU Academic Calendar", text: "University calendar for diploma programmes", icon: "event",
    link: "https://www.gtu.ac.in/academics/academic-calendar" },
  { title: "GTU Result", text: "Check GTU examination results", icon: "grading",
    link: "https://www.gtu.ac.in/student-corner/examination/result-list" },
  { title: "Study Material", text: "Lerning Resources like Question bank, Handwritten notes", icon: "history_edu",
    link: "https://drive.google.com/drive/folders/1i4ahuAOjvRf8glsrNvFyKrVAGlzQGLxv?usp=sharing" },
  { title: "Lab Manuals (Old Syllabus)", text: "Practical manuals as per the old syllabus", icon: "inventory_2",
    link: "https://drive.google.com/drive/folders/1pKQ_n2MduTtWDhCy5pOlbbPE42BVnEJU?usp=share_link" },
];

/* FACULTY CORNER (faculty.html)
   Each link should be a Google Drive folder, Sheet or file whose sharing is "Restricted" and
   shared only with the faculty Gmail IDs. Google then asks faculty to sign in, and nobody else
   can open it, even though the link itself is visible in this file.
   NEVER use "Anyone with the link" for these files.
   group: "NBA / SAR Evidence" | "Meetings & Circulars" | "Student Records & Results" | "Timetables & Lab Records"
   Leave link "" and the card shows "Not linked yet".                                              */
window.FACULTY_LINKS = [
  { group: "NBA / SAR Evidence", title: "1_Program_Files", text: "", icon: "folder", link: "https://drive.google.com/drive/folders/1iCgCbs-dhgt-3QpI35RYBd3OhCpfvom0?usp=sharing" },
  { group: "NBA / SAR Evidence", title: "2_SAR_Mechanical", text: "", icon: "folder_special", link: "https://drive.google.com/drive/folders/1W_uduplqiMVTNRE6Uz1rWauo6TlFdp_B?usp=sharing" },
];
