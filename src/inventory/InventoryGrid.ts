import { Container, Graphics, Loader } from "pixi.js"
import { Item, ItemOptions, Position } from "./Item"
import { findSpot, itemFits } from "./inventoryGridUtils";
const loader = Loader.shared
const uuidv4 = require('uuid/v4')

export class InventoryGrid extends Container {
  options: InventoryGridOptions
  grid: Graphics
  items: Item[]
  occupied: boolean[][]
  dragHighlight: Graphics

  constructor(options: InventoryGridOptions) {
    super()
    this.options = options
    this.grid = new Graphics()
    this.dragHighlight = new Graphics()
    this.addChild(this.dragHighlight)

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

  public putItem(options: ItemOptions, gridLoc?: Position) {
    const item = new Item(options)
    item.fitToGrid(this.options)


    const spot = findSpot(item.options, this)

    if (gridLoc) {
      item.options.gridLoc = gridLoc
    }
    else if (spot.found) {
      item.options.gridLoc = spot.position
    }

    if (item.options.gridLoc) {
      item.position.x = item.options.gridLoc.x * this.options.size
      item.position.y = item.options.gridLoc.y * this.options.size
      this.addChild(item)
      this.items.push(item)
      this.updateOccupied()
      this.draggingSetup(item)
      item.uuid = uuidv4()
    }
  }

  private updateOccupied() {
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
            this.occupied[item.options.gridLoc.x + x][item.options.gridLoc.y + y] = true
          }
        }
      }
    })
  }

  private draggingSetup(item: Item) {
    item.interactive = true
    item.buttonMode = true

    item
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove)

    const dragHighlight: Graphics = this.dragHighlight
    const inventory = this

    let dragOffset = {
      x: 0,
      y: 0
    }

    let fits = true

    const startGridLoc = item.options.gridLoc
    let newGridLoc = item.options.gridLoc

    function onDragStart(event: PIXI.interaction.InteractionEvent) {
      item.dragData = event.data;
      item.alpha = 0.5;
      item.dragging = true;
      dragOffset = event.data.getLocalPosition(item)

      const filtered = inventory.items.findIndex(i => i.uuid == item.uuid)
      if (filtered > -1) {
        inventory.items.splice(filtered)
        inventory.updateOccupied()
      }
    }

    function onDragEnd() {
      dragHighlight.clear()
      item.alpha = 1
      item.dragging = false
      item.dragData = null
      if (fits) {
        inventory.putItem(item.options, newGridLoc)
        inventory.removeChild(item)
      } else {
        inventory.putItem(item.options, startGridLoc)
        inventory.removeChild(item)
      }
    }

    function onDragMove() {
      if (item.dragging && item.dragData) {
        const newPosition = item.dragData.getLocalPosition(item.parent)
        item.position.x = newPosition.x - dragOffset.x
        item.position.y = newPosition.y - dragOffset.y

        newGridLoc = inventory.pixelGridPosition({ x: item.position.x, y: item.position.y })
        fits = itemFits(item.options, inventory, newGridLoc)

        dragHighlight.clear()

        fits ? dragHighlight.beginFill(0xAAFF12, 0.5) : dragHighlight.beginFill(0xFFaa12, 0.5)
        dragHighlight.drawRect(item.position.x, item.position.y, item.options.width * inventory.options.size, item.options.height * inventory.options.size)
      }
    }

  }

  pixelGridPosition(position: Position) {
    return {
      x: Math.floor(position.x / this.options.size),
      y: Math.floor(position.y / this.options.size)
    }
  }
}

export interface InventoryGridOptions {
  width: number
  height: number
  size: number
  padding: number
}