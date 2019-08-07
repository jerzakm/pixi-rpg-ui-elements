import { ItemOptions, Position } from "./Item";
import { InventoryGrid } from "./InventoryGrid";

export const itemFits = (item: ItemOptions, grid: InventoryGrid, position: Position) => {
  const withinGrid =
    item.width <= grid.width &&
    item.height <= grid.height &&
    item.height + position.y <= grid.height &&
    item.width + position.x <= grid.width

  let fits = true

  if (withinGrid) {
    for (let x = 0; x < item.width; x++) {
      for (let y = 0; y < item.height; y++) {
        const posX = x + position.x
        const posY = y + position.y
        if (grid.occupied[posX][posY] == true) {
          fits = false
          break
        }
      }
    }
  }

  return withinGrid && fits ? true : false
}

export const findSpot = (item: ItemOptions, grid: InventoryGrid) => {
  let spot = {
    found: false,
    position: {
      x: 0,
      y: 0
    }
  }

  for (let y = 0; y < grid.options.height; y++) {
    for (let x = 0; x < grid.options.width; x++) {
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