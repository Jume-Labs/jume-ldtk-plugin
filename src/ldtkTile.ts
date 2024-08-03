export class LdtkTile {
  flipX: boolean;

  flipY: boolean;

  id: number;

  size: number;

  get renderWidth(): number {
    return this.flipX ? -this.size : this.size;
  }

  get renderHeight(): number {
    return this.flipY ? -this.size : this.size;
  }

  get xOffset(): number {
    return this.flipX ? this.size : 0;
  }

  get yOffset(): number {
    return this.flipY ? this.size : 0;
  }

  constructor(id: number, flipX: boolean, flipY: boolean, size: number) {
    this.id = id;
    this.flipX = flipX;
    this.flipY = flipY;
    this.size = size;
  }

  clone(): LdtkTile {
    return new LdtkTile(this.id, this.flipX, this.flipY, this.size);
  }

  isEmpty(): boolean {
    return this.id === -1;
  }

  set(id: number, flipX: boolean, flipY: boolean): void {
    this.id = id;
    this.flipX = flipX;
    this.flipY = flipY;
  }
}
