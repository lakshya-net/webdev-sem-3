import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const emptyRequest = {
  studentName: "",
  email: "",
  category: "",
  description: "",
  priority: "Medium"
};

async function api(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function RequestForm({ editingRequest, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyRequest);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(editingRequest ? {
      studentName: editingRequest.studentName,
      email: editingRequest.email,
      category: editingRequest.category,
      description: editingRequest.description,
      priority: editingRequest.priority
    } : emptyRequest);
    setMessage("");
  }, [editingRequest]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    const isEditing = Boolean(editingRequest);
    setIsSaving(true);
    setIsError(false);
    setMessage(isEditing ? "Saving…" : "Submitting…");
    try {
      await api(isEditing ? `/api/requests/${editingRequest.id}` : "/api/requests", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setForm(emptyRequest);
      setMessage(isEditing ? "Request updated." : "Request submitted.");
      onSaved();
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  function cancel() {
    setForm(emptyRequest);
    setMessage("Edit cancelled.");
    onCancel();
  }

  return <section className="panel" aria-labelledby="form-title">
    <div className="section-heading">
      <div>
        <h2 id="form-title">{editingRequest ? `Editing request #${editingRequest.id}` : "New request"}</h2>
        <p>{editingRequest ? "Update the details, then save your changes." : "Tell us how we can help."}</p>
      </div>
      {editingRequest && <button className="text-button" type="button" onClick={cancel}>Cancel edit</button>}
    </div>
    <form onSubmit={submit}>
      <div className="form-grid">
        <label>Student Name<input name="studentName" value={form.studentName} onChange={updateField} required maxLength="80" placeholder="Your full name" /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required maxLength="120" placeholder="you@college.edu" /></label>
        <label>Category
          <select name="category" value={form.category} onChange={updateField} required>
            <option value="">Choose a category</option>
            <option>Facilities</option><option>IT Support</option><option>Academic</option><option>Hostel</option><option>Other</option>
          </select>
        </label>
        <label>Priority
          <select name="priority" value={form.priority} onChange={updateField} required>
            <option>Medium</option><option>Low</option><option>High</option>
          </select>
        </label>
        <label className="full-width">Problem Description<textarea name="description" value={form.description} onChange={updateField} required maxLength="600" rows="5" placeholder="Describe the problem or request clearly" /></label>
      </div>
      <div className="form-footer"><span className={isError ? "error" : "success"} role="status">{message}</span><button type="submit" disabled={isSaving}>{isSaving ? "Please wait…" : editingRequest ? "Save changes" : "Submit request"}</button></div>
    </form>
  </section>;
}

function RequestsList({ requests, loading, onEdit, onDelete, onRefresh }) {
  return <section className="requests-section" aria-labelledby="requests-title">
    <div className="section-heading"><div><h2 id="requests-title">Submitted requests</h2><p>{loading ? "Loading requests…" : `${requests.length} request${requests.length === 1 ? "" : "s"} submitted`}</p></div><button className="secondary-button" type="button" onClick={onRefresh}>Refresh</button></div>
    <div className="requests-list">
      {!loading && !requests.length && <p className="empty-state">No requests yet. Your submitted requests will appear here.</p>}
      {[...requests].reverse().map((request) => <article className="request-card" key={request.id}>
        <div className="card-top"><div><p className="request-category">{request.category}</p><h3>{request.studentName}</h3></div><span className={`priority ${request.priority.toLowerCase()}`}>{request.priority}</span></div>
        <p className="request-description">{request.description}</p>
        <div className="request-meta"><span>{request.email}</span><span>Submitted {new Date(request.createdAt).toLocaleDateString()}</span></div>
        <div className="card-actions"><button className="secondary-button" type="button" onClick={() => onEdit(request)}>Edit</button><button className="delete-button" type="button" onClick={() => onDelete(request.id)}>Delete</button></div>
      </article>)}
    </div>
  </section>;
}

function App() {
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);
    try { setRequests(await api("/api/requests")); }
    catch (error) { alert(error.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadRequests(); }, []);

  async function deleteRequest(id) {
    if (!window.confirm("Delete this request?")) return;
    try {
      await api(`/api/requests/${id}`, { method: "DELETE" });
      if (editingRequest?.id === id) setEditingRequest(null);
      await loadRequests();
    } catch (error) { alert(error.message); }
  }

  return <main className="container">
    <header><p className="eyebrow">CAMPUS SUPPORT PORTAL</p><h1>Help Desk</h1><p>Submit a campus issue or request and keep track of it in one place.</p></header>
    <RequestForm editingRequest={editingRequest} onSaved={() => { setEditingRequest(null); loadRequests(); }} onCancel={() => setEditingRequest(null)} />
    <RequestsList requests={requests} loading={loading} onEdit={setEditingRequest} onDelete={deleteRequest} onRefresh={loadRequests} />
  </main>;
}

createRoot(document.querySelector("#root")).render(<App />);
