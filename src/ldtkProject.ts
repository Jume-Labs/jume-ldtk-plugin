import { Assets, Image, inject, Tileset } from '@jume-labs/jume-engine';

import { LevelJson, ProjectJson } from './ldtkJson.js';
import { LdtkLevel } from './ldtkLevel.js';

export class LdtkProject {
  readonly data: ProjectJson;

  readonly hasExternalLevels: boolean;

  private levels: Record<string, LdtkLevel> = {};

  private tilesets: Record<number, Tileset> = {};

  @inject
  private assets!: Assets;

  constructor(jsonData: string) {
    this.data = JSON.parse(jsonData) as ProjectJson;

    this.hasExternalLevels = this.data.externalLevels;

    for (const tileset of this.data.defs.tilesets) {
      const image = this.assets.get(Image, tileset.identifier);
      if (image) {
        this.tilesets[tileset.uid] = new Tileset(
          image,
          tileset.tileGridSize,
          tileset.tileGridSize,
          tileset.spacing,
          tileset.padding
        );
      }
    }

    for (const level of this.data.levels) {
      this.levels[level.identifier] = new LdtkLevel(level, this.tilesets);
    }
  }

  getLevel(name: string): LdtkLevel | undefined {
    if (this.hasExternalLevels) {
      console.log('Levels need to be loaded separately, because they are external files.');
      return;
    }

    return this.levels[name];
  }

  async loadExternalLevel(name: string, projectFolder: string): Promise<LdtkLevel | undefined> {
    const basicData = this.levels[name];
    if (basicData && basicData.externalRelPath) {
      const relativePath = basicData.externalRelPath;
      const fullPath = `${projectFolder}/${relativePath}`;
      const text = (await this.assets.load(String, 'level', fullPath, undefined, false)).toString();
      const levelData = JSON.parse(text) as LevelJson;

      return new LdtkLevel(levelData, this.tilesets);
    }
  }
}
