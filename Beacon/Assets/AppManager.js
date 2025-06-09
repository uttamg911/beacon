// @input SceneObject[] screens
// @input int startScreenIndex = 0
// @input Component.Text textSource1
// @input Component.Text textTarget1
// @input Component.Text textSource2
// @input Component.Text textTarget2

var currentIndex = script.startScreenIndex;

function init() {
    for (var i = 0; i < script.screens.length; i++) {
        script.screens[i].enabled = (i === currentIndex);
    }
}

init();

script.goToNextScreen = function() {
    print("Going to next screen");

    // First pair
    if (script.textSource1 && script.textTarget1) {
        script.textTarget1.text = script.textSource1.text;
    }

    // Second pair
    if (script.textSource2 && script.textTarget2) {
        script.textTarget2.text = script.textSource2.text;
    }

    if (currentIndex < script.screens.length - 1) {
        script.screens[currentIndex].enabled = false;
        currentIndex++;
        script.screens[currentIndex].enabled = true;
    }
}
