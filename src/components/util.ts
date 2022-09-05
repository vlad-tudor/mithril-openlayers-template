import { Map } from "ol";
import { Extent } from "ol/extent";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Style, { StyleFunction } from "ol/style/Style";
import What3WordsGrid from "./Tiles";
import GeoJSON from "ol/format/GeoJSON";
import { GeoJSON as GJSON } from "geojson";
import { Coordinate, Square } from "../domain/types";

// work in progress, probbably refactor/make a builder for all these style functions

export const gridStyleFunction: StyleFunction = function (feature) {
  const styleType = feature?.getGeometry()?.getType();
  // evolve into something that's not stupid
  if (styleType === "MultiLineString") {
    return new Style({
      stroke: new Stroke({
        color: "darkgray",
        width: 1,
      }),
    });
  }
};

export const squareStyleFunction: StyleFunction = function (feature) {
  const styleType = feature?.getGeometry()?.getType();
  // evolve into something that's not stupid
  if (styleType === "Polygon") {
    return new Style({
      stroke: new Stroke({
        color: "red",
        width: 1,
      }),
    });
  }
};

export const getGridForMap = async (map: Map) => {
  const zoom = map.getView().getZoom() || 0;
  const layer =
    zoom > 17
      ? [await makeGridLayer(map.getView().calculateExtent(map.getSize()))]
      : [];
  return layer;
};

export const makeGridLayer = async ([swlng, swlat, nelng, nelat]: Extent) => {
  const grid = await What3WordsGrid.getGrid([
    { lat: swlat, lng: swlng },
    { lat: nelat, lng: nelng },
  ]);
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(grid),
    }),
    style: gridStyleFunction,
  });
  return vectorLayer;
};

export const getSquareForMap = async (coord: Coordinate) => {
  const square = await What3WordsGrid.getTile(coord);
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(makeFeatureFromSquare(square)),
    }),
    style: squareStyleFunction,
  });
  return vectorLayer;
};

const makeFeatureFromSquare = ({ northeast, southwest }: Square) => {
  // southwest, northwest, northeast, sourtheast
  // order: [lng, lat]
  const squareCorrdinates = [
    [
      [southwest.lng, southwest.lat],
      [southwest.lng, northeast.lat], // northwest
      [northeast.lng, northeast.lat],
      [northeast.lng, southwest.lat], // southeast
    ],
  ];

  // wrap in feature
  const squareFeature: GeoJSON.Feature = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: squareCorrdinates,
    },
    properties: {},
  };
  return squareFeature;
};

const wrapInFeatures = (feature: GeoJSON.Feature) => {
  const geoJsonn: GJSON = {
    features: [feature],
    type: "FeatureCollection",
  };
  return geoJsonn;
};
