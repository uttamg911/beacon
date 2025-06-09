//@input Component.Text textComponent

require('LensStudio:TextInputModule');

script.LaunchKeyboard = function() {
  var options = new TextInputSystem.KeyboardOptions();
  options.enablePreview = true;
  options.keyboardType = TextInputSystem.KeyboardType.Text;
  options.returnKeyType = TextInputSystem.ReturnKeyType.Return;
  
  // Maintain the state of the keyboard
  options.onTextChanged = function(text, range) {
    currText = text;
  };

  // When the keyboard returns, print the current text
  options.onKeyboardStateChanged = function(isOpen) {
    if (!isOpen) {
        print(currText);
        script.textComponent.text = currText;
    }
  };
  global.textInputSystem.requestKeyboard(options);
}