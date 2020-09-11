module.exports = function SwipeDetector(options) {
    options = options || {};
    var element = options.element;
    var minVelocity = options.minVelocity !== undefined ? options.minVelocity : 0.3;
    var maxDistanceY = options.maxDistanceY !== undefined ? options.maxDistanceY : 20;
    var minDistanceX = options.minDistanceX !== undefined ? options.minDistanceX : 10;

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
        var endX = e.changedTouches[0].pageX;
        var endY = e.changedTouches[0].pageY;
        var endTime = new Date().getTime();

        var elapsedDistanceX = endX - startX;
        var elapsedDistanceY = endY - startY;
        var elapsedTime = endTime - startTime;

        var velocityX = Math.abs(elapsedDistanceX) / elapsedTime; // px/ms

        if (Math.abs(elapsedDistanceX) >= minDistanceX && velocityX >= minVelocity && Math.abs(elapsedDistanceY) <= maxDistanceY) {
            if (elapsedDistanceX > 0) {
                triggerSwipeRight();
            } else {
                triggerSwipeLeft();
            }
        }
    }

    element.addEventListener('touchstart', handleTouchStart, {passive: true});
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