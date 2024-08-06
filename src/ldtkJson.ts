/**
 * This is ported from the haxe api
 * https://github.com/deepnight/ldtk-haxe-api/blob/master/src/ldtk/Json.hx
 * 
	This is the root of any Project JSON file. It contains:

- the project settings,
- an array of levels,
- a group of definitions (that can probably be safely ignored for most users).

- JSON version 1.5.3
**/

export type ProjectJson = {
  /** File format version **/
  jsonVersion: string;

  /** Unique project identifier **/

  iid: string;

  /**
		**WARNING**: this field will move to the `worlds` array after the "multi-worlds" update. It will then be `null`. You can enable the Multi-worlds advanced project option to enable the change immediately.

		An enum that describes how levels are organized in this project (ie. linearly or in a 2D space).
	**/

  worldLayout?: WorldLayout;

  /**
		**WARNING**: this field will move to the `worlds` array after the "multi-worlds" update. It will then be `null`. You can enable the Multi-worlds advanced project option to enable the change immediately.

		Width of the world grid in pixels.
	**/

  worldGridWidth?: number;

  /**
		**WARNING**: this field will move to the `worlds` array after the "multi-worlds" update. It will then be `null`. You can enable the Multi-worlds advanced project option to enable the change immediately.

		Height of the world grid in pixels.
	**/

  worldGridHeight?: number;

  /** A structure containing all the definitions of this project **/
  defs: LdtkDefinitionsJson;

  /**
		All levels. The order of this array is only relevant in `LinearHorizontal` and `linearVertical` world layouts (see `worldLayout` value).
		Otherwise, you should refer to the `worldX`,`worldY` coordinates of each Level.
	**/
  levels: LevelJson[];

  /**
This array will be empty, unless you enable the Multi-Worlds in the project advanced settings.

 - in current version, a LDtk project file can only contain a single world with multiple levels in it. In this case, levels and world layout related settings are stored in the root of the JSON.
 - with "Multi-worlds" enabled, there will be a `worlds` array in root, each world containing levels and layout settings. Basically, it's pretty much only about moving the `levels` array to the `worlds` array, along with world layout related values (eg. `worldGridWidth` etc).

If you want to start supporting this future update easily, please refer to this documentation: https://github.com/deepnight/ldtk/issues/231
	**/

  worlds: WorldJson[];

  /** Project background color **/

  bgColor: string;

  /** If TRUE, one file will be saved for the project (incl. all its definitions) and one file in a sub-folder for each level. **/

  externalLevels: boolean;

  /** All instances of entities that have their `exportToToc` flag enabled are listed in this array. **/

  toc: TableOfContentEntry[];
};

/**
**IMPORTANT**: this type is available as a preview. You can rely on it to update your importers, for when it will be officially available.

A World contains multiple levels, and it has its own layout settings.
**/

export type WorldJson = {
  /** Unique instance identifer **/

  iid: string;

  /** User defined unique identifier **/

  identifier: string;

  /**
		All levels from this world. The order of this array is only relevant in `LinearHorizontal` and `linearVertical` world layouts (see `worldLayout` value). Otherwise, you should refer to the `worldX`,`worldY` coordinates of each Level.
	**/

  levels: LevelJson[];

  /**
		An enum that describes how levels are organized in this project (ie. linearly or in a 2D space).
	**/

  worldLayout: WorldLayout;

  /** Width of the world grid in pixels. **/

  worldGridWidth: number;

  /** Height of the world grid in pixels. **/

  worldGridHeight: number;
};

/**
  If you're writing your own LDtk importer, you should probably just ignore *most* stuff in the `defs` section, as it
  contains data that are mostly important to the editor. To keep you away from the `defs` section and avoid some 
  unnecessary JSON parsing, important data from definitions is often duplicated in fields prefixed with a double 
  underscore (eg. `__identifier` or `__type`).

  The 2 only definition types you might need here are **Tilesets** and **Enums**.
**/
type LdtkDefinitionsJson = {
  /** All tilesets **/
  tilesets: LdtkTilesetDefJson[];
};

