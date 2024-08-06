import { describe, expect, it } from 'vitest';

import { LdtkTile } from './ldtkTile.js';

describe('ldtkTile', () => {
  it('should create a LdtkTile', () => {
    const tile = new LdtkTile(2, true, false, 16);

    expect(tile.id).toBe(2);
    expect(tile.flipX).toBeTruthy();
    expect(tile.flipY).toBeFalsy();
    expect(tile.size).toBe(16);
  });

  it('should return the correct render size', () => {
    const tile = new LdtkTile(2, false, false, 16);

    expect(tile.renderWidth).toBe(16);
    tile.set(2, true, false);
    expect(tile.renderWidth).toBe(-16);

    expect(tile.renderHeight).toBe(16);
    tile.set(2, false, true);
    expect(tile.renderHeight).toBe(-16);
  });

  it('should return the correct offset', () => {
    const tile = new LdtkTile(2, false, false, 16);

    expect(tile.xOffset).toBe(0);
    tile.set(2, true, false);
    expect(tile.xOffset).toBe(16);

    expect(tile.yOffset).toBe(0);
    tile.set(2, false, true);
    expect(tile.yOffset).toBe(16);
  });

  it('should clone a tile', () => {
    const tile = new LdtkTile(2, true, false, 32);
    const clone = tile.clone();

    expect(tile).not.toBe(clone);
    expect(tile).toEqual(clone);
  });

  it('should check if a tile is empty', () => {
    const tile = new LdtkTile(2, false, false, 16);
    expect(tile.isEmpty()).toBeFalsy();

    tile.set(-1, false, false);
    expect(tile.isEmpty()).toBeTruthy();
  });

  it('should set new tile values', () => {
    const tile = new LdtkTile(2, true, false, 12);
    expect(tile.id).toBe(2);
    expect(tile.flipX).toBeTruthy();
    expect(tile.flipY).toBeFalsy();

    tile.set(4, false, true);
    expect(tile.id).toBe(4);
    expect(tile.flipX).toBeFalsy();
    expect(tile.flipY).toBeTruthy();
  });
});
