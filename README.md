# Face Picker

This package exposes a React component that you can drop into your existing react app.

# Installing

```
yarn add git+https://github.com/anisjonischkeit/FacePicker.git#latest
```

# Usage

## Example

An example of the usage in a react app can be found in the examples folder.

## Accepted Props

```
type Position = {
    x: number,
    y: number
}

type Eyes = {
    left: Position,
    right: Position
}

type PropsType = {
    faces: Array<Eyes>,
    selection: ?number,
    facesDidUpdate: ?((Array<Eyes>, ?number) => void),
    imgUrl: string,
    maxSize: ?{
        width: ?int,
        height: ?int
    }
}
```

### faces

A list of faces that you wish to display on the FacePicker

### selection

The index of the face you wish to have selected

### facesDidUpdate

Callback that fires whenever a face's position is updated on the FacePicker

### imgUrl

The url of an image to be passed in

### maxSize

The Maximum size that the image should be

# Releasing a new version to github

make sure all of your changes are commited to git and pushed to the server, then run:

```
yarn release
```
