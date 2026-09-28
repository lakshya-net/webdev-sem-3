const http = require("http");
const fs = require("fs");

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = __filename.replace(/index\.js$/, "students.json");

function sendHtml(response, statusCode, content) {
  response.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  response.end(content);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getStudents(callback) {
  fs.readFile(DATA_FILE, "utf8", (error, data) => {
    if (error && error.code === "ENOENT") return callback(null, []);
    if (error) return callback(error);

    try {
      callback(null, JSON.parse(data || "[]"));
    } catch (parseError) {
      callback(parseError);
    }
  });
}

function saveStudents(students, callback) {
  fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), "utf8", callback);
}

function parseFormData(body) {
  return body.split("&").reduce((values, pair) => {
    const [rawKey, rawValue = ""] = pair.split("=");
    const key = decodeURIComponent(rawKey.replace(/\+/g, " "));
    const value = decodeURIComponent(rawValue.replace(/\+/g, " "));
    values[key] = value.trim();
    return values;
  }, {});
}

function layout(title, body) {
  return `<!doctype html>
  <html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title><style>
    :root { color-scheme: light; --blue:#1d4ed8; --ink:#172033; --muted:#62708a; --line:#d8e0ec; }
    * { box-sizing:border-box; } body { margin:0; background:#f3f6fb; color:var(--ink); font:16px/1.5 Arial,sans-serif; }
    main { width:min(100% - 32px,900px); margin:48px auto; } .card { background:#fff; border:1px solid var(--line); border-radius:16px; padding:28px; box-shadow:0 10px 30px #1e3a5f12; }
    h1 { margin:0 0 6px; } h2 { margin:38px 0 14px; } p { color:var(--muted); } form { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px; }
    label { font-weight:700; font-size:.9rem; } input { display:block; width:100%; margin-top:6px; padding:11px; border:1px solid #bfcce0; border-radius:8px; font:inherit; } input:focus { outline:3px solid #bfdbfe; border-color:var(--blue); }
    button { grid-column:1/-1; justify-self:start; background:var(--blue); color:#fff; border:0; border-radius:8px; padding:11px 18px; font:700 1rem Arial,sans-serif; cursor:pointer; } button:hover { background:#1e40af; }
    table { width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--line); border-radius:12px; overflow:hidden; } th,td { padding:12px; text-align:left; border-bottom:1px solid var(--line); } th { color:#3b4b63; background:#eef4ff; } tr:last-child td { border-bottom:0; } .empty { padding:22px; color:var(--muted); border:1px dashed #bfcce0; border-radius:12px; }
    .message { padding:12px; margin:18px 0; border-radius:8px; background:#dcfce7; color:#166534; } @media(max-width:600px) { form { grid-template-columns:1fr; } main { margin:24px auto; } .card { padding:20px; } table { font-size:.85rem; } th,td { padding:9px; } }
  </style></head><body><main>${body}</main></body></html>`;
}

function homePage() {
  return layout("Student Records", `<section class="card"><h1>Welcome to Student Records</h1><p>Add a student's details below. Records are saved in <code>students.json</code>.</p>
    <form method="POST" action="/students">
      <label>Student Name<input name="studentName" required maxlength="80" placeholder="Enter full name"></label>
      <label>Roll Number<input name="rollNumber" required maxlength="30" placeholder="Enter roll number"></label>
      <label>Course<input name="course" required maxlength="80" placeholder="e.g. BCA"></label>
      <label>Email<input name="email" type="email" required maxlength="120" placeholder="student@example.com"></label>
      <button type="submit">Add Student</button>
    </form></section><p><a href="/students">View all student records</a></p>`);
}

function studentsPage(students, saved) {
  const rows = students.map((student) => `<tr><td>${escapeHtml(student.studentName)}</td><td>${escapeHtml(student.rollNumber)}</td><td>${escapeHtml(student.course)}</td><td>${escapeHtml(student.email)}</td></tr>`).join("");
  const content = students.length
    ? `<table><thead><tr><th>Name</th><th>Roll Number</th><th>Course</th><th>Email</th></tr></thead><tbody>${rows}</tbody></table>`
    : `<p class="empty">No student records have been added yet.</p>`;
  return layout("Student Records", `<section class="card"><h1>Student Records</h1><p>All records saved in students.json.</p>${saved ? '<p class="message">Student added successfully.</p>' : ""}${content}<p><a href="/">Add another student</a></p></section>`);
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/") {
    return sendHtml(response, 200, homePage());
  }

  if (request.method === "GET" && url.pathname === "/students") {
    return getStudents((error, students) => {
      if (error) return sendHtml(response, 500, layout("Error", "<h1>Could not read student records.</h1>"));
      sendHtml(response, 200, studentsPage(students, url.searchParams.get("saved") === "1"));
    });
  }

  if (request.method === "POST" && url.pathname === "/students") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10000) request.destroy();
    });
    request.on("end", () => {
      const student = parseFormData(body);
      const required = ["studentName", "rollNumber", "course", "email"];
      if (required.some((field) => !student[field])) {
        return sendHtml(response, 400, layout("Missing Details", '<h1>Please complete every field.</h1><p><a href="/">Back to form</a></p>'));
      }

      getStudents((readError, students) => {
        if (readError) return sendHtml(response, 500, layout("Error", "<h1>Could not read student records.</h1>"));
        students.push({ ...student, createdAt: new Date().toISOString() });
        saveStudents(students, (writeError) => {
          if (writeError) return sendHtml(response, 500, layout("Error", "<h1>Could not save the student record.</h1>"));
          response.writeHead(303, { Location: "/students?saved=1" });
          response.end();
        });
      });
    });
    return;
  }

  sendHtml(response, 404, layout("Not Found", '<h1>404 — Page not found</h1><p><a href="/">Go to Student Records</a></p>'));
});

server.listen(PORT, () => {
  console.log(`Student Records is running at http://localhost:${PORT}`);
});
