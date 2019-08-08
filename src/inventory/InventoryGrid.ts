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
    }

    if (item.options.gridLoc) {
      item.position.x = item.options.gridLoc.x * this.options.size
      item.position.y = item.options.gridLoc.y * this.options.size
      this.addChild(item)
      this.items.push(item)
      this.updateOccupied()
      this.draggingSetup(item)
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

    function onDragStart(event: PIXI.interaction.InteractionEvent) {
      console.log(event)
      item.dragData = event.data;
      item.alpha = 0.5;
      item.dragging = true;
    }

    function onDragEnd() {
      item.alpha = 1;
      item.dragging = false;
      // set the interaction data to null
      item.dragData = null;
    }

    function onDragMove() {
      if (item.dragging) {
        const newPosition = item.dragData.getLocalPosition(item.parent);
        item.x = newPosition.x;
        item.y = newPosition.y;
      }
    }

  }
}

export interface InventoryGridOptions {
  width: number
  height: number
  size: number
  padding: number
}