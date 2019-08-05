import * as PIXI from 'pixi.js'
import '../src/_scss/main.scss'
import * as renderer from './core/renderer'

// loadTileSetThenDo(onLoad)

onLoad()

function onLoad(): void {
  renderer.initRenderer()
  const g = new PIXI.Graphics()
  g.beginFill(0x000)
  g.drawRect(0, 0, 100, 100)
  g.endFill()
  renderer.stage.addChild(g)
}

function testSetup() {}