/**
  The `Tileset` definition is the most important part among project definitions. It contains some extra informations
  about each integrated tileset. If you only had to parse one definition section, that would be the one.
**/
type LdtkTilesetDefJson = {
  /** User defined unique identifier **/
  identifier: string;

  /** Unique Intidentifier **/
  uid: number;

  tileGridSize: number;

  /** Space in pixels between all tiles **/
  spacing: number;

  /** Distance in pixels from image borders **/
  padding: number;
};

/**
This section contains all the level data. It can be found in 2 distinct forms, depending on Project current settings:

- If "*Separate level files*" is **disabled** (default): full level data is *embedded* inside the main Project JSON file,
- If "*Separate level files*" is **enabled**: level data is stored in *separate* standalone `.ldtkl` files (one per level). In this case, the main Project JSON file will still contain most level data, except heavy sections, like the `layerInstances` array (which will be null). The `externalRelPath` string points to the `ldtkl` file.

A `ldtkl` file is just a JSON file containing exactly what is described below.
**/

export type LevelJson = {
  /** Unique Int identifier **/
  uid: number;

  /**
		Unique instance identifier
	**/

  iid: string;

  /** User defined unique identifier **/
  identifier: string;

  /**
		World X coordinate in pixels.
		Only relevant for world layouts where level spatial positioning is manual (ie. GridVania, Free). For Horizontal and Vertical layouts, the value is always -1 here.
	**/

  worldX: number;

  /**
		World Y coordinate in pixels.
		Only relevant for world layouts where level spatial positioning is manual (ie. GridVania, Free). For Horizontal and Vertical layouts, the value is always -1 here.
	**/

  worldY: number;

  /**
		Index that represents the "depth" of the level in the world. Default is 0, greater means "above", lower means "below".
		This value is mostly used for display only and is intended to make stacking of levels easier to manage.
	**/

  worldDepth: number;

  /** Width of the level in pixels **/
  pxWid: number;

  /** Height of the level in pixels **/
  pxHei: number;

  /** Background color of the level (same as `bgColor`, except the default value is automatically used here if its value is `null`) **/

  __bgColor: string;

  /**
		An array containing all Layer instances. **IMPORTANT**: if the project option "*Save levels separately*" is enabled, this field will be `null`.
		This array is **sorted in display order**: the 1st layer is the top-most and the last is behind.
	**/

  layerInstances?: LayerInstanceJson[];

  /** An array containing this level custom field values. **/

  fieldInstances: FieldInstanceJson[];

  /**
		This value is not null if the project option "*Save levels separately*" is enabled. In this case, this **relative** path points to the level Json file.
	**/

  externalRelPath?: string;

  /**
		An array listing all other levels touching this one on the world map. Since 1.4.0, this includes levels that overlap in the same world layer, or in nearby world layers.
		Only relevant for world layouts where level spatial positioning is manual (ie. GridVania, Free). For Horizontal and Vertical layouts, this array is always empty.
	**/

  __neighbours: NeighbourLevel[];

  /**
		The *optional* relative path to the level background image.
	**/

  bgRelPath?: string;

  /**
		Position informations of the background image, if there is one.
	**/

  __bgPos?: LevelBgPosInfos;
};

