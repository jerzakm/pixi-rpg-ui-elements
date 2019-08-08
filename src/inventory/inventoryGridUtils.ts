import { ItemOptions, Position } from "./Item";
import { InventoryGrid } from "./InventoryGrid";

export const itemFits = (item: ItemOptions, grid: InventoryGrid, position: Position) => {
  let fits = true

  const withinGrid = item.width <= grid.width && item.height <= grid.height && item.height + position.y <= grid.height && item.width + position.x <= grid.width ? true: false


  for (let x = 0; x < item.width; x++) {
    for (let y = 0; y < item.height; y++) {
      const posX = x + position.x
      const posY = y + position.y
      if (grid.occupied[posX][posY] != false) {
        fits = false
        break
      }
    }
  }

  return fits && withinGrid ? true : false
}

export const findSpot = (item: ItemOptions, grid: InventoryGrid) => {
  let spot = {
    found: false,
    position: {
      x: 0,
      y: 0
    }
  }

  for (let y = grid.options.height - item.height; y >= 0; y--) {
    for (let x = 0; x < grid.options.width - item.width; x++) {
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