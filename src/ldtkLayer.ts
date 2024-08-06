import { clamp, Color, Graphics, Rectangle, Tileset, Vec2 } from '@jume-labs/jume-engine';

import { LdtkEntity } from './ldtkEntity.js';
import { LayerInstanceJson, LayerType, Tile } from './ldtkJson.js';
import { LdtkTile } from './ldtkTile.js';

export class LdtkLayer {
  tint = new Color(1, 1, 1, 1);

  type: LayerType;

  tileset?: Tileset;

  id: string;

  get width(): number {
    return this.tiles[0].length;
  }

  get height(): number {
    return this.tiles.length;
  }

  private tiles: LdtkTile[][] = [];

  private entities = new Map<string, LdtkEntity[]>();

  private visibleBounds = new Rectangle();

  constructor(layerJson?: LayerInstanceJson, tileset?: Tileset) {
    this.tileset = tileset;
    if (layerJson) {
      this.type = layerJson.__type;
      this.id = layerJson.__identifier;
      if (this.type === 'Tiles') {
        this.tilesFromTileLayer(layerJson);
      } else if (this.type === 'Entities') {
        this.addEntities(layerJson);
      } else {
        this.tilesFromAutoLayer(layerJson);
      }
    } else {
      this.type = 'AutoLayer';
      this.id = 'Empty';
    }
  }

  clone(): LdtkLayer {
    const layer = new LdtkLayer();
    layer.tileset = this.tileset;
    layer.type = this.type;
    layer.id = this.id;

    for (const [key, entityList] of this.entities) {
      const entities: LdtkEntity[] = [];
      for (const entity of entityList) {
        entities.push(entity);
      }
      layer.entities.set(key, entities);
    }

    for (let y = 0; y < this.tiles.length; y++) {
      const row: LdtkTile[] = [];
      for (let x = 0; x < this.tiles[0].length; x++) {
        const tile = this.tiles[y][x];
        row.push(tile.clone());
      }
      layer.tiles.push(row);
    }

    return layer;
  }

  getEntitiesByName(name: string): LdtkEntity[] | undefined {
    return this.entities.get(name);
  }

  getTile(x: number, y: number): LdtkTile | undefined {
    if (x < 0 || x >= this.tiles[0].length || y < 0 || y >= this.tiles.length) {
      return;
    }

    return this.tiles[y][x];
  }

  setTile(x: number, y: number, tileId: number, flipX?: boolean, flipY?: boolean): void {
    if (x < 0 || x >= this.tiles[0].length || y < 0 || y >= this.tiles.length) {
      return;
    }

    flipX ??= false;
    flipY ??= false;

    this.tiles[y][x].set(tileId, flipX, flipY);
  }

  render(graphics: Graphics): void {
    for (let y = this.visibleBounds.y; y < this.visibleBounds.height; y++) {
      for (let x = this.visibleBounds.x; x < this.visibleBounds.width; x++) {
        const tile = this.tiles[y][x];
        if (!tile.isEmpty() && this.tileset) {
          const frame = this.tileset.getRect(tile.id);
          const xPos = x * tile.size + tile.xOffset;
          const yPos = y * tile.size + tile.yOffset;
          graphics.color.copyFrom(this.tint);
          graphics.drawScaledImageSection(
            xPos,
            yPos,
            tile.renderWidth,
            tile.renderHeight,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            this.tileset.image,
            tile.flipX,
            tile.flipY
          );
        }
      }
    }
  }

  pixelToTilePosition(xPos: number, yPos: number, out?: Vec2): Vec2 {
    if (!out) {
      out = Vec2.get();
    } else {
      out.set(0, 0);
    }

    if (this.tileset) {
      const x = Math.floor(xPos / this.tileset.tileWidth);
      const y = Math.floor(yPos / this.tileset.tileHeight);
      out.set(x, y);
    }

    return out;
  }

  updateVisibleTiles(bounds: Rectangle): void {
    const topLeft = this.pixelToTilePosition(bounds.x, bounds.y);
    topLeft.x -= 1;
    topLeft.y -= 1;
    topLeft.x = clamp(topLeft.x, 0, this.width);
    topLeft.y = clamp(topLeft.y, 0, this.height);

    const bottomRight = this.pixelToTilePosition(bounds.x + bounds.width, bounds.y + bounds.height);
    bottomRight.x += 2;
    bottomRight.y += 2;
    bottomRight.x = clamp(bottomRight.x, 0, this.width);
    bottomRight.y = clamp(bottomRight.y, 0, this.height);

    this.visibleBounds.set(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);

    topLeft.put();
    bottomRight.put();
  }

  private tilesFromTileLayer(layerJson: LayerInstanceJson): void {
    this.createEmptyTiles(layerJson.__cWid, layerJson.__cHei, layerJson.__gridSize);
    this.insertTiles(layerJson.gridTiles, layerJson.__gridSize);
  }

  private tilesFromAutoLayer(layerJson: LayerInstanceJson): void {
    this.createEmptyTiles(layerJson.__cWid, layerJson.__cHei, layerJson.__gridSize);
    this.insertTiles(layerJson.autoLayerTiles, layerJson.__gridSize);
  }

  private addEntities(layerJson: LayerInstanceJson): void {
    for (const entityJson of layerJson.entityInstances) {
      const name = entityJson.__identifier;
      const entity = new LdtkEntity(entityJson);
      if (!this.entities.has(name)) {
        this.entities.set(name, [entity]);
      } else {
        const list = this.entities.get(name);
        if (list) {
          list.push(entity);
        }
      }
    }
  }

  private createEmptyTiles(width: number, height: number, tileSize: number): void {
    this.tiles = [];
    for (let y = 0; y < height; y++) {
      const row: LdtkTile[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new LdtkTile(-1, false, false, tileSize));
      }
      this.tiles.push(row);
    }
  }

  private insertTiles(tileList: Tile[], tileSize: number): void {
    for (const tile of tileList) {
      const flipX = (tile.f & 1) !== 0;
      const flipY = (tile.f & 2) !== 0;
      const x = Math.floor(tile.px[0] / tileSize);
      const y = Math.floor(tile.px[1] / tileSize);
      this.tiles[y][x].set(tile.t, flipX, flipY);
    }
  }
}
