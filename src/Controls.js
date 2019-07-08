import React, { Component } from "react";

export class Delete extends Component {
  render() {
    const { fill, ...rest } = this.props;
    return (
      <svg
        {...rest}
        fill={fill}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="15" y="12" width="2" height="12" />
        <rect x="19" y="12" width="2" height="12" />
        <rect x="11" y="12" width="2" height="12" />
        <path d="M20,6V5a3,3,0,0,0-3-3H15a3,3,0,0,0-3,3V6H4V8H6V27a3,3,0,0,0,3,3H23a3,3,0,0,0,3-3V8h2V6ZM14,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H14ZM24,27a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V8H24Z" />
      </svg>
    );
  }
}

export class Move extends Component {
  render() {
    const { fill, ...rest } = this.props;
    return (
      <svg
        {...rest}
        fill={fill}
        enableBackground="new 0 0 1000 1000"
        version="1.1"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <metadata>
          {" "}
          Svg Vector Icons : http://www.onlinewebfonts.com/icon{" "}
        </metadata>
        <path d="M556.8,621.4H443.2v162.5H293.9L500,990l206.1-206H556.8V621.4z" />
        <path d="M443.2,378.6h113.6V216.1h149.4L500,10L293.9,216.1h149.3V378.6z" />
        <path d="M990,500L783.9,293.9v149.3H621.4v113.6h162.5v149.3L990,500z" />
        <path d="M378.6,556.8V443.2H216.1V293.9L10,500l206.1,206.1V556.8H378.6z" />
      </svg>
    );
  }
}

export class Locate extends Component {
  render() {
    const { fill, ...rest } = this.props;
    return (
      <svg
        {...rest}
        fill={fill}
        enableBackground="new 0 0 297 297"
        version="1.1"
        viewBox="0 0 297 297"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m148.5 0c-81.847 0-148.43 66.616-148.43 148.5 0 81.884 66.586 148.5 148.43 148.5s148.43-66.617 148.43-148.5c0-81.883-66.586-148.5-148.43-148.5zm10.097 276.41v-61.274c0-5.575-4.521-10.097-10.097-10.097s-10.097 4.521-10.097 10.097v61.274c-62.68-4.908-112.84-55.102-117.75-117.81h61.207c5.575 0 10.097-4.521 10.097-10.097s-4.522-10.097-10.097-10.097h-61.207c4.902-62.713 55.067-112.91 117.75-117.81v61.274c0 5.575 4.521 10.097 10.097 10.097s10.097-4.521 10.097-10.097v-61.274c62.681 4.908 112.85 55.102 117.75 117.81h-61.207c-5.575 0-10.097 4.521-10.097 10.097s4.521 10.097 10.097 10.097h61.207c-4.903 62.713-55.068 112.91-117.75 117.81z" />
      </svg>
    );
  }
}
