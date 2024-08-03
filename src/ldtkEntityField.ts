export class LdtkEntityField {
  readonly id: string;

  readonly value: unknown;

  readonly type: string;

  readonly defUid: number;

  constructor(id: string, value: unknown, type: string, defUid: number) {
    this.id = id;
    this.value = value;
    this.type = type;
    this.defUid = defUid;
  }
}
