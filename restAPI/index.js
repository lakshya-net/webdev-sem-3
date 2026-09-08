import express from "express";
import { products as initialProducts } from "./products.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" }
];

let products = initialProducts.map((product) => ({ ...product }));

const getNextId = (items) =>
  items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const getProductId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const validateProduct = (body, partial = false) => {
  const requiredFields = ["name", "category", "price", "stock"];
  if (!partial && requiredFields.some((field) => body[field] === undefined)) {
    return "name, category, price and stock are required";
  }

  if (body.name !== undefined && (typeof body.name !== "string" || !body.name.trim())) {
    return "name must be a non-empty string";
  }
  if (body.category !== undefined && (typeof body.category !== "string" || !body.category.trim())) {
    return "category must be a non-empty string";
  }
  if (body.price !== undefined && (typeof body.price !== "number" || body.price < 0)) {
    return "price must be a non-negative number";
  }
  if (body.stock !== undefined && (!Number.isInteger(body.stock) || body.stock < 0)) {
    return "stock must be a non-negative integer";
  }

  return null;
};

// Product REST API
app.get("/products", (req, res) => {
  const { category, search } = req.query;
  let result = products;

  if (category) {
    result = result.filter(
      (product) => product.category.toLowerCase() === String(category).toLowerCase()
    );
  }
  if (search) {
    const searchTerm = String(search).toLowerCase();
    result = result.filter((product) =>
      `${product.name} ${product.description}`.toLowerCase().includes(searchTerm)
    );
  }

  res.json({ count: result.length, products: result });
});

app.get("/products/:id", (req, res) => {
  const id = getProductId(req.params.id);
  const product = id === null ? undefined : products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

app.post("/products", (req, res) => {
  const validationError = validateProduct(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const product = {
    id: getNextId(products),
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    price: req.body.price,
    stock: req.body.stock,
    description: typeof req.body.description === "string" ? req.body.description.trim() : ""
  };
  products.push(product);
  res.status(201).json(product);
});

app.put("/products/:id", (req, res) => {
  const id = getProductId(req.params.id);
  const product = id === null ? undefined : products.find((item) => item.id === id);
  const validationError = validateProduct(req.body);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  Object.assign(product, {
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    price: req.body.price,
    stock: req.body.stock,
    description: typeof req.body.description === "string" ? req.body.description.trim() : ""
  });
  res.json(product);
});

app.patch("/products/:id", (req, res) => {
  const id = getProductId(req.params.id);
  const product = id === null ? undefined : products.find((item) => item.id === id);
  const validationError = validateProduct(req.body, true);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  for (const field of ["name", "category"]) {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field].trim();
    }
  }
  for (const field of ["price", "stock", "description"]) {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  }
  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const id = getProductId(req.params.id);
  const productIndex = id === null ? -1 : products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const [deletedProduct] = products.splice(productIndex, 1);
  res.json({ message: "Product deleted", product: deletedProduct });
});

// Existing user example
app.get("/users", (req, res) => res.json(users));

app.get("/users/:id", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const user = { id: getNextId(users), name: req.body.name, email: req.body.email };
  users.push(user);
  res.status(201).json(user);
});

app.put("/users/:id", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex((item) => item.id === Number(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  users.splice(userIndex, 1);
  res.json({ message: "User deleted" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
