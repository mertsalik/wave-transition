/**
 * Created by mertsalik on 08/02/16.
 */

function get_random_hex_code() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function start() {
    $().WaveTransition(0, 5, 7, false);
}

function fire() {
    $().WaveTransitionFire(function () {
        console.log("Ended ?");
    });
}

