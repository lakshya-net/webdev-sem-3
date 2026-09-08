# webdev-sem-3

## Day 1: Git commands

```text
git status
git init
git add .
git commit -m "blah blah"
git branch -M main
git remote add origin "repo link"
git push -u origin main
```

## Product REST API

From `webdev-sem-3/restAPI`, install dependencies and start the server:

```sh
npm install
npm start
```

The API runs at `http://localhost:3000` and loads 100 products from
[products.js](./restAPI/products.js).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/products` | List all products |
| GET | `/products/:id` | Get one product |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Replace a product |
| PATCH | `/products/:id` | Update selected fields |
| DELETE | `/products/:id` | Delete a product |

`GET /products` also supports `category` and `search` query parameters.
Import [product-api.json](./restAPI/product-api.json) into Thunder Client to
run all product requests. POST and PUT requests need JSON bodies containing
`name`, `category`, `price`, and `stock`.
