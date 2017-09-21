module.exports = function SwipeDetector({
    element,
    minVelocity = 0.3,
    maxDistanceY = 20,
    minDistanceX = 10
}) {
    var startX;
    var startY;
    var startTime;
    var swipeLeftListeners = [];
    var swipeRightListeners = [];

    function triggerSwipeRight() {
        swipeRightListeners.forEach(function (listener) {
            listener();
        });
    }

    function triggerSwipeLeft() {
        swipeLeftListeners.forEach(function (listener) {
            listener();
        });
    }

    function handleTouchStart (e) {
        startX = e.changedTouches[0].pageX;
        startY = e.changedTouches[0].pageY;
        startTime = new Date().getTime();
    }

    function handleTouchEnd(e) {
        const endX = e.changedTouches[0].pageX;
        const endY = e.changedTouches[0].pageY;
        const endTime = new Date().getTime();

        const elapsedDistanceX = endX - startX;
        const elapsedDistanceY = endY - startY;
        const elapsedTime = endTime - startTime;

        const velocityX = Math.abs(elapsedDistanceX) / elapsedTime; // px/ms

        if (Math.abs(elapsedDistanceX) >= minDistanceX && velocityX >= minVelocity && Math.abs(elapsedDistanceY) <= maxDistanceY) {
            if (elapsedDistanceX > 0) {
                triggerSwipeRight();
            } else {
                triggerSwipeLeft();
            }
        }
    }

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return {
        onLeftSwipe: function (callback) {
            swipeLeftListeners.push(callback);
        },
        onRightSwipe: function (callback) {
            swipeRightListeners.push(callback);
        },
        remove: function () {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
            swipeLeftListeners = [];
            swipeRightListeners = [];
        }
    };
};