/**
 * Created by mertsalik on 10/02/16.
 */

(function ($) {
    var cell_size = 200;
    var grid_row_class_name = "wave-row";
    var grid_column_class_name = "wave-col";
    var cell = function (id) {
        var isAvailable = true;
        this.id = id;
        this.get_right_cell = function () {
            return Grid.findCellByAxis(this.id, 0);
        };
        this.get_left_cell = function () {
            return Grid.findCellByAxis(this.id, 2);
        };
        this.get_upper_cell = function () {
            return Grid.findCellByAxis(this.id, 3);
        };
        this.get_lower_cell = function () {
            return Grid.findCellByAxis(this.id, 1);
        };
        this.make_available = function () {
            isAvailable = true;
        };
        this.make_unAvailable = function () {
            isAvailable = false;
        };
        this.is_available = function () {
            return isAvailable;
        };
        this.get_DOM_element = function () {
            return $("#cell_" + this.id.toString());
        };
        this.get_Front_img = function () {
            return this.get_DOM_element().find(".front img");
        };
        this.get_Back_img = function () {
            return this.get_DOM_element().find(".back img");
        };
        this.get_Animation_element = function () {
            return this.get_DOM_element().find(".wave-element");
        };
    };
    /**
     * For quick count response
     * @type {Array}
     */
    var grids_available_cell_ids = [];
    var Grid = {
        x: 0,
        y: 0,
        jElement: null,
        cells: [],
        findCellById: function (cell_id) {
            var result = this.cells.filter(function (obj) {
                return obj.id == cell_id;
            });
            if (result.length > 0) {
                return result[0];
            } else {
                return null;
            }
        },
        findCellInArray: function (cell_id, cell_array) {
            if (typeof cell_array != typeof [])
                throw new Error("Cell array must be type of Array object!");
            var result = cell_array.filter(function (obj) {
                return obj.id == cell_id;
            });
            if (result.length > 0) {
                return result[0];
            } else {
                return null;
            }
        },
        getCellsInSameRow: function (cell_id) {
            if (this.findCellById(cell_id) == null) {
                throw new Error("Grid does'not contain given cell!");
            }
            var index = (cell_id % this.y);
            var sameRowCells = [];
            for (var i = 0; i < this.y; i++) {
                var j = i - index;
                sameRowCells.push(this.findCellById((cell_id + j)));
            }
            return sameRowCells;
        },
        getCellsInSameColumn: function (cell_id) {
            if (this.findCellById(cell_id) == null) {
                throw new Error("Grid does'not contain given cell!");
            }
            var index = (cell_id % this.y);
            var sameColumnCells = [];
            for (var i = 0; i < this.x; i++) {
                sameColumnCells.push(this.findCellById(((i * this.y) + index)));
            }
            return sameColumnCells;
        },
        findCellByAxis: function (cell_id, axis) {
            var result = null;
            if (axis == undefined || cell_id == undefined)
                throw new Error("Cell ID and Axis needed!");
            if (this.findCellById(cell_id) == null)
                throw new Error("Cannot find given cell in grid!");
            switch (axis) {
                case 0:
                    var same_row_cells = this.getCellsInSameRow(cell_id);
                    if (this.findCellInArray(cell_id + 1, same_row_cells)) {
                        result = this.findCellById(cell_id + 1);
                    }
                    break;
                case 1:
                    var same_col_cells = this.getCellsInSameColumn(cell_id);
                    var lower_item_index = cell_id + this.y;
                    if (this.findCellInArray(lower_item_index, same_col_cells)) {
                        result = this.findCellById(lower_item_index);
                    }
                    break;
                case 2:
                    var same_row_cells = this.getCellsInSameRow(cell_id);
                    if (this.findCellInArray(cell_id - 1, same_row_cells)) {
                        result = this.findCellById(cell_id - 1);
                    }
                    break;
                case 3:
                    var same_col_cells = this.getCellsInSameColumn(cell_id);
                    var upper_item_index = cell_id - this.y;
                    if (this.findCellInArray(upper_item_index, same_col_cells)) {
                        result = this.findCellById(upper_item_index);
                    }
                    break;
                default:
                    throw new Error("Unidentified Axis given!");

            }
            return result;
        },
        createDOMObjects: function (image_objects) {
            for (var i = 0; i < this.x; i++) {
                this.jElement.append("<div class='" + grid_row_class_name + "'></div>");
                var $row = this.jElement.find("." + grid_row_class_name + ":last-child");
                for (var j = 0; j < this.y; j++) {
                    $row.append("<div class='" + grid_column_class_name + "' id='cell_" + ((i * this.y) + (j)) + "'><div class='wave-element'>" +
                        "<figure class='front'><img src='https://unsplash.it/" + cell_size + "' /></figure>" +
                        "<figure class='back'><img src='https://unsplash.it/" + cell_size + "' /></figure>" +
                        "</div></div>");
                }
            }
        },
        getAvailableCellCount: function () {
            return grids_available_cell_ids.length;
        }
    };
    var calculate_cell_size = function () {
        var w = $(window).width();
        var h = $(window).height();
        var min_edge = h > w ? {
            "axis": "x",
            "width": w
        } : {"axis": "y", "width": h};
        if (min_edge.axis == "x") {
            cell_size = Math.floor(min_edge.width / Grid.x);
        } else {
            cell_size = Math.floor(min_edge.width / Grid.y);
        }
    };
    var create_custom_css = function () {
        $("#custom_wave_css").remove();
        $("head").append("<style id='custom_wave_css'>" +
            "div." + grid_row_class_name + "{"
            + "max-width:" + cell_size * Grid.y + "px;}" +
            "div." + grid_column_class_name + "{"
            + "width:" + cell_size + "px; height:" + cell_size + "px; }"
            + "div." + grid_row_class_name + "{line-height:0;margin-left:auto;margin-right: auto;}"
            + "</style>");
    };
    var init = function (jSelector, x, y) {
        if (jSelector == undefined)
            throw new Error("DOM element selector needed!");
        if (x == undefined)
            throw new Error("Grid x axis needed!");
        if (y == undefined)
            throw new Error("Grid y axis needed!");
        Grid.x = x;
        Grid.y = y;
        Grid.jElement = $(jSelector);
        calculate_cell_size();
        create_custom_css();
        $(window).resize(function () {
            calculate_cell_size();
            create_custom_css();
        });
        if (Grid.jElement.size() == 0)
            throw new Error("Can't find given DOM element!");
        if (!Grid.jElement.hasClass('wave-container')) {
            Grid.jElement.addClass('wave-container');
        }
        for (var i = 0; i < x * y; i++) {
            Grid.cells.push(new cell(i));
        }
    };
    var decorate = function (available_cell_ids) {
        if (typeof available_cell_ids != typeof [])
            throw new Error("Available Cell IDs must be an array!");
        for (var i = 0; i < Grid.cells.length; i++) {
            var cell = Grid.cells[i];
            var contains = available_cell_ids.filter(function (obj) {
                return obj == cell.id;
            });
            if (contains.length > 0) {
                cell.make_available();
            } else {
                cell.make_unAvailable();
            }
        }
        grids_available_cell_ids = available_cell_ids;
    };
    var DOMHelper = function () {
        var images = [];
        var last_image_id = null;
        var flip_class = "flipped-x";
        var animationType = null;
        this.getCurrentGrid = function () {
            if (Grid.jElement == null)
                return null;
            else
                return Grid;
        };
        this.setAnimation = function (animType) {
            if (animType == "horizontal") {
                flip_class = "flipped-y";
                $(".wave-container").removeClass("vertical-wave-effect").addClass("horizontal-wave-effect");
            } else {
                flip_class = "flipped-x";
                $(".wave-container").removeClass("horizontal-wave-effect").addClass("vertical-wave-effect");
            }
            animationType = animType;
        };
        this.loadImages = function (img_array) {
            if (img_array == undefined) {
                for (var i = 0; i < grids_available_cell_ids.length; i++) {
                    images.push({
                        "id": i.toString(),
                        "url": "https://unsplash.it/" + cell_size + "?image=" + i.toString()
                    });
                }
            } else {
                for (var i = 0; i < grids_available_cell_ids.length; i++) {
                    images.push({
                        "id": i.toString(),
                        "url": img_array[i]
                    });
                }
            }
            last_image_id = i;
        };
        this.download_image = function (url, callback) {
            var $downloadingImage = $("<img id='temp'>");
            $downloadingImage.load(function () {
                callback(true);
            });
            $downloadingImage.bind('error', function () {
                callback(false);
            });
            $downloadingImage.attr("src", url);
        };
        this.addNewImage = function (image_url, callback) {
            if (callback == undefined)
                throw new Error("This method cant use in synchronized mode!");
            var image = {
                "id": last_image_id.toString(),
                "url": null
            };
            if (image_url == undefined) {
                image.url = "https://unsplash.it/" + cell_size + "?image=" + last_image_id.toString();
            } else {
                image.url = image_url;
            }
            this.download_image(image.url, function (success) {
                if (success) {
                    var len = images.length;
                    var _new_images = [];
                    _new_images[0] = image;
                    for (var i = 1; i < len; i++) {
                        _new_images[i] = images[i - 1];
                    }
                    images = _new_images;
                    last_image_id++;
                    callback();
                } else {
                    console.log("ERROR downloading image!");
                    return;
                }
            });
        };
        this.initGridHtml = function () {
            Grid.createDOMObjects();
            var img_counter = 0;
            for (var i = 0; i < Grid.cells.length; i++) {
                var cell = Grid.cells[i];
                if (cell.is_available()) {
                    cell.get_Front_img().attr("src", images[img_counter].url);
                    cell.get_Back_img().attr("src", images[img_counter].url);
                    img_counter++;
                } else {
                    cell.get_Back_img().remove();
                    cell.get_Front_img().remove();
                }
            }
        };
        this.prepareGridForAnimation = function () {
            var img_counter = 0;
            for (var i = 0; i < Grid.cells.length; i++) {
                var cell = Grid.cells[i];
                if (cell.is_available()) {
                    //cell.get_Front_img().attr("src", images[img_counter].url);
                    cell.get_Back_img().attr("src", images[img_counter].url);
                    img_counter++;
                } else {
                    cell.get_Back_img().remove();
                    cell.get_Front_img().remove();
                }
            }
        };
        this.stablizeGrid = function (callback) {
            var img_counter = 0;
            for (var i = 0; i < Grid.cells.length; i++) {
                var cell = Grid.cells[i];
                if (cell.is_available()) {
                    cell.get_Front_img().attr("src", images[img_counter].url);
                    cell.get_Back_img().attr("src", images[img_counter].url);
                    //cell.get_Front_img().attr("src", cell.get_Back_img().attr("src"));
                    cell.get_Animation_element().toggleClass(flip_class);
                    img_counter++;
                }
            }
            callback();
        };
        this.spinGrid = function (new_img_url, callback) {
            var that = this;
            this.addNewImage(new_img_url, function () {
                that.prepareGridForAnimation();
                callback()
            });
        };
        this.animateGrid = function (callback) {
            function animateCol(col_index) {
                var col_cells = Grid.getCellsInSameColumn(col_index);
                var _dom_elements = [];
                for (var j in col_cells) {
                    if (col_cells[j].is_available())
                        _dom_elements.push(col_cells[j].get_Animation_element());
                }
                $(_dom_elements).toggleClass(flip_class).delay(1000).promise().done(function () {
                    if (col_index + 1 < Grid.y) {
                        animateCol(col_index + 1)
                    } else {
                        callback();
                    }
                });
            }

            function animateRow(row_index) {
                var first_cell_of_this_row_index = (row_index * Grid.y);
                var row_cells = Grid.getCellsInSameRow(first_cell_of_this_row_index);
                var _dom_elements = [];
                for (var j in row_cells) {
                    if (row_cells[j].is_available()) {
                        _dom_elements.push(row_cells[j].get_Animation_element());
                    }
                }
                $(_dom_elements).toggleClass(flip_class).delay(1000).promise().done(function () {
                    if (row_index + 1 < Grid.x) {
                        animateRow(row_index + 1);
                    } else {
                        callback();
                    }
                });
            }

            if (animationType == "horizontal") {
                animateRow(0);
            } else {
                animateCol(0);
            }
        }
    };
    var dom_helper = new DOMHelper();
    $.fn.extend({
        MakeGrid: function (jSelector, x, y, animtype, available_cell_ids) {
            init(jSelector, x, y);
            decorate(available_cell_ids);
            dom_helper.loadImages();
            dom_helper.initGridHtml();
            dom_helper.setAnimation(animtype);
            return Grid;
        },
        AddNewImage: function (img_url, callback) {
            dom_helper.spinGrid(img_url, function () {
                dom_helper.animateGrid(function () {
                    dom_helper.stablizeGrid(function () {
                        callback();
                    });
                });
            });
        }
    });
})(jQuery);