import { initItems, InventoryItem } from './items'
import { Container, Sprite, Ticker, Graphics, Loader, Text } from 'pixi.js'
const loader = Loader.shared

export const renderInventory = async (renderer: Ticker, parent: Container) => {
  const inventory = new Container()

  const grid: InventoryGrid = {
    width: 8,
    height: 6,
    size: 96,
    items: [],
    occupied: [],
    padding: 20,
    container: inventory
  }

  const items = initItems()
  inventory.position.x = 100
  inventory.position.y = 100

  const g = makeGrid(grid)

  inventory.addChild(g)

  //load items
  items.map(item => {
    loader.add(item.name, item.sprite)
  })

  //add to grid when loaded
  loader.load(() => {
    items.map(item => {
      item.render = makeItem(item, grid)
      if (item.render) {
        let spot = findSpot(item, grid)
        addItem(item.render, item, grid, spot.position)
      }
    })
  })

  parent.addChild(inventory)
}

const makeGrid = ({ width, height, size, occupied, container }: InventoryGrid) => {
  const grid = new Graphics()
  grid.lineStyle(2, 0x121212)
  for (let x = 0; x < width; x++) {
    occupied[x] = []
    for (let y = 0; y < height; y++) {
      grid.drawRect(x * size, y * size, size, size)
      occupied[x][y] = false
      const label = new Text(`${x}:${y}`)
      label.position.x = x * size
      label.position.y = y * size
      container.addChild(label)
    }
  }
  return grid
}

const makeItem = (item: InventoryItem, grid: InventoryGrid): Container => {
  const i = new Container()
  // loader.add(item.name, item.sprite)
  // loader.load(() => {
  const sprite = new Sprite(loader.resources[`${item.name}`].texture)
  i.addChild(sprite)

  //Scaling item to fit to grid and account for padding
  sprite.width / item.width > sprite.height / item.height
    ? scaleSprite(
      sprite,
      sprite.width / (item.width * grid.size - grid.padding)
    )
    : scaleSprite(
      sprite,
      sprite.height / (item.height * grid.size - grid.padding)
    )

  //center item
  sprite.position.x = (item.width * grid.size - sprite.width) / 2
  sprite.position.y = (item.height * grid.size - sprite.height) / 2
  // })

  const iGraphics = new Graphics()
  iGraphics.lineStyle(4, 0xffaa77)
  iGraphics.drawRect(0, 0, item.width * grid.size, item.height * grid.size)
  i.addChild(iGraphics)

  return i
}

export interface InventoryGrid {
  width: number
  height: number
  size: number
  items: ItemPosition[]
  occupied: boolean[][]
  padding: number
  container: Container
}

export interface ItemPosition {
  item: InventoryItem
  position: Position
  rotation: number
}

export interface Position {
  x: number
  y: number
}

const scaleSprite = (sprite: Sprite, scale: number) => {
  sprite.width = sprite.width / scale
  sprite.height = sprite.height / scale
}

const addItem = (itemContainer: Container, item: InventoryItem, grid: InventoryGrid, position: Position) => {
  itemContainer.position.x = position.x * grid.size
  itemContainer.position.y = position.y * grid.size
  grid.container.addChild(itemContainer)
  grid.items.push({
    item: item,
    position: position,
    rotation: 0
  })
  clearGrid(grid)
  calculateOccupied(grid)
}

const itemFits = (item: InventoryItem, grid: InventoryGrid, position: Position) => {
  let response = true
  for (let x = 0; x < item.width; x++) {
    for (let y = 0; y < item.height; y++) {
      const posX = x + position.x
      const posY = y + position.y

      if (grid.occupied[posX][posY] !== false) {
        response = false
        break
      }

    }
  }

  return response
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