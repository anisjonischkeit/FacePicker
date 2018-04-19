# Installing

`yarn add git+ssh://git@bitbucket.org/imagus/ImagusFacePicker.git#latest`

# Usage

## Example

```
import ImagusFacePicker from "ImagusFacePicker"
<div style={{ width: "50%", height: "500px"}}>
  <ImagusFacePicker
    faces={[
      {
        left : {
          x : 150,
          y : 150
        },
        right : {
          x : 250,
          y : 150
        }
      }
    ]}
    selection={null}
    facesDidUpdate={(faces, selection) => this.setState({
      ...this.state,
      faces: faces,
      selection: selection
    })}
    imgUrl={this.state.imgUrl}
  />
</div>
```

make sure to wrap the imagus face picker in a div with a width and height. The facepicker will stretch or shrink to whatever it div is containing it

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

