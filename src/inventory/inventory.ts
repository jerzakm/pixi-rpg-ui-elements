import { initItems, InventoryItem, ITEM_ASSET_DIR } from './items'
import { Container, Sprite, Ticker, Graphics, Loader, Text } from 'pixi.js'
import { InventoryGrid } from './InventoryGrid';
const loader = Loader.shared

export const renderInventory = async (renderer: Ticker, parent: Container) => {
  const elementContainer = new Container()
  elementContainer.position.x = 20
  elementContainer.position.y = 20

  const inventory = new InventoryGrid({
    width: 12,
    height: 8,
    size: 96,
    padding: 20
  })

  elementContainer.addChild(inventory)

  const itemList = initItems()

  itemList.map(item => {
    loader.add(item.sprite, ITEM_ASSET_DIR + item.sprite)
  })

  loader.load(() => {
    itemList.map(item => {
      inventory.putItem({
        width: item.width,
        height: item.height,
        texture: item.sprite
      })
    })
  })

  parent.addChild(elementContainer)
}

const findSpot = (item: InventoryItem, grid: InventoryGrid) => {
  let spot = {
    found: false,
    position: {
      x: 0,
      y: 0
    }
  }

  for (let y = 0; y < grid.height - item.height + 1; y++) {
    for (let x = 0; x < grid.width - item.width + 1; x++) {
      if (itemFits(item, grid, { x: x, y: y })) {
        spot.found = true
        spot.position = {
          x: x,
          y: y
        }
        break
      }
    }
  }
  return spot
}

const clearGrid = (grid: InventoryGrid) => {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      grid.occupied[x][y] = false
    }
  }
}

const calculateOccupied = (grid: InventoryGrid) => {
  grid.items.map(item => {
    for (let y = 0; y < item.item.height; y++) {
      for (let x = 0; x < item.item.width; x++) {
        grid.occupied[x + item.position.x][y + item.position.y] = true
      }
    }
  })
}