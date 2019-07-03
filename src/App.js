import React, { Component } from "react";
import "./App.scss";
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
//import Marker from "./img/marker.png";
import Map from "./Map";
let x = 0;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      coverMessage: "Saving!!",
      showIcons: false,
      showMap: true,
      error: null,
      latitude: null,
      longitude: null,
      selectedIcon: null,
      markerData: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.slideUp = this.slideUp.bind(this);
    this.slideDown = this.slideDown.bind(this);
    this.centerClick = this.centerClick.bind(this);
  }

  slideUp(e) {
    this.setState({ showIcons: true, showMap: false });
  }
  slideDown(e) {
    this.getMapPoints();
    this.setState({ showIcons: false, showMap: true });
  }

  centerClick(e) {}

  getMapPoints() {
    fetch("https://nschneider.info/dbr", { method: "GET" })
      .then(res => res.json())
      .then(json => this.setState({ markerData: json }));
  }

  setCurrentLocation(e) {
    navigator.geolocation.getCurrentPosition((data, err) => {
      this.setState({
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      });
    });
  }
  handleClick(e) {
    this.setState({ loading: true });
    // e.target.alt

    fetch("https://nschneider.info/dbw", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "Feature",
        properties: {
          type: e.target.alt
        },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(this.state.latitude) +
              parseFloat(
                (Math.random() * (0.0006 - 0.0002) + 0.0002).toFixed(5)
              ),
            parseFloat(this.state.longitude) +
              parseFloat(
                (Math.random() * (0.0006 - 0.0002) + 0.0002).toFixed(5)
              )
          ]
        }
      })
    }).then(res =>{
      setTimeout(()=>{ this.setState({loading: false}) }, 1000);
      
    });
  }
  componentDidMount() {
    this.getMapPoints();
    this.setCurrentLocation();
  }
  render() {
    console.log("App.js render", ++x);
    let mapLogic;
    if (
      this.state.markerData !== null &&
      this.state.longitude !== null &&
      this.state.latitude !== null
    ) {
      mapLogic = (
        <Map
          lat={this.state.latitude}
          long={this.state.longitude}
          markerData={this.state.markerData}
          icon={Shop}
        />
      );
    }

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
            <img src={Alchemist} alt="Alchemist" onClick={this.handleClick} />
            <img src={Arcanist} alt="Arcanist" onClick={this.handleClick} />
            <img src={Bestiary} alt="Bestiary" onClick={this.handleClick} />
            <img src={Blacksmith} alt="Blacksmith" onClick={this.handleClick} />
            <img
              src={Demonologist}
              alt="Demonologist"
              onClick={this.handleClick}
            />
            <img src={Dungeon} alt="Dungeon" onClick={this.handleClick} />
            <img src={Inn} alt="Inn" onClick={this.handleClick} />
            <img src={Keep} alt="Keep" onClick={this.handleClick} />
            <img src={Outpost} alt="Outpost" onClick={this.handleClick} />
            <img src={Shop} alt="Shop" onClick={this.handleClick} />
          </div>
          <div
            className="map-container"
            style={{ display: this.state.showMap ? "block" : "none" }}
          >
            {mapLogic}
          </div>
        </div>
        <footer>
          <div className="footer-container">
            <button
              type="button"
              onClick={this.slideUp}
              className="btn nes-btn is-primary"
            >
              Markers
            </button>
            <button
              type="button"
              onClick={this.slideDown}
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
