import {Key} from "../src/key.js"

export const saveKey = new Key("KeyS")
export const loadKey = new Key("KeyL")

export const switchModeKey = new Key("Space")

export const tileSetPropertiesKey = new Key("KeyI")
export const autoTilingEditorKey = new Key("KeyA")

// map mode

export const selectKey = new Key("LMB")
export const delKey = new Key("Delete")
export const panKey = new Key("ControlLeft", "MMB")
export const zoomInKey = new Key("WheelUp")
export const zoomOutKey = new Key("WheelDown")

export const newMapKey = new Key("KeyN")
export const renameObjectKey = new Key("KeyR")
export const copyObjectKey = new Key("KeyC")
export const deleteObjectKey = new Key("Delete")
export const newPointKey = new Key("KeyP")

// tile mode

export const changeBrushTypeKey = new Key("KeyB")
export const incrementBrushSizeKey = new Key("NumpadAdd")
export const decrementBrushSizeKey = new Key("NumpadSubtract")
export const rectangleModeKey = new Key("KeyR")
export const pipetteKey = new Key("KeyP")
export const groupKey = new Key("KeyG")
export const ungroupKey = new Key("KeyU")

// tile set

export const selectTileKey = new Key("LMB")
export const delTileSetKey = new Key("Delete")
export const panTileSetKey = new Key("ControlLeft", "MMB")
export const zoomInTileSetKey = new Key("WheelUp")
export const zoomOutTileSetKey = new Key("WheelDown")

// tile set properties key

export const selectTilePropertiesKey = new Key("LMB")
export const delPropertiesKey = new Key("Delete")
export const toggleVisibilityKey = new Key("KeyV")
export const newBlockKey = new Key("KeyB")
export const newFrameKey = new Key("KeyF")

// tile set auto tiling

export const copyCategoryKey = new Key("KeyC")
export const moveCategoryKey = new Key("KeyM")
export const loadCategoryKey = new Key("KeyL")