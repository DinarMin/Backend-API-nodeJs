CREATE TABLE
  orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    created_at TIMESTAMP DEFAULT NOW ()
  );

CREATE TABLE
  order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders (id),
    product_id INTEGER REFERENCES products (id),
    quantity INTEGER NOT NULL
  );