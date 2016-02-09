/**
 * Created by mertsalik on 08/02/16.
 */


(function ($) {
    var flip_directions = ["flipped-x", "flipped-y"];
    var is_auto = false;
    var current_animation = 0;
    var x = 0;
    var y = 0;
    var animation_end_callback = function () {
        console.log("Animation completed [default]");
    };
    var WaveAnimationWaterDrop = function () {
        var flip_direction = flip_directions[1];
        var water_drop_wave = function (colElements) {
            if (colElements.length > 0) {
                var allNextItems = [];
                var waveElements = [];
                for (var i = 0; i < colElements.length; i++) {
                    var colElement = colElements[i];
                    var nextItems = collect_next_items($(colElement));
                    allNextItems = allNextItems.concat(nextItems);
                    waveElements.push(colElement.find(".wave-element"));
                }

                // jColElements.contents().find(".wave-element")

                $(waveElements).toggleClass(flip_direction).delay(100).promise().done(function () {
                    var ids = [];
                    var validNextElements = [];
                    $.each(allNextItems, function (i, val) {
                        var id = $(val).attr("id");
                        if ($.inArray(id, ids) == -1) {
                            var in_current_wave = false;
                            for (var j = 0; j < colElements.length; j++) {
                                if ($(colElements[j]).attr("id") == id) {
                                    in_current_wave = true;
                                    break;
                                }
                            }
                            if (!in_current_wave) {
                                validNextElements.push(val);
                                ids.push(id);
                            }
                        }
                    });
                    if (validNextElements.length == 0 && is_auto) {
                        validNextElements.push(get_first_item_of_first_row());
                    }
                    if (validNextElements.length > 0) {
                        water_drop_wave(validNextElements);
                    } else {
                        if (animation_end_callback != undefined) {
                            animation_end_callback();
                        }
                    }
                });
            } else {
                throw Error("ColElements must contain atleast one item.");
            }
        };

        var collect_next_items = function (colElement) {
            var collected = [];
            var right_element = colElement.next();
            if (right_element != null && right_element.hasClass('col')) {
                collected.push(right_element);
            }
            var below_element = get_element_below(colElement);
            if (below_element != null && below_element.hasClass('col')) {
                collected.push(below_element);
            }

            var corner_element = get_element_corner(colElement);
            if (corner_element != null && corner_element.hasClass('col')) {
                collected.push(corner_element);
            }
            return collected;
        };

        var get_element_corner = function (colElement) {
            var current_col_index = colElement.index();
            var next_row = colElement.parent().next();
            if (next_row.hasClass('row')) {
                var corner_col_index = current_col_index + 1;
                var next_item = next_row.find('.col:eq(' + corner_col_index + ')');
                if (next_item.hasClass('col')) {
                    return next_item;
                } else {
                    if (next_item.length == 0) {
                        return null;
                    } else {
                        throw Error("Error on corner element!");
                    }
                }
            }
            return null;
        };

        var get_element_below = function (colElement) {
            var current_col_index = colElement.index();
            var next_row = colElement.parent().next();
            if (next_row.hasClass('row')) {
                var next_item = next_row.find('.col:eq(' + current_col_index + ')');
                if (next_item.hasClass('col')) {
                    return next_item
                } else {
                    throw Error("Error on Below element!");
                }
            }
            return null;
        };

        var get_first_item_of_first_row = function () {
            return $(".wave-container .row:first .col:first");
        };
        var firstCol = get_first_item_of_first_row();
        water_drop_wave([firstCol]);
    };
    var WaveAnimationColByCol = function () {
        var flip_direction = flip_directions[0];
        var col_by_col_wave = function (colElement) {
            var nextItem = get_element_below(colElement);
            if (nextItem == null) {
                nextItem = get_first_element_of_next_col(colElement);
            }

            colElement.find(".wave-element").toggleClass(flip_direction).delay(100).promise().done(function () {
                if (nextItem != null) {
                    col_by_col_wave(nextItem);
                } else {
                    if (animation_end_callback != undefined) {
                        animation_end_callback();
                    }
                }
            });
        };

        var get_element_below = function (colElement) {
            var current_col_index = colElement.index();
            var next_row = colElement.parent().next();
            if (next_row.hasClass('row')) {
                var next_item = next_row.find('.col:eq(' + current_col_index + ')');
                if (next_item.hasClass('col')) {
                    return next_item
                } else {
                    throw Error("Unknown error!");
                }
            }
            return null;
        };
        var get_first_element_of_next_col = function (colElement) {
            var current_col_index = colElement.index();
            var elem = get_nth_item_of_first_row(current_col_index + 1);
            if (elem.hasClass('col')) {
                return elem;
            }
            else {
                if (is_auto) {
                    elem = get_first_item_of_first_row();
                    return elem;
                }
                return null;
            }
        };
        var get_nth_item_of_first_row = function (nth) {
            return $(".wave-container .row:first .col:eq(" + nth + ")");
        };
        var get_first_item_of_first_row = function () {
            return $(".wave-container .row:first .col:first");
        };
        col_by_col_wave(get_first_item_of_first_row());
    };
    var WaveAnimationLineByLine = function () {
        var flip_direction = flip_directions[1];
        var line_by_line_wave = function (colElement) {
            var nextCol = get_next_wave_item(colElement);
            if (nextCol == null) {
                nextCol = get_first_item_of_next_line(colElement);
            }
            colElement.find(".wave-element").toggleClass(flip_direction).delay(50).promise().done(function () {
                if (nextCol != null) {
                    line_by_line_wave(nextCol);
                } else {
                    if (animation_end_callback != undefined) {
                        animation_end_callback();
                    }
                }
            });
        };

        var get_next_wave_item = function (elem) {
            var next_obj = $(elem).next();
            if (next_obj.hasClass('col')) {
                return next_obj;
            }
            return null;
        };

        var get_first_item_of_next_line = function (colElement) {
            if (colElement.hasClass('col')) {
                var rowElem = colElement.parent();
                if (rowElem.hasClass('row')) {
                    var nextRowElem = rowElem.next();
                    if (nextRowElem.hasClass('row')) {
                        var firstItemOfNextRow = nextRowElem.find(".col:first");
                        if (firstItemOfNextRow.hasClass('col')) {
                            return firstItemOfNextRow;
                        }
                    } else {
                        if (is_auto) {
                            return get_first_item_of_first_row();
                        } else {
                            return null;
                        }

                    }
                }
            }
            throw Error("Error");
        };

        var get_first_item_of_first_row = function () {
            return $(".wave-container .row:first .col:first");
        };
        var firstCol = get_first_item_of_first_row();
        line_by_line_wave(firstCol);
    };

    var WaveTransitionInit = function (wave_type, _x, _y, isAuto) {
        var containerElement = $(".wave-container");
        is_auto = isAuto;
        x = _x;
        y = _y;
        current_animation = wave_type;
        if (containerElement.size() == 0) {
            throw new Error("Can't find .wave-container in DOM!");
        }
        for (var i = 0; i < x; i++) {
            $(containerElement).append("<div class='row'></div>");
            var $row = $(containerElement).find(".row:last-child");
            for (var j = 0; j < y; j++) {
                //var color = get_random_hex_code();
                $row.append("<div class='col' id='" + ((i * y) + (j)) + "'><div class='wave-element'>" +
                    "<figure class='front'></figure>" +
                    "<figure class='back'></figure>" +
                    "</div></div>");
            }
        }
        if (!is_auto) {
            return;
        }
        switch (wave_type) {
            default:
            case 0:
                WaveAnimationLineByLine();
                break;
            case 1:
                WaveAnimationColByCol();
                break;
            case 2:
                WaveAnimationWaterDrop();
                break;
        }
    };

    var FireCurrentTransition = function (end_callback) {
        animation_end_callback = end_callback;
        switch (current_animation) {
            default:
            case 0:
                WaveAnimationLineByLine();
                break;
            case 1:
                WaveAnimationColByCol();
                break;
            case 2:
                WaveAnimationWaterDrop();
                break;
        }
    };
    $.fn.extend({
        WaveTransition: WaveTransitionInit,
        WaveTransitionFire: FireCurrentTransition
    });
})(jQuery);