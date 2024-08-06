import { Tileset } from '@jume-labs/jume-engine';

import { LevelJson } from './ldtkJson.js';
import { LdtkLayer } from './ldtkLayer.js';

export class LdtkLevel {
  readonly worldX: number;

  readonly worldY: number;

  readonly width: number;

  readonly height: number;

  readonly externalRelPath?: string;

  private layers: Record<string, LdtkLayer> = {};

  constructor(levelData: LevelJson, tilesets: Record<number, Tileset>) {
    this.worldX = levelData.worldX;
    this.worldY = levelData.worldY;
    this.width = levelData.pxWid;
    this.height = levelData.pxHei;
    this.externalRelPath = levelData.externalRelPath;

    if (levelData.layerInstances) {
      for (const layer of levelData.layerInstances) {
        let tileset: Tileset | undefined;
        if (layer.__tilesetDefUid) {
          tileset = tilesets[layer.__tilesetDefUid];
        }
        this.layers[layer.__identifier] = new LdtkLayer(layer, tileset);
      }
    }
  }

  getLayer(id: string): LdtkLayer | undefined {
    return this.layers[id];
  }
}
