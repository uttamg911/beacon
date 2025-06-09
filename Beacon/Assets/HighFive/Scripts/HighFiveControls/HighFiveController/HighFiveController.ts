import {RealtimeStoreKeys} from "../SyncControls/RealtimeStoreKeys"
import {HighFiveControllerInput} from "./HighFiveControllerInput"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import {BubbleAnimationController} from "../BubbleAnimationController/BubbleAnimationController"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"

export class HighFiveController {
  private readonly bubbleAnimationController: BubbleAnimationController
  private readonly friendsHandsInfo: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA[] = []
  private readonly updateEvent: SceneEvent
  private readonly rightHand: TrackedHand
  private currentUserHandInfo: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA
  private worldCamera: WorldCameraFinderProvider
  private isBubbleAnimationFinished: boolean = true

  constructor(private readonly input: HighFiveControllerInput) {
    this.bubbleAnimationController = new BubbleAnimationController(this.input.bubbleAnimationControllerInput)
    this.rightHand = SIK.HandInputData.getHand("right")
    this.worldCamera = WorldCameraFinderProvider.getInstance()
    this.updateEvent = this.input.createEvent("UpdateEvent")
    this.updateEvent.bind(this.onUpdate)
    this.updateEvent.enabled = false
  }

  start() {
    this.updateEvent.enabled = true
  }

  currentUserHandInfoUpdated(value: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA) {
    this.currentUserHandInfo = value
  }

  friendsInfoUpdated(value: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA) {
    for (let friend of this.friendsHandsInfo) {
      if (friend.connectionID === value.connectionID) {
        friend.isActive = value.isActive
        friend.x = value.x
        friend.y = value.y
        friend.z = value.z
        return
      }
    }
    this.friendsHandsInfo.push(value)
  }

  onFriendDisconnected(connectionID: string) {
    const indexToRemove = this.friendsHandsInfo.findIndex(item => item.connectionID === connectionID)
    if (indexToRemove !== -1) {
      this.friendsHandsInfo.splice(indexToRemove, 1)
    }
  }

  private onUpdate = (): void => {
    if (!this.currentUserHandInfo || !this.currentUserHandInfo.isActive) {
      return
    }

    const currentUserHandPos: vec3 = this.getUserHandPosition(this.currentUserHandInfo)

    for (let friend of this.friendsHandsInfo) {
      if (!friend.isActive) {
        continue
      }

      const friendHandPos: vec3 = this.getUserHandPosition(friend)
      const distance = friendHandPos.distance(currentUserHandPos)

      if (distance < 10) {
        let friendName: string = ""
        SessionController.getInstance().getSession().activeUsersInfo.forEach((user) => {
          if (user.connectionId === friend.connectionID) {
            friendName = user.displayName
          }
        })

        const green = new vec4(0, 1, 0, 1)

        this.input.textComponent1.text = `Connected`
        this.input.textComponent1.textFill.color = green
        
        this.input.textComponent2.text = `Connected`
        this.input.textComponent2.textFill.color = green
        
        this.input.textComponent3.text = `Connected`
        this.input.textComponent3.textFill.color = green
        

        this.showBubbleAnimation(this.rightHand.getPalmCenter(), friendName)
        return
      }
    }
  }

  private getUserHandPosition(data: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA): vec3 {
    return new vec3(data.x, data.y, data.z)
  }

  private showBubbleAnimation(handPos: vec3, friendName: string): void {
    if (!this.isBubbleAnimationFinished) {
      return
    }

    this.isBubbleAnimationFinished = false
    this.setBubblePosition(handPos)
    this.bubbleAnimationController.playBubbleAnimation(friendName, () => {
      this.isBubbleAnimationFinished = true
    })
  }

  private setBubblePosition(handPos: vec3): void {
    const head = this.worldCamera.getTransform().getWorldPosition()
    const dir = handPos.sub(head).normalize().uniformScale(15)
    this.bubbleAnimationController.setPosition(handPos.add(dir))
  }
}
