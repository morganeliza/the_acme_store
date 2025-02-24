const db = require("./db");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(db.fetchUsers());

    const result = await db.fetchUsers();
    res.send(result);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    console.log("Received GET request with query params:", req.query);
    res.send(await db.fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await db.fetchFavorites(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  try {
    console.log("Received DELETE request with body:", req.body);
    await db.destroyFavorite({ user_id: req.params.userId, product_id: req.params.productId });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    console.log("Received POST request with body:", req.body);

    res.status(201).send(
      await db.createFavorite({
        user_id: req.params.id,
        favorite_id: req.body.favorite_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  app.listen(3000, () => console.log("listening on port 3000"));

  console.log("init api");
  db.init();
};

init();
