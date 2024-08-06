export class LdtkTile {
  readonly size: number;

  get id(): number {
    return this._id;
  }

  get flipX(): boolean {
    return this._flipX;
  }

  get flipY(): boolean {
    return this._flipY;
  }

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

  private _id: number;

  private _flipX: boolean;

  private _flipY: boolean;

  constructor(id: number, flipX: boolean, flipY: boolean, size: number) {
    this._id = id;
    this._flipX = flipX;
    this._flipY = flipY;
    this.size = size;
  }

  clone(): LdtkTile {
    return new LdtkTile(this._id, this._flipX, this._flipY, this.size);
  }

  isEmpty(): boolean {
    return this._id === -1;
  }

  set(id: number, flipX: boolean, flipY: boolean): void {
    this._id = id;
    this._flipX = flipX;
    this._flipY = flipY;
  }
}
