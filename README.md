# Installing

`yarn add git+ssh://git@bitbucket.org/imagus/ImagusFacePicker.git#latest`

# Usage

## Example

```
import ImagusFacePicker from "ImagusFacePicker"
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
  maxSize={{
    width: 300,
    height: 300
  }}
/>
```

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

