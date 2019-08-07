import { Container } from "pixi.js";

export const ITEM_ASSET_DIR = 'assets/items/'

export const initItems = (): InventoryItem[] => {
  return [
    {
      name: 'Strong Armor',
      width: 2,
      height: 3,
      sprite: `armor_1.png`
    },
    {
      name: 'More Strong Armor',
      width: 2,
      height: 3,
      sprite: `armor_2.png`
    },
    {
      name: 'Spearhead',
      width: 1,
      height: 4,
      sprite: `spear_1.png`
    },
    {
      name: 'Cool ring',
      width: 1,
      height: 1,
      sprite: `ring_1.png`
    },
    {
      name: 'Swag ring',
      width: 1,
      height: 1,
      sprite: `ring_2.png`
    },
    {
      name: 'Good axe',
      width: 2,
      height: 3,
      sprite: `axe_1.png`
    },
    {
      name: 'Dagger',
      width: 1,
      height: 2,
      sprite: `dagger_1.png`
    },
  ]
}

export interface InventoryItem {
  name: string
  width: number
  height: number
  sprite: string
  render?: Container
}
