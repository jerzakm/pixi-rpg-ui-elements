import { Sprite } from "pixi.js";

export const scaleSprite = (sprite: Sprite, scale: number) => {
  sprite.width = sprite.width / scale
  sprite.height = sprite.height / scale
}