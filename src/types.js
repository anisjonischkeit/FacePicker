// @flow

export type EyeType = {
    x: number,
    y: number
}

export type EyesType = {
    left: EyeType,
    right: EyeType
}

export type FaceType = {
    eyes: EyesType
}
