/**
 * Created by mertsalik on 08/02/16.
 */

function get_random_hex_code() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
var images = [];
var last_image_id = null;
function start() {
    var row_count = 5;
    var col_count = 6;
    load_images(row_count * col_count);
    $().WaveTransition(1, row_count, col_count, false);
    write_images();
    loop();
}

function loop() {
    swipe_images_right(function () {
        $().WaveTransitionFire(function () {
            console.log("Transition ended");
            equalize_images(function () {
                $().WaveTransitionFire(function () {
                    console.log("Transition ended");
                    setTimeout(function () {
                        loop();
                    }, 3000);
                });
            })
        });
    });
}

function load_images(n) {
    for (var i = 0; i < n; i++) {
        images.push({
            "id": i.toString(),
            "url": "https://unsplash.it/200?image=" + i.toString()
        });
    }
    last_image_id = i;
}

function write_images() {
    $(".wave-element").each(function (i, el) {
        var image = images[i];
        $(this).find(".front").append("<img src='" + image.url + "' />");
        $(this).find(".back").append("<img src='" + image.url + "' />");
    });
}

function download_image(url, callback) {
    var $downloadingImage = $("<img id='temp'>");
    $downloadingImage.load(function () {
        callback();
    });
    $downloadingImage.bind('error', function () {
        alert('image did not load');
    });
    $downloadingImage.attr("src", url);
}

function swipe_images_right(callback) {
    var image = {
        "id": last_image_id.toString(),
        "url": "https://unsplash.it/200?image=" + last_image_id.toString()
    };
    download_image(image.url, function () {
        var len = images.length;
        var _new_images = [];
        _new_images[0] = image;
        for (var i = 1; i < len; i++) {
            _new_images[i] = images[i - 1];
        }
        images = _new_images;
        last_image_id++;

        $(".wave-element").each(function (i, el) {
            var current_image = images[(i + 1) % len];
            var new_image = images[(i % len)];
            $(this).find(".back img").attr("src", new_image.url);
            if (i == (images.length - 1)) {
                if (callback != undefined) {
                    callback();
                }
            }
        });
    });
}

function equalize_images(callback) {
    $(".wave-element").each(function (i, el) {
        var on_screen_image_url = $(this).find(".back img").attr("src");
        $(this).find(".front img").attr("src", on_screen_image_url);
        if (i == (images.length - 1)) {
            if (callback != undefined) {
                callback();
            }
        }
    });
}

function fire() {
    $().WaveTransitionFire(function () {
        console.log("Transition ended");
        //fire();
    });
}

