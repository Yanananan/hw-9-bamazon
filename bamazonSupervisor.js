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
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "action"
        }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.action=="View Product Sales by Department"){
            viewSales();
        } else {
            addDepartment();
        }
    });
}

function viewSales(){
    console.log("Displaying sales figures...\n");
    var query = connection.query(
        "SELECT department_id, department_name, over_head_costs, SUM(product_sales) AS product_sales, SUM(product_sales)-over_head_costs AS total_profit FROM departments LEFT JOIN products ON departments.department_id = products.dep_id GROUP BY department_id",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {
                var columns = ["department_id","department_name","over_head_costs","product_sales","total_profit"];
                utility.logTable(columns,mysqlRes);
            }
            console.log("end connection");
            connection.end();
        }
    );
    console.log("display sales figures: "+query.sql+ "\n");
}

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter department name:",
            name: "department_name"
        },
        {
            type: "input",
            message: "Enter over-head costs:",
            name: "over_head_costs",
            validate: utility.validatePrice
        }
    ])
    .then(function(inquirerResponse) {
        var query = connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: inquirerResponse.department_name,
                over_head_costs: inquirerResponse.over_head_costs,
            },
            function(err, res) {
                if (err){
                    console.log(err);
                }
                console.log("end connection");
                connection.end();
            });
        console.log("adding new department: "+query.sql);
    });
}