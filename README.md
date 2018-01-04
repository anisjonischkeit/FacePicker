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
        />
        <button onClick={this.resetStage}>reset</button>
      </div>
    );
  }
}
```
