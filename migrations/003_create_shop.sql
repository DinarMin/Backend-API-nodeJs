CREATE TABLE IF NOT EXISTS
  products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    product_id INTEGER REFERENCES products (id),
    quantity INTEGER NOT NULL
  );