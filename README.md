# Installing

`yarn add git+ssh://git@bitbucket.org/imagus/ImagusFacePicker.git#latest`

# Usage

## Example

```
import ImagusFacePicker from "ImagusFacePicker"

const getInitialFaces = () => ([
  {
    eyes: {
      left: {
        x: 20,
        y: 20,
      },
      right: {
        x: 40,
        y: 20,
      }
    }
  }
])

class App extends Component {
  state = {
    faces: getInitialFaces(),
    selected: 0
  }

  resetStage = () => {
    this.setState(() => ({
      faces: getInitialFaces()
    }))
  }

  updateFaces = (faces, selected) => {
    this.setState(() => ({
      faces,
      selected
    }))
  }

  render() {
    return (
      <div>
        <ImagusFacePicker
          faces={this.state.faces}
          selected={this.state.selected}
          onFacesUpdate={this.updateFaces}
          imgUrl="https://static.pexels.com/photos/207962/pexels-photo-207962.jpeg"
        />
        <button onClick={this.resetStage}>reset</button>
      </div>
    );
  }
}
```

## Accepted Props

### faces
A list of faces that you wish to display on the FacePicker

### selected
The index of the face you wish to have selected

### onFaceUpdate
Callback that fires whenever a face's position is updated on the FacePicker

### imgUrl
The url of an image to be passed in

### imgElement
The image element of an image to be passed in

### imgFile
The image file of an image to be passed in
