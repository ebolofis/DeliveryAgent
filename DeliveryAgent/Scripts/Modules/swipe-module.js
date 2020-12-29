function CustomSwipe() {
    var swipe = this;
    var swipedir;
    var startX;
    var startY;
    var distX;
    var distY;
    var threshold = 50;
    var restraint = 40;
    var allowedTime = 600;
    var elapsedTime;
    var startTime;

    swipe.DetectSwipe = function (element, callback) {

        element.addEventListener("touchstart", function (e) {
            var touchobj = e.changedTouches[0];
            swipedir = "none";
            dist = 0;
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
        }, false);

        element.addEventListener("touchmove", function (e) {
            e.preventDefault();
        }, false);

        element.addEventListener("touchend", function (e) {
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal distance traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical distance traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime) { // first condition for swipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // second condition for horizontal swipe met
                    swipedir = (distX < 0) ? "left" : "right"; // if distance traveled is negative, it indicates left swipe, else right swipe
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // second condition for vertical swipe met
                    swipedir = (distY < 0) ? "up" : "down"; // if distance traveled is negative, it indicates up swipe, else down swipe
                }
            }
            if (callback != null) {
                callback(swipedir, e.currentTarget.id);
            }
        }, false);

    };

}