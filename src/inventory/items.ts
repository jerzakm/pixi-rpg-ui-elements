import { Container } from "pixi.js";

export const initItems = (): InventoryItem[] => {
  const itemDir = 'assets/items/'
  return [
    {
      name: 'Strong Armor',
      width: 2,
      height: 3,
      sprite: `${itemDir}armor_1.png`
    },
    {
      name: 'More Strong Armor',
      width: 2,
      height: 3,
      sprite: `${itemDir}armor_2.png`
    },
    {
      name: 'Spearhead',
      width: 1,
      height: 4,
      sprite: `${itemDir}spear_1.png`
    }
  ]
}

export interface InventoryItem {
  name: string
  width: number
  height: number
  sprite: string
  render?: Container
}
