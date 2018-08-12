// contains functions commonly used by bamazon users

module.exports = {
    validateQuantity: function (quantity){//validate for integers
        var regex = /^\d+$/;
        return (regex.test(quantity)) || "Quantity should be a number!";
    },

    tableSpace: function (value,alignment,width){//adds alignment and spacing to table display
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
}