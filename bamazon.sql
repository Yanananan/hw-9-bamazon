-- 1. Create a MySQL Database called `bamazon`.

-- 2. Then create a Table inside of that database called `products`.

-- 3. The products table should have each of the following columns:

--    * item_id (unique id for each product)

--    * product_name (Name of product)

--    * department_name

--    * price (cost to customer)

--    * stock_quantity (how much of the product is available in stores)

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255),
  price DECIMAL(10,2),
  stock_quantity INT(15),
  PRIMARY KEY (item_id)
);

INSERT INTO products 
(product_name,          department_name,    price,      stock_quantity)
VALUES  
("Nail Bat",            "Sports",           19.99,      75),
("Claimh Solais",       "Apparels",         1978.00,    1),
("Lazy Shell",          "Home & Decor",     189.99,     5),
("Corridor of Time",    "Home & Decor",     5900.00,    3),
("Wyndia",              "Apparels",         300.00,     10),
("The Velvet Room",     "Books",            50.99,      50),
("Stray Beads",         "Apparels",         3.99,       4000),
("Waddle Dee",          "Appliances",       35.00,      200),
("Master Ball",         "Sports",           25.00,      1290),
("Tyreal's Might",      "Books",            19.00,      99);
