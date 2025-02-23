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

async function createProduct() {



}

// createProduct: A method that creates a product in the database and then returns the created record.

async function createFavorite() {}

// createFavorite: A method that creates a favorite in the database and then returns the created record,

async function createUser(username, password) {
    const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    
    `;

    const hashedPassword = await bcrypt.hash(password, 5);
    result = client.query(SQL, [uuid.v4(), username, hashedPassword])


}

// createUser: A method that creates a user in the database and then returns the created record. The password of the user should be hashed by using Bcrypt.

async function fetchUsers() {

const SQL = `
SELECT * FROM users;

`;
result = await client.query(SQL)
return result.rows;


}

// fetchUsers: A method that returns an array of users in the database.

async function fetchProducts() {}

// fetchProducts: A method that returns an array of products in the database.

async function fetchFavorites() {}

// fetchFavorites: A method that returns an array of favorites for a user,

async function destroyFavorite() {}

// destroyFavorite: A method that deletes a favorite in the database.
const init = async () => {
  console.log("init db layer");
  await client.connect();
  await createTables();
  await createUser("smilingjoe", "password");
  await createUser("frowningFrank", "password");
  console.table(await fetchUsers())
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
