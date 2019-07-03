import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import Alchemist from "./img/alchemist.png";
import Arcanist from "./img/arcanist.png";
import Bestiary from "./img/bestiary.png";
import Blacksmith from "./img/blacksmith.png";
import Demonologist from "./img/demonologist.png";
import Dungeon from "./img/dungeon.png";
import Inn from "./img/inn.png";
import Keep from "./img/keep.png";
import Outpost from "./img/outpost.png";
import Shop from "./img/shop.png";


export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: "100%",
        height: "100%",
        latitude: this.props.lat,
        longitude: this.props.long,
        data: null,
        zoom: 16
      }
    };

  }

  componentDidMount() {
    // this.setState({latitude: this.props.latitude, longitude: this.props.longitude, data: this.props.markerData});
  }

  updatePoint(id, coords){
    console.log(id, coords);
  }

  render() {
    if (this.props.markerData !== undefined && this.props.markerData !== null) {
      return (
        <ReactMapGL
          {...this.state.viewport}
          mapStyle={"mapbox://styles/nlschneider/cjx3jkcbk14ho1crw854isk20"}
          onViewportChange={viewport => this.setState({ viewport })}
          mapboxApiAccessToken={
            "pk.eyJ1IjoibmxzY2huZWlkZXIiLCJhIjoiY2p4M2ppdzB4MDFqdzQ5bzhqazZ3MXRnNiJ9.7a0pJA4K4f-2oLLH2HR5lg"
          }
        >
          {this.props.markerData.map(point => {
            icon = point.properties.type;      
            return (
              <Marker
              
                draggable={true}
                onDragEnd={event => this.updatePoint(event.srcEvent.path[1].id, event.lngLat)}
                latitude={point.geometry.coordinates[0]}
                longitude={point.geometry.coordinates[1]}
                id={`${point._id}`}
              >
                <img src= {
                  icon === 'Shop' ? Shop : 
                  icon === 'Alchemist' ? Alchemist :
                  icon === 'Arcanist' ? Arcanist :
                  icon === 'Blacksmith' ? Blacksmith :
                  icon === 'Demonologist' ? Demonologist :
                  icon === 'Dungeon' ? Dungeon :
                  icon === 'Bestiary' ? Bestiary :
                  icon === 'Inn' ? Inn :
                  icon === 'Keep' ? Keep : Outpost
              } width={ this.state.viewport['zoom'] * 5 } alt="" />
              </Marker>
            );
          })}

        </ReactMapGL>
      );
    }
  }
}
