import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "requests.json");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "dist")));

async function readRequests() {
  try {
    const data = await fs.readFile(dataFile, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeRequests([]);
      return [];
    }
    throw error;
  }
}

function writeRequests(requests) {
  return fs.writeFile(dataFile, JSON.stringify(requests, null, 2), "utf8");
}

function validateRequest(body) {
  const fields = ["studentName", "email", "category", "description", "priority"];
  const missing = fields.filter((field) => !String(body[field] ?? "").trim());

  if (missing.length) {
    return `Required fields missing: ${missing.join(", ")}`;
  }
  if (!/^\S+@\S+\.\S+$/.test(body.email)) {
    return "Please provide a valid email address.";
  }
  if (!['Low', 'Medium', 'High'].includes(body.priority)) {
    return "Priority must be Low, Medium, or High.";
  }
  return null;
}

function requestDetails(body) {
  return {
    studentName: body.studentName.trim(),
    email: body.email.trim(),
    category: body.category.trim(),
    description: body.description.trim(),
    priority: body.priority
  };
}

app.get("/api/requests", async (_req, res, next) => {
  try {
    res.json(await readRequests());
  } catch (error) {
    next(error);
  }
});

app.get("/api/requests/:id", async (req, res, next) => {
  try {
    const request = (await readRequests()).find((item) => item.id === Number(req.params.id));
    if (!request) return res.status(404).json({ message: "Request not found." });
    res.json(request);
  } catch (error) {
    next(error);
  }
});

app.post("/api/requests", async (req, res, next) => {
  try {
    const error = validateRequest(req.body);
    if (error) return res.status(400).json({ message: error });

    const requests = await readRequests();
    const request = {
      id: requests.length ? Math.max(...requests.map((item) => item.id)) + 1 : 1,
      ...requestDetails(req.body),
      createdAt: new Date().toISOString()
    };
    requests.push(request);
    await writeRequests(requests);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

app.put("/api/requests/:id", async (req, res, next) => {
  try {
    const error = validateRequest(req.body);
    if (error) return res.status(400).json({ message: error });

    const requests = await readRequests();
    const index = requests.findIndex((item) => item.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Request not found." });

    requests[index] = { ...requests[index], ...requestDetails(req.body), updatedAt: new Date().toISOString() };
    await writeRequests(requests);
    res.json(requests[index]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/requests/:id", async (req, res, next) => {
  try {
    const requests = await readRequests();
    const index = requests.findIndex((item) => item.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Request not found." });

    const [deletedRequest] = requests.splice(index, 1);
    await writeRequests(requests);
    res.json({ message: "Request deleted.", request: deletedRequest });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Could not process the request." });
});

app.listen(port, () => {
  console.log(`Help Desk is running at http://localhost:${port}`);
});
