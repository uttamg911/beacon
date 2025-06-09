// @input SceneObject[] screens
// @input int startScreenIndex = 0

var currentIndex = script.startScreenIndex;

// Initialize: show only the start screen
function init() {
    for (var i = 0; i < script.screens.length; i++) {
        script.screens[i].enabled = (i === currentIndex);
    }
}

init();

// Advance to next screen on OK press
script.goToNextScreen = function() {
    print("Going to next screen");
    if (currentIndex < script.screens.length - 1) {
        script.screens[currentIndex].enabled = false;
        currentIndex++;
        script.screens[currentIndex].enabled = true;
    }
}