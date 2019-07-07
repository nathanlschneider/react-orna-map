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
import "./App.scss";

let icon;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      coverMessage: "Saving!!",
      showIcons: false,
      showMap: true,
      error: null,
      currentLatitude: null,
      currentLongitude: null,
      selectedIcon: null,
      markerData: null,
      viewport: {
        width: null,
        height: null,
        latitude: 0,
        longitude: 0,
        data: null,
        zoom: 16
      },
      canEdit: false,
      list: []
    };
  }

  showMarkers = () => this.setState({ showIcons: true, showMap: false });

  showMap = () => {this.setState({ showIcons: false, showMap: true }); this.getMarkerData()
};
   
  getMarkerData = () => {
    fetch("https://nschneider.info/dbr", { method: "GET" })
      .then(res => res.json())
      .then(json => this.setState({ markerData: json }))
  };

  setCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((data, err) => {
      this.setState({
        currentLatitude: data.coords.latitude,
        currentLongitude: data.coords.longitude
      });
      this._goToViewport();
    });
  };

  writeMarkerData = e => {
    console.log(this.state.viewport.longitude, this.state.currentLongitude);

    this.setState({ loading: true });
    fetch("https://nschneider.info/dbw", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: e.target.alt,
        coordinates: [
          this.state.viewport.longitude,
          this.state.viewport.latitude
        ]
      })
    }).then(() => {
      setTimeout(() => {
        this.setState({ loading: false });
        this.showMap();
      }, 1000);
    });
  };

  _goToViewport = () => {
    this._onViewportChange({
      longitude: this.state.currentLongitude,
      latitude: this.state.currentLatitude,
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

  updatePoint(id, coords, index) {
    fetch("https://nschneider.info/dbu", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id, coordinates: coords })
    })
      // .then(this.state.refresh())
      .catch(console.error);
  }


  componentDidMount() {
    fetch("https://nschneider.info/dbr", { method: "GET" })
      .then(res => res.json())
      .then(json => {
        this.setState({ markerData: json });
        this.setCurrentLocation();
        window.addEventListener("resize", this._resize);
        this._resize();
      });
  }

  render() {
    if (!this.state.viewport.longitude) return null;
    const size = 10;
    const { zoom } = this.state.viewport;
    let list = [];
    
    return (
      <div className="App">
        <div className="App-container nes-container is-rounded">
          <div
            className="App-cover"
            style={{
              display:
                this.state.loading && this.state.showIcons ? "block" : "none"
            }}
          >
            <div className="loading-text">{this.state.coverMessage}</div>
          </div>
          <nav />
          <div
            className="icon-container"
            style={{ display: this.state.showIcons ? "block" : "none" }}
          >
            <img
              src={Alchemist}
              alt="Alchemist"
              onClick={this.writeMarkerData}
            />
            <img src={Arcanist} alt="Arcanist" onClick={this.writeMarkerData} />
            <img src={Bestiary} alt="Bestiary" onClick={this.writeMarkerData} />
            <img
              src={Blacksmith}
              alt="Blacksmith"
              onClick={this.writeMarkerData}
            />
            <img
              src={Demonologist}
              alt="Demonologist"
              onClick={this.writeMarkerData}
            />
            <img src={Dungeon} alt="Dungeon" onClick={this.writeMarkerData} />
            <img src={Inn} alt="Inn" onClick={this.writeMarkerData} />
            <img src={Keep} alt="Keep" onClick={this.writeMarkerData} />
            <img src={Outpost} alt="Outpost" onClick={this.writeMarkerData} />
            <img src={Shop} alt="Shop" onClick={this.writeMarkerData} />
          </div>
          <div
            className="map-container"
            style={{ display: this.state.showMap ? "block" : "none" }}
          >
            <ReactMapGL
              {...this.state.viewport}
              mapStyle={"mapbox://styles/nlschneider/cjx3jkcbk14ho1crw854isk20"}
              onViewportChange={viewport => this.setState({ viewport })}
              mapboxApiAccessToken={
                "pk.eyJ1IjoibmxzY2huZWlkZXIiLCJhIjoiY2p4M2ppdzB4MDFqdzQ5bzhqazZ3MXRnNiJ9.7a0pJA4K4f-2oLLH2HR5lg"
              }
            >
              {this.state.markerData.map((point, index) => {
                list.push([index, point.coordinates]);
                icon = point.type;
                console.log(list)
                return (
                  <Marker
                    key={index}
                    draggable={this.state.canEdit}
                    onDragEnd={event => {
                      list[index][1] = event.lngLat;
                      this.setState({ ...this.state, list: list });
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
                              transform: `translate(${-size /
                                1.8}px,${-size}px)`
                            }
                          : {
                              transform: `translate(${-size /
                                1.8}px,${-size}px)`
                            }
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
          </div>
        </div>
        <footer>
          <div className="footer-container">
            <button
              type="button"
              onClick={this.showMarkers}
              className="btn nes-btn is-primary"
            >
              Markers
            </button>
            <button
              type="button"
              onClick={this.showMap}
              className="btn nes-btn is-primary"
            >
              Map
            </button>
          </div>
        </footer>
      </div>
    );
  }
}
