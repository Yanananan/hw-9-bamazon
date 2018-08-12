var mysql = require("mysql");
var inquirer = require("inquirer");

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

function tableSpace(value,alignment,width){
    var spaceLength = width - value.toString().length;
    if (alignment == "L"){
        for (var i = 0; i<spaceLength; i++){
            value = value + " ";
        }
    } else {
        for (var i = 0; i<spaceLength; i++){
            value = " " + value;
        }
    }
    return value;
}

function validateQuantity(quantity){
    var regex = /^\d+$/;
    return (regex.test(quantity)) || "Quantity should be a number!";
 }

function runApp(){
    console.log("Displaying available items...\n");
    var query = connection.query(
        "SELECT * FROM products",
        function(err, mysqlRes) {
            if (err){
                console.log(err);
            } else {//9,20,17,9,16
                console.log("+---------+--------------------+-----------------+---------+----------------+");
                console.log("| item_id | product_name       | department_name |   price | stock_quantity |");
                console.log("+---------+--------------------+-----------------+---------+----------------+");
                for (var i in mysqlRes){
                    console.log("| "+tableSpace(mysqlRes[i].item_id,"R",7)+
                    " | "+tableSpace(mysqlRes[i].product_name,"L",18)+
                    " | "+tableSpace(mysqlRes[i].department_name,"L",15)+
                    " | "+tableSpace(mysqlRes[i].price,"R",7)+
                    " | "+tableSpace(mysqlRes[i].stock_quantity,"R",14)+" |");
                }
                console.log("+---------+--------------------+-----------------+---------+----------------+");
            }
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter item_id of the item you want: ",
                    name: "item_id"
                },
                {
                    type: "input",
                    message: "Enter the quantity desired: ",
                    name: "quantity",
                    validate: validateQuantity
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
                                var query = connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [{
                                        stock_quantity: mysqlRes[0].stock_quantity-inquirerResponse.quantity
                                    },
                                    {
                                        item_id: inquirerResponse.item_id
                                    }],
                                    function(err, res) {
                                        if (err){
                                            console.log(err);
                                        } else {
                                            console.log("Your total cost of purchase is $"+mysqlRes[0].price*inquirerResponse.quantity);
                                        }
                                        console.log("end connection");
                                        connection.end();
                                    }
                                );
                                console.log("update quantity: "+query.sql);
                            } else {
                                console.log("Not enough in stock.  Cancelling purchase.");
                                console.log("end connection");
                                connection.end();
                            }
                        }
                    }
                );
                console.log("retrieving selected item: "+query.sql);
            });
        }
    );
    console.log("display all items: "+query.sql);
}