export type LayerInstanceJson = {
  /** Layer definition identifier **/
  __identifier: string;

  /** Layer type (possible values: numberGrid, Entities, Tiles or AutoLayer) **/
  __type: LayerType;

  /** Grid-based width **/
  __cWid: number;

  /** Grid-based height **/
  __cHei: number;

  /** Grid size **/
  __gridSize: number;

  /** Layer opacity as Float [0-1] **/

  __opacity: number;

  /** Total layer X pixel offset, including both instance and definition offsets. **/

  __pxTotalOffsetX: number;

  /** Total layer Y pixel offset, including both instance and definition offsets. **/

  __pxTotalOffsetY: number;

  /** The definition UID of corresponding Tileset, if any. **/

  __tilesetDefUid?: number;

  /** The relative path to corresponding Tileset, if any. **/

  __tilesetRelPath?: string;

  /** Unique layer instance identifier **/
  iid: string;

  /** Reference to the UID of the level containing this layer instance **/
  levelId: number;

  /** Reference the Layer definition UID **/
  layerDefUid: number;

  /** Layer instance visibility **/

  visible: boolean;

  /** X offset in pixels to render this layer, usually 0 (IMPORTANT: this should be added to the `LayerDef` optional offset, so you should probably prefer using `__pxTotalOffsetX` which contains the total offset value) **/

  pxOffsetX: number;

  /** Y offset in pixels to render this layer, usually 0 (IMPORTANT: this should be added to the `LayerDef` optional offset, so you should probably prefer using `__pxTotalOffsetX` which contains the total offset value) **/

  pxOffsetY: number;

  /**
		The list of IntGrid values, stored using coordinate ID system (refer to online documentation for more info about "Coordinate IDs")
	**/

  intGrid?: IntGridValueInstance[];

  /**
		A list of all values in the IntGrid layer, stored in CSV format (Comma Separated Values).
		Order is from left to right, and top to bottom (ie. first row from left to right, followed by second row, etc).
		`0` means "empty cell" and IntGrid values start at 1.
		The array size is `__cWid` x `__cHei` cells.
	**/

  intGridCsv: number[];

  gridTiles: Tile[];

  /** This layer can use another tileset by overriding the tileset UID here. **/

  overrideTilesetUid?: number;

  /**
		An array containing all tiles generated by Auto-layer rules. The array is already sorted in display order (ie. 1st tile is beneath 2nd, which is beneath 3rd etc.).

		Note: if multiple tiles are stacked in the same cell as the result of different rules, all tiles behind opaque ones will be discarded.
	**/

  autoLayerTiles: Tile[];

  entityInstances: EntityInstanceJson[];
};

/**
	This structure represents a single tile from a given Tileset.
**/

export type Tile = {
  /** Pixel coordinates of the tile in the **layer** (`[x,y]` format). Don't forget optional layer offsets, if they exist! **/

  px: number[];

  /** Pixel coordinates of the tile in the **tileset** (`[x,y]` format) **/
  src: number[];

  /**
		"Flip bits", a 2-bits integer to represent the mirror transformations of the tile.
		 - Bit 0 = X flip
		 - Bit 1 = Y flip
		 Examples: f=0 (no flip), f=1 (X flip only), f=2 (Y flip only), f=3 (both flips)
	**/
  f: number;

  /**
		The *Tile ID* in the corresponding tileset.
	**/

  t: number;

  /** Alpha/opacity of the tile (0-1, defaults to 1) **/

  a: number;
};

/**
	This object represents a custom sub rectangle in a Tileset image.
**/

export type TilesetRect = {
  /** UID of the tileset **/

  tilesetUid: number;

  /** X pixels coordinate of the top-left corner in the Tileset image **/

  x: number;

  /** Y pixels coordinate of the top-left corner in the Tileset image **/

  y: number;

  /** Width in pixels **/

  w: number;

  /** Height in pixels **/

  h: number;
};

export type EntityInstanceJson = {
  /** Entity definition identifier **/
  __identifier: string;

  /** Grid-based coordinates (`[x,y]` format) **/

  __grid: number[];

  /** Pivot coordinates  (`[x,y]` format, values are from 0 to 1) of the Entity **/

  __pivot: number[];

  /** Array of tags defined in this Entity definition **/

  __tags: string[];

  /** X world coordinate in pixels. Only available in GridVania or Free world layouts. **/

  __worldX?: number;

  /** Y world coordinate in pixels Only available in GridVania or Free world layouts. **/

  __worldY?: number;

  /** Entity width in pixels. For non-resizable entities, it will be the same as Entity definition. **/

  width: number;

  /** Entity height in pixels. For non-resizable entities, it will be the same as Entity definition. **/

  height: number;

  /**
		Optional TilesetRect used to display this entity (it could either be the default Entity tile, or some tile provided by a field value, like an Enum).
	**/

  __tile: TilesetRect[];

  /**
		The entity "smart" color, guessed from either Entity definition, or one its field instances.
	**/

  __smartColor: string;

  /**
		Unique instance identifier
	**/

  iid: string;

  /** Reference of the **Entity definition** UID **/
  defUid: number;

  /** Pixel coordinates (`[x,y]` format) in current level coordinate space. Don't forget optional layer offsets, if they exist! **/

  px: number[];

  /** An array of all custom fields and their values. **/
  fieldInstances: FieldInstanceJson[];
};

