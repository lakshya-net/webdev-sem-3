import express from "express";
const app = express();

app.use(express.json());


let users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" }
];


app.get("/users", (req, res) => {
  res.json(users);
});

// GET - Retrieve user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// POST - Create a new user
app.post("/users", (req, res) => {
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - Update a user
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

// Server listening
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// delete - Delete a user
app.delete("/users/:id", (req, res) => {
  users=users.filter(u => u.id !== parseInt(req.params.id));
  res.send({ message: "User deleted" });
});