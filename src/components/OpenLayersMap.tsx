import m, { Component, render } from "mithril";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

// make this file act like a real entrypoint

const renderMap = () =>
  function () {
    new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  };

const OpenLayersMap: Component = {
  oncreate: renderMap(),
  view: () => <div id="map"></div>,
};

export default OpenLayersMap;