export type FieldInstanceJson = {
  /** Field definition identifier **/
  __identifier: string;

  /**
		Actual value of the field instance. The value type varies, depending on `__type`:
		 - For **classic types** (ie. Integer, Float, Boolean, String, Text and FilePath), you just get the actual value with the expected type.
		 - For **Color**, the value is an hexadecimal string using "#rrggbb" format.
		 - For **Enum**, the value is a String representing the selected enum value.
		 - For **Point**, the value is a [GridPoint](#ldtk-GridPoint) object.
		 - For **Tile**, the value is a [TilesetRect](#ldtk-TilesetRect) object.
		 - For **EntityRef**, the value is an [EntityReferenceInfos](#ldtk-EntityReferenceInfos) object.

		If the field is an array, then this `__value` will also be a JSON array.
	**/

  __value: unknown;

  /**
		Type of the field, such as `Int`, `Float`, `String`, `Enum(my_enum_name)`, `Bool`, etc.
		NOTE: if you enable the advanced option **Use Multilines type**, you will have "*Multilines*" instead of "*String*" when relevant.
	**/
  __type: string;

  /**
		Optional TilesetRect used to display this field (this can be the field own Tile, or some other Tile guessed from the value, like an Enum).
	**/

  __tile?: TilesetRect;

  /**
		Reference of the **Field definition** UID
	**/
  defUid: number;
};

/* INLINED TYPES *****************************************************************************/

/** Nearby level info **/

export type NeighbourLevel = {
  /** Neighbour Instance Identifier **/

  levelIid: string;

  levelUid?: number;

  /**
		A lowercase string tipping on the level location (`n`orth, `s`outh, `w`est, `e`ast).
		Since 1.4.0, this value can also be `<` (neighbour depth is lower), `>` (neighbour depth is greater) or `o` (levels overlap and share the same world depth).
		Since 1.5.3, this value can also be `nw`,`ne`,`sw` or `se` for levels only touching corners.
	**/

  dir: string;
};

/** Level background image position info **/

export type LevelBgPosInfos = {
  /** An array containing the `[x,y]` pixel coordinates of the top-left corner of the **cropped** background image, depending on `bgPos` option. **/
  topLeftPx: number[];

  /** An array containing the `[scaleX,scaleY]` values of the **cropped** background image, depending on `bgPos` option. **/
  scale: number[];

  /** An array of 4 float values describing the cropped sub-rectangle of the displayed background image. This cropping happens when original is larger than the level bounds. Array format: `[ cropX, cropY, cropWidth, cropHeight ]`**/
  cropRect: number[];
};

/** IntGrid value instance **/

export type IntGridValueInstance = {
  /** Coordinate ID in the layer grid **/
  coordId: number;

  /** IntGrid value **/
  v: number;
};

/** IntGrid value definition **/

export type IntGridValueDef = {
  /**
		The IntGrid value itself
	**/

  value: number;

  /** User defined unique identifier **/
  identifier: string[];

  color: String;

  tile?: TilesetRect;

  /** Parent group identifier (0 if none)**/

  groupUid: number;
};

/** IntGrid value group definition **/

export type IntGridValueGroupDef = {
  /** Group unique ID **/
  uid: number;

  /** User defined string identifier **/
  identifier?: string;

  /** User defined color **/
  color?: string;
};

/** In a tileset definition, enum based tag infos **/

export type EnumTagValue = {
  enumValueId: string;
  tileIds: number[];
};

/** In a tileset definition, user defined meta-data of a tile. **/

export type TileCustomMetadata = {
  tileId: number;
  data: string;
};

/** This object describes the "location" of an Entity instance in the project worlds. **/

export type EntityReferenceInfos = {
  /** IID of the refered EntityInstance **/

  entityIid: string;

  /** IID of the LayerInstance containing the refered EntityInstance **/

  layerIid: string;

  /** IID of the Level containing the refered EntityInstance **/

  levelIid: string;

  /** IID of the World containing the refered EntityInstance **/

  worldIid: string;
};

