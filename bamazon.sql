DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(255) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments 
(department_name,        over_head_costs)
VALUES  
("Sports",               100.00),
("Apparels",             200.00),
("Home & Decor",         500.00),
("Books",                100.00),
("Appliances",           1000.00);

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  dep_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY (dep_id) REFERENCES departments(department_id)
);

INSERT INTO products 
(product_name,          dep_id,      price,      stock_quantity, product_sales)
VALUES  
("Nail Bat",            1,           19.99,      75,             0),
("Claimh Solais",       2,           1978.00,    1,              0),
("Lazy Shell",          3,           189.99,     5,              0),
("Corridor of Time",    3,           5900.00,    3,              0),
("Wyndia",              2,           300.00,     10,             0),
("The Velvet Room",     4,           50.99,      50,             0),
("Stray Beads",         2,           3.99,       4000,           0),
("Waddle Dee",          5,           35.00,      200,            0),
("Master Ball",         1,           25.00,      1290,           0),
("Tyreal's Might",      4,           19.00,      99,             0);