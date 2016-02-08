/**
 * Created by mertsalik on 08/02/16.
 */


function create_grid(containerElement, x, y) {
    for (var i = 0; i < x; i++) {
        $(containerElement).append("<div class='row'></div>");
        var $row = $(containerElement).find(".row:last-child");
        for (var j = 0; j < y; j++) {
            var color = get_random_hex_code();
            $row.append("<div class='col' style='background-color: " + color + ";'></div>");
        }
    }
}

function get_random_hex_code() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}