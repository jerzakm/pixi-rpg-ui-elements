import { Sprite, Container, Loader, Graphics } from "pixi.js";
import { InventoryGridOptions, InventoryGrid } from "./InventoryGrid";
import { scaleSprite } from "../util/pixiUtils";
const loader = Loader.shared

export class Item extends Container {
  options: ItemOptions
  dragging: boolean
  sprite?: Sprite

  constructor(options: ItemOptions) {
    super()
    this.dragging = false
    this.options = options
    this.renderItem()
  }

  private renderItem() {
    this.sprite = new Sprite(loader.resources[`${this.options.texture}`].texture)
    this.addChild(this.sprite)
  }

  public fitToGrid({ size, padding }: InventoryGridOptions) {
    //Scaling item to fit to grid and account for padding
    if (this.sprite) {
      const sprite = this.sprite
      const item = this.options

      //scale
      sprite.width / item.width > sprite.height / item.height ?
        scaleSprite(sprite, sprite.width / (item.width * size - padding)) : scaleSprite(sprite, sprite.height / (item.height * size - padding))

      //center
      sprite.position.x = (item.width * size - sprite.width) / 2
      sprite.position.y = (item.height * size - sprite.height) / 2
    }
  }
}

export interface ItemOptions {
  width: number
  height: number
  texture: string
  gridLoc?: Position
}

export interface Position {
  x: number
  y: number
}