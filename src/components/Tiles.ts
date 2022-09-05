import m from "mithril";
import { Coordinate, Line, Square } from "../domain/types";

import { GeoJSON as GJSON } from "geojson";

const what3WordsUrl = "https://api.what3words.com/v3/";

const WHAT3WORDS = import.meta.env.VITE_WHAT3WORDS_KEY;

// coordinate order of openlayers is opposite to api. 3 words api is lat, lng

type What3WordsCoordinateResponse = {
  country: string; //GB
  square: {
    southwest: Coordinate;
    northeast: Coordinate;
  };
  nearestPlace: string;
  coordinates: Coordinate;
  words: string; //"arrive.crew.rated";
  language: string; //"en";
  map: string; //"https://w3w.co/arrive.crew.rated";
};

let What3WordsGrid = {
  // geoJson: {} as GeoJSON,
  getGrid: async function ([sw, ne]: [Coordinate, Coordinate]) {
    return m
      .request<GJSON>({
        method: "GET",
        headers: {
          Accept: "*/*",
        },
        url:
          what3WordsUrl +
          `grid-section?bounding-box=${sw.lat},${sw.lng},${ne.lat},${ne.lng}&format=geojson&key=${WHAT3WORDS}`,
      })
      .then((geoJson) => {
        //this.geoJson = geoJson;
        //antipattern? who cares
        return geoJson;
      });
  },
  getTile: async function ({ lat, lng }: Coordinate) {
    return m
      .request<What3WordsCoordinateResponse>({
        method: "GET",
        headers: {
          Accept: "*/*",
        },
        url:
          what3WordsUrl +
          `convert-to-3wa?coordinates=${lat},${lng}&key=${WHAT3WORDS}`,
      })
      .then(({ words, square }): Square => ({ words, ...square }));
  },
};
export default What3WordsGrid;
