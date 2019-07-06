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
let icon;
let list = [];

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
      },
      canEdit: false,
      menuIsOpen: false,
      list: []
    };

    this._handleSlideMenu = this._handleSlideMenu.bind(this);
  }

  _handleSlideMenu = () => this.setState({menuIsOpen: !this.state.menuIsOpen});
  _handleChange = (e) => this.setState({ canEdit: e.target.checked, menuIsOpen: !this.state.menuIsOpen});

  componentDidMount() {
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
                  width={this.state.viewport["zoom"] * 5}
                  style={
                    this.state.canEdit
                      ? {
                          opacity: 0.5,
                          backgroundColor: "red",
                          borderRadius: "5px"
                        }
                      : {}
                  }
                  alt=""
                />
              </Marker>
            );
          })}

          <div
            
            className="slideMenu nes-container is-rounded"
            style={this.state.menuIsOpen ? {transform: 'translateX(0)'}:{transform: 'translateX(-75vw)'}}
          >
            <label>
              <input type="checkbox" className="slideMenu-checkbox nes-checkbox" onChange={this._handleChange}/>
              <span>Edit Mode</span>
            </label>
            <div className="slideMenu-btn" onClick={this._handleSlideMenu} style={this.state.menuIsOpen ? {transform: 'rotate(180deg)' }:{transform: 'rotate(0deg)'}}>></div>
           
          </div>
        </ReactMapGL>
      );
    }
    this.setState({ list: list });
  }
}
