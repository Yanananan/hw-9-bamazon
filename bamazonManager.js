var mysql = require("mysql");
var inquirer = require("inquirer");
var utility = require("./utility.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ym",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    runApp();
});

function runApp(){
    inquirer.prompt([
        {
            type: "list",
            message: "Please choose an action.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "action"
        }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.action=="View Products for Sale"){
            viewProducts();
        } else if (inquirerResponse.action=="View Low Inventory"){
            viewLow();
        } else if (inquirerResponse.action=="Add to Inventory"){
            addInventory();
        } else {
            addProduct();
        }
    });
}

function viewProducts(){
    console.log("Displaying available items...\n");
    var query = connection.query(
        "SELECT * FROM products LEFT JOIN departments ON departments.department_id = products.dep_id",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {
                var columns = ["item_id","product_name","dep_id","department_name","price","stock_quantity"];
                utility.logTable(columns,mysqlRes);
            }
            console.log("end connection");
            connection.end();
        }
    );
    console.log("display all items: "+query.sql+ "\n");
}

function viewLow(){
    console.log("Displaying items low in stock...\n");
    var query = connection.query(
        "SELECT * from products LEFT JOIN departments ON departments.department_id = products.dep_id WHERE stock_quantity < 5",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {
                var columns = ["item_id","product_name","dep_id","department_name","price","stock_quantity"];
                utility.logTable(columns,mysqlRes);
            }
            console.log("end connection");
            connection.end();
        }
    );
    console.log("display items low in stock: "+query.sql+ "\n");
}

function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter id of the item to replenish:",
            name: "item_id",
            validate: utility.validateQuantity
        },
        {
            type: "input",
            message: "Enter amount to replenish:",
            name: "quantity",
            validate: utility.validateQuantity
        }
    ])
    .then(function(inquirerResponse) {
        var query = connection.query(
            "SELECT * FROM products WHERE ?",
            [{
                item_id: inquirerResponse.item_id
            }],
            function(err, mysqlRes) {
                if (err){
                    console.log(err);
                }
                var query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                        stock_quantity: mysqlRes[0].stock_quantity+parseInt(inquirerResponse.quantity),
                    },
                    {
                        item_id: inquirerResponse.item_id
                    }],
                    function(err, res) {
                        if (err){
                            console.log(err);
                        }
                        console.log("end connection");
                        connection.end();
                    }
                );
                console.log("retrieving quantity: "+query.sql);
            }
        );
        console.log("retrieving product: "+query.sql);
    });
}

function addProduct(){
    console.log("Displaying available departments...\n");
    var query = connection.query(
        "SELECT * FROM departments",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {
                var columns = ["department_id","department_name"]
                utility.logTable(columns,mysqlRes);
            }
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter product name:",
                    name: "product_name"
                },
                {
                    type: "input",
                    message: "Enter department id:",
                    name: "dep_id"
                },
                {
                    type: "input",
                    message: "Enter price:",
                    name: "price",
                    validate: utility.validatePrice
                },
                {
                    type: "input",
                    message: "Enter stock quantity:",
                    name: "stock_quantity",
                    validate: utility.validateQuantity
                }
            ])
            .then(function(inquirerResponse) {
                var query = connection.query(
                    "INSERT INTO products SET ?",
                    {
                        product_name: inquirerResponse.product_name,
                        dep_id: inquirerResponse.dep_id,
                        price: inquirerResponse.price,
                        stock_quantity: inquirerResponse.stock_quantity,
                        product_sales: 0
                    },
                    function(err, res) {
                        if (err){
                            console.log(err);
                        }
                        console.log("end connection");
                        connection.end();
                    });
                console.log("adding new product: "+query.sql);
            });
        }
    );
    console.log("display all departments: "+query.sql+ "\n");
}