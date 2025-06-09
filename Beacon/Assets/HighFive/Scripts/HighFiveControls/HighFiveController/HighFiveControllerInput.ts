import {BubbleAnimationControllerInput} from "../BubbleAnimationController/BubbleAnimationControllerInput"

@component
export class HighFiveControllerInput extends BaseScriptComponent {

  @input
  readonly bubbleAnimationControllerInput: BubbleAnimationControllerInput

  @input
  readonly textComponent1: Text

  @input
  readonly textComponent2: Text

  @input
  readonly textComponent3: Text
}
