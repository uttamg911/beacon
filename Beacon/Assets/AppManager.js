// @input SceneObject[] screens
// @input int startScreenIndex = 0


var currentIndex = script.startScreenIndex;

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function () {
    if (global.sessionController) {
        updateEvent.enabled = false;

        global.sessionController.notifyOnReady(function () {
            print("Session ready");
            initScript();
        });
    }
});

function initScript() {
    for (var i = 0; i < script.screens.length; i++) {
        script.screens[i].enabled = (i === currentIndex);
    }
}


script.goToNextScreen = function() {
    print("Going to next screen");



    if (currentIndex < script.screens.length - 1) {
        script.screens[currentIndex].enabled = false;
        currentIndex++;
        script.screens[currentIndex].enabled = true;
    }
}
