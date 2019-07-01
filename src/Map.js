import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

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
            return (
              <Marker
                latitude={point.geometry.coordinates[0]}
                longitude={point.geometry.coordinates[1]}
              >
                <img src={this.props.icon} width={50} alt="" />
                <div>{point.properties.type}</div>
              </Marker>
            );
          })}
        </ReactMapGL>
      );
    }
  }
}
