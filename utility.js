// contains functions commonly used by bamazon users

module.exports = {
    validateQuantity: function (quantity){//validate for integers
        var regex = /^\d+$/;
        return (regex.test(quantity)&&quantity>0) || "Please enter a positive integer!";
    },

    

    validatePrice: function (price){//validate for price
        var regex  = /^\d+(?:\.\d{2})$/;
        return (regex.test(price)) || "Enter price in the format xxx.xx."
    },

    logTable: function (columns, data){//log table in console, columns is an array of column names, data is mysqlRes
        //first determine column width. if content is wider than column name, width should increase
        var columnWidths = []
        for (var i in columns){
            var columnWidth = columns[i].length;
            for (var j in data){
                if ((data[j][columns[i]]).toString().length>columnWidth){
                    columnWidth = (data[j][columns[i]]).toString().length;
                }
            }
            (columnWidths).push(columnWidth+2);
        }
        //then create border: +---------------+-------------------+-----------------+
        var numColumns = columns.length;
        var border = "+";
        for (var i in columnWidths){
            for (var j=0; j<columnWidths[i]; j++){
                border = border + "-";
            }
            border = border + "+";
        }
        console.log(border);
        //then create column names: | department_id | department_name   | over_head_costs |
        var columnNames = "|";
        for (var i in columns){
            columnNames = columnNames + tableSpace(columns[i],columnWidths[i]) + "|";
        }
        console.log(columnNames);
        //then another border
        console.log(border);
        //then the body of the table
        for (var j in data){
            var tableRow = "|";
            for (var i in columns){
                tableRow = tableRow + tableSpace(data[j][columns[i]],columnWidths[i]);
                tableRow = tableRow + "|";
            }
            console.log(tableRow);
        }
        //then another border
        console.log(border);
    }
}

function tableSpace(value,width){//adds alignment and spacing to table display
    var spaceLength = width - value.toString().length;
    if (typeof(value)=="string"){
        var alignment = "L"
    } else {
        var alignment = "R"
    }
    value = value + " ";
    value = " " + value;
    if (alignment == "L"){
        for (var i = 2; i<spaceLength; i++){
            value = value + " ";
        }
    } else {
        for (var i = 2; i<spaceLength; i++){
            value = " " + value;
        }
    }
    return value;
}