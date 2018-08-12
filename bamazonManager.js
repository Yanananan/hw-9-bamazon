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
        "SELECT * FROM products",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {
                console.log("+---------+--------------------+-----------------+---------+----------------+");
                console.log("| item_id | product_name       | department_name |   price | stock_quantity |");
                console.log("+---------+--------------------+-----------------+---------+----------------+");
                for (var i in mysqlRes){
                    console.log("| "+utility.tableSpace(mysqlRes[i].item_id,"R",7)+
                    " | "+utility.tableSpace(mysqlRes[i].product_name,"L",18)+
                    " | "+utility.tableSpace(mysqlRes[i].department_name,"L",15)+
                    " | "+utility.tableSpace(mysqlRes[i].price,"R",7)+
                    " | "+utility.tableSpace(mysqlRes[i].stock_quantity,"R",14)+" |");
                }
                console.log("+---------+--------------------+-----------------+---------+----------------+");
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
        "SELECT * from products WHERE stock_quantity < 5",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {
                console.log("+---------+--------------------+-----------------+---------+----------------+");
                console.log("| item_id | product_name       | department_name |   price | stock_quantity |");
                console.log("+---------+--------------------+-----------------+---------+----------------+");
                for (var i in mysqlRes){
                    console.log("| "+utility.tableSpace(mysqlRes[i].item_id,"R",7)+
                    " | "+utility.tableSpace(mysqlRes[i].product_name,"L",18)+
                    " | "+utility.tableSpace(mysqlRes[i].department_name,"L",15)+
                    " | "+utility.tableSpace(mysqlRes[i].price,"R",7)+
                    " | "+utility.tableSpace(mysqlRes[i].stock_quantity,"R",14)+" |");
                }
                console.log("+---------+--------------------+-----------------+---------+----------------+");
            }
            console.log("end connection");
            connection.end();
        }
    );
    console.log("display items low in stock: "+query.sql+ "\n");
}


//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.