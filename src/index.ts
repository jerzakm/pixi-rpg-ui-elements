import * as PIXI from 'pixi.js'
import '../src/_scss/main.scss'
import * as renderer from './core/renderer'
import { renderInventory } from './inventory/inventory'

// loadTileSetThenDo(onLoad)

onLoad()
const ticker = renderer.ticker

function onLoad(): void {
  renderer.initRenderer()
  renderInventory(ticker, renderer.stage)
}
