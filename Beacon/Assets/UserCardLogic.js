//@input Component.Text targetText
//@input string onText = "Selected"
//@input string offText = "Not Selected"

script.onToggleChanged = function(state) {
    print("Toggle state changed: " + state);
    if (script.targetText) {
        script.targetText.text = state ? script.onText : script.offText;
    }
}
