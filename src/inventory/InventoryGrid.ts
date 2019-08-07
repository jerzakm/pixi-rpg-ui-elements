import { Container, Graphics, Loader } from "pixi.js"
import { Item, ItemOptions, Position } from "./Item"
import { itemFits, findSpot } from "./inventoryGridUtils";
const loader = Loader.shared

export class InventoryGrid extends Container {
  options: InventoryGridOptions
  grid: Graphics
  items: Item[]
  occupied: boolean[][]

  constructor(options: InventoryGridOptions) {
    super()
    this.options = options
    this.grid = new Graphics()
    this.addChild(this.grid)
    this.renderGrid()
    this.items = [] //todo - state preservation and loading
    this.occupied = []
    this.updateOccupied()
  }

  private renderGrid() {
    const { width, height, size } = this.options
    this.grid.clear()
    this.grid.lineStyle(2, 0x121212)
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.grid.drawRect(x * size, y * size, size, size)
      }
    }
  }

  public putItem(options: ItemOptions) {
    const item = new Item(options)
    item.fitToGrid(this.options)

    const spot = findSpot(item.options, this)

    if (spot.found) {
      item.options.gridLoc = spot.position
      console.log(spot)
    }

    if (item.options.gridLoc) {
      item.position.x = item.options.gridLoc.x * this.options.size
      item.position.y = item.options.gridLoc.y * this.options.size
      this.addChild(item)
      this.items.push(item)
      this.updateOccupied()
    }
  }

  private updateOccupied() {
    this.occupied = []

    for (let x = 0; x < this.options.width; x++) {
      this.occupied[x] = []
      for (let y = 0; y < this.options.height; y++) {
        this.occupied[x][y] = false
      }
    }

    this.items.map(item => {
      for (let x = 0; x < item.options.width; x++) {
        for (let y = 0; y < item.options.height; y++) {
          if (item.options.gridLoc) {
            this.occupied[item.options.gridLoc.x + item.options.width][item.options.gridLoc.y + item.options.height] = true
          }
        }
      }
    })
  }
}

export interface InventoryGridOptions {
  width: number
  height: number
  size: number
  padding: number
}