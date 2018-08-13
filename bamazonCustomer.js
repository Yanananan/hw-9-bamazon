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
    console.log("Displaying available items...\n");
    var query = connection.query(
        "SELECT item_id, product_name, department_name, price, stock_quantity FROM products LEFT JOIN departments ON departments.department_id = products.dep_id",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {
                var columns = ["item_id", "product_name", "department_name", "price", "stock_quantity"];
                utility.logTable(columns,mysqlRes);
            }
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter item_id of the item you want: ",
                    name: "item_id",
                    validate: utility.validateQuantity
                },
                {
                    type: "input",
                    message: "Enter the quantity desired: ",
                    name: "quantity",
                    validate: utility.validateQuantity
                },
            ])
            .then(function(inquirerResponse) {
                var query = connection.query(
                    "SELECT * from products WHERE ?",
                    {
                        item_id: inquirerResponse.item_id
                    },
                    function(err, mysqlRes) {
                        if (err){
                            console.log(err);
                        } else {
                            if (inquirerResponse.quantity<=mysqlRes[0].stock_quantity){
                                var totalPurchase = parseFloat((mysqlRes[0].price*inquirerResponse.quantity).toFixed(2));
                                var query = connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [{
                                        stock_quantity: mysqlRes[0].stock_quantity-inquirerResponse.quantity,
                                        product_sales: mysqlRes[0].product_sales+totalPurchase
                                    },
                                    {
                                        item_id: inquirerResponse.item_id
                                    }],
                                    function(err, res) {
                                        if (err){
                                            console.log(err);
                                        } else {
                                            console.log("Your total cost of purchase is $"+totalPurchase);
                                        }
                                        console.log("end connection");
                                        connection.end();
                                    }
                                );
                                console.log("update quantity: "+query.sql+ "\n");
                            } else {
                                console.log("Not enough in stock.  Cancelling purchase.");
                                console.log("end connection");
                                connection.end();
                            }
                        }
                    }
                );
                console.log("retrieving selected item: "+query.sql+ "\n");
            });
        }
    );
    console.log("display all items: "+query.sql+ "\n");
}