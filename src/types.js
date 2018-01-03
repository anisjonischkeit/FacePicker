// @flow

export type EyeType = {
    x: number,
    y: number
}

export type FaceType = {
    eyes: {
        left: EyeType,
        right: EyeType
    }
}