/**
	This object is just a grid-based coordinate used in Field values.
**/

export type GridPoint = {
  /** X grid-based coordinate **/

  cx: number;

  /** Y grid-based coordinate **/

  cy: number;
};

export type CustomCommand = {
  command: string;
  when: CustomCommandTrigger;
};

export type TableOfContentEntry = {
  identifier: string;

  instances: EntityReferenceInfos[];

  instancesData: TocInstanceData[];
};

export type TocInstanceData = {
  /** IID information of this instance **/
  iids: EntityReferenceInfos;

  worldX: number;
  worldY: number;
  widPx: number;
  heiPx: number;

  /** An object containing the values of all entity fields with the `exportToToc` option enabled. This object typing depends on actual field value types. **/
  fields: unknown;
};

/* MISC ENUMS *****************************************************************************/

export type WorldLayout = 'Free' | 'GridVania' | 'LinearHorizontal' | 'LinearVertical';

export type LayerType = 'IntGrid' | 'Entities' | 'Tiles' | 'AutoLayer';

export type AutoLayerRuleTileMode = 'Single' | 'Stamp';

export type AutoLayerRuleCheckerMode = 'None' | 'Horizontal' | 'Vertical';

export type FieldDisplayPosition = 'Above' | 'Center' | 'Beneath';

export type FieldType =
  | 'F_Int'
  | 'F_Float'
  | 'F_String'
  | 'F_Text'
  | 'F_Bool'
  | 'F_Color'
  | 'F_export'
  | 'F_Point'
  | 'F_Path'
  | 'F_EntityRef'
  | 'F_Tile';

export type EntityRenderMode = 'Rectangle' | 'Ellipse' | 'Tile' | 'Cross';

export type EntityTileRenderMode =
  | 'Cover'
  | 'FitInside'
  | 'Repeat'
  | 'Stretch'
  | 'FullSizeCropped'
  | 'FullSizeUncropped'
  | 'NineSlice';

export type EntityLimitBehavior = 'DiscardOldOnes' | 'PreventAdding' | 'MoveLastOne';

export type FieldDisplayMode =
  | 'Hidden'
  | 'ValueOnly'
  | 'NameAndValue'
  | 'EntityTile'
  | 'LevelTile'
  | 'Points'
  | 'PointStar'
  | 'PointPath'
  | 'PointPathLoop'
  | 'RadiusPx'
  | 'RadiusGrid'
  | 'ArrayCountWithLabel'
  | 'ArrayCountNoLabel'
  | 'RefLinkBetweenPivots'
  | 'RefLinkBetweenCenters';

export type FieldLinkStyle = 'ZigZag' | 'StraightArrow' | 'CurvedArrow' | 'ArrowsLine' | 'DashedLine';

export type BgImagePos = 'Unscaled' | 'Contain' | 'Cover' | 'CoverDirty' | 'Repeat';

export type TextLanguageMode =
  | 'LangPython'
  | 'LangRuby'
  | 'LangJS'
  | 'LangLua'
  | 'LangC'
  | 'LangHaxe'
  | 'LangMarkdown'
  | 'LangJson'
  | 'LangXml'
  | 'LangLog';

export type ProjectFlag =
  | 'DiscardPreCsvIntGrid' // backward compatibility
  | 'ExportOldTableOfContentData'
  | 'ExportPreCsvIntGridFormat'
  | 'IgnoreBackupSuggest'
  | 'PrependIndexToLevelFileNames'
  | 'MultiWorlds'
  | 'UseMultilinesType';

export type EntityLimitScope = 'PerLayer' | 'PerLevel' | 'PerWorld';

export type ImageExportMode = 'None' | 'OneImagePerLayer' | 'OneImagePerLevel' | 'LayersAndLevels';

export type EntityReferenceTarget = 'Any' | 'OnlySame' | 'OnlyTags' | 'OnlySpecificEntity';

export type IdentifierStyle = 'Capitalize' | 'Uppercase' | 'Lowercase' | 'Free';

export type EmbedAtlas = 'LdtkIcons';

export type CustomCommandTrigger = 'Manual' | 'AfterLoad' | 'BeforeSave' | 'AfterSave';
