const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(
  "postgres://morganmaccarthy:postgres@localhost:5432/acme_store_db"
);

async function createTables() {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100)
    );

    CREATE TABLE products(
    id UUID PRIMARY KEY,
    name VARCHAR(50)
    );

    CREATE TABLE favorites(
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES users(id) NOT NULL,
    CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
    );
    
    `;
  await client.query(SQL);
}

// createTables: A method that drops and creates the tables for your application.

async function createProduct({ name }) {
  const SQL = `
  INSERT INTO products(id, name) VALUES($1, $2) RETURNING *
`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
}

// createProduct: A method that creates a product in the database and then returns the created record.

async function createUser(username, password) {
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    
    `;

  const hashedPassword = await bcrypt.hash(password, 5);
  result = await client.query(SQL, [uuid.v4(), username, hashedPassword]);
  return result.rows[0];
}

// createUser: A method that creates a user in the database and then returns the created record. The password of the user should be hashed by using Bcrypt.

async function createFavorite(product_id, user_id) {
  const SQL = `
    INSERT INTO favorites(id, product_id, user_id) VALUES ($1, $2, $3) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), product_id, user_id]);
  return response.rows[0];
}

// createFavorite: A method that creates a favorite in the database and then returns the created record,

async function fetchUsers() {
  const SQL = `
SELECT * FROM users;

`;
  result = await client.query(SQL);
  return result.rows;
}

// fetchUsers: A method that returns an array of users in the database.

async function fetchProducts() {
  const SQL = `
  SELECT * FROM products;
`;
  const response = await client.query(SQL);
  return response.rows[0];
}

// fetchProducts: A method that returns an array of products in the database.

async function fetchFavorites() {
  const SQL = `
    SELECT * FROM favorites;
  `;
  const response = await client.query(SQL);
  return response.rows;
}

// fetchFavorites: A method that returns an array of favorites for a user,

async function destroyFavorite(id, user_id) {
  const SQL = `
  DELETE FROM favorites
  WHERE id = $1 AND user_id = $2
`;
  await client.query(SQL, [id, user_id]);
}

// destroyFavorite: A method that deletes a favorite in the database.
const init = async () => {
  console.log("init db layer");
  await client.connect();
  await createTables();
  await createUser("smilingjoe", "password");
  await createUser("frowningFrank", "password");
  console.table(await fetchUsers());
};

module.exports = {
  init,
  createProduct,
  createFavorite,
  createUser,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  destroyFavorite,
};
