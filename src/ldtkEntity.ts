import { LdtkEntityField } from './ldtkEntityField.js';
import { EntityInstanceJson } from './ldtkJson.js';

export class LdtkEntity {
  id: string;

  x: number;

  y: number;

  pivotX: number;

  pivotY: number;

  width: number;

  height: number;

  fields: LdtkEntityField[] = [];

  constructor(entity?: EntityInstanceJson) {
    if (entity) {
      this.id = entity.__identifier;
      this.x = entity.px[0];
      this.y = entity.px[1];
      this.pivotX = entity.__pivot[0];
      this.pivotY = entity.__pivot[1];
      this.width = entity.width;
      this.height = entity.height;

      for (const field of entity.fieldInstances) {
        this.fields.push(new LdtkEntityField(field.__identifier, field.__value, field.__type, field.defUid));
      }
    } else {
      this.id = '';
      this.x = 0;
      this.y = 0;
      this.pivotX = 0;
      this.pivotY = 0;
      this.width = 0;
      this.height = 0;
    }
  }

  clone(): LdtkEntity {
    const entity = new LdtkEntity();
    entity.id = this.id;
    entity.x = this.x;
    entity.y = this.y;
    entity.pivotX = this.pivotX;
    entity.pivotY = this.pivotY;
    entity.width = this.width;
    entity.height = this.height;

    return entity;
  }
}
