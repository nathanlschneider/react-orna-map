import React, { Component } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
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
import Edit from "./img/edit.svg";
import Exit from "./img/exit.svg";

let icon;
let list = [];

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: "100%",
        height: "100%",
        latitude: this.props.latitude,
        longitude: this.props.longitude,
        data: null,
        zoom: 16
      },
      canEdit: false,
      list: []
    };

  }
  _goToViewport = () => {
    this._onViewportChange({
      longitude: this.props.longitude,
      latitude: this.props.latitude,
      zoom: 16,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 1000
    });
  };

  _reload = () => window.location.reload();


  _handleChange = e =>
    this.setState({
      canEdit: !this.state.canEdit
    });

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }
  _resize = () => {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this._resize);
  }

  componentDidMount() {
    window.addEventListener("resize", this._resize);
    this._resize();
    this.setState({
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      data: this.props.markerData
    });
  }

  updatePoint(id, coords, index) {
    fetch("https://nschneider.info/dbu", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id, coordinates: coords })
    })
      .then(this.props.refresh())
      .catch(console.error);
  }

  render() {
    const size = 10;
    const { zoom } = this.state.viewport;

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
          {this.props.markerData.slice().map((point, index) => {
            list.push([index, point.coordinates]);
          })}
          {this.props.markerData.map((point, index) => {
            icon = point.type;
            return (
              <Marker
                key={index}
                draggable={this.state.canEdit}
                onDragEnd={event => {
                  list[index][1] = event.lngLat;
                  this.setState({ ...this.state });
                  this.updatePoint(`${point._id}`, event.lngLat, index);
                }}
                longitude={list[index][1][0]}
                latitude={list[index][1][1]}
              >
                <img
                  className="mapIcon"
                  src={
                    icon === "Shop"
                      ? Shop
                      : icon === "Alchemist"
                      ? Alchemist
                      : icon === "Arcanist"
                      ? Arcanist
                      : icon === "Blacksmith"
                      ? Blacksmith
                      : icon === "Demonologist"
                      ? Demonologist
                      : icon === "Dungeon"
                      ? Dungeon
                      : icon === "Bestiary"
                      ? Bestiary
                      : icon === "Inn"
                      ? Inn
                      : icon === "Keep"
                      ? Keep
                      : Outpost
                  }
                  width={
                    zoom <= 15
                      ? zoom * 2
                      : zoom <= 15.5
                      ? zoom * 3
                      : zoom <= 16
                      ? zoom * 4
                      : zoom <= 16.5
                      ? zoom * 5
                      : zoom <= 17
                      ? zoom * 6
                      : zoom <= 17.5
                      ? zoom * 7
                      : zoom <= 18
                      ? zoom * 8
                      : zoom <= 18.5
                      ? zoom * 9
                      : zoom <= 19
                      ? zoom * 10
                      : zoom * 11
                  }
                  style={
                    this.state.canEdit
                      ? {
                          opacity: 0.5,
                          backgroundColor: "red",
                          borderRadius: "5px",
                          transform: `translate(${-size / 1.8}px,${-size}px)`
                        }
                      : { transform: `translate(${-size / 1.8}px,${-size}px)` }
                  }
                  alt=""
                />
              </Marker>
            );
          })}
<div className="control-container nes-container is-rounded">
          <div className="center-btn" onClick={this._goToViewport} />
          <div
            className="edit-btn"
            style={
              this.state.canEdit
                ? { backgroundImage: `url(${Exit})` }
                : { backgroundImage: `url(${Edit})` }
            }
            onClick={this._handleChange}
          />
          <div className="reload-btn" onClick={this._reload} />


          </div>
        </ReactMapGL>
      );
    }
    this.setState({ list: list });
  }
}
