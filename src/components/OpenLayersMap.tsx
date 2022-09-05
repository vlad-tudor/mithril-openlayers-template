import m, { Comp } from "mithril";
import { Map, View } from "ol";
import Geometry from "ol/geom/Geometry";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { useGeographic } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { getGridForMap, getSquareForMap } from "./util";

// what a crappy way to switch coordinate system
useGeographic();

type GridLayer = VectorLayer<VectorSource<Geometry>>;

type Layers = {
  tiles: TileLayer<OSM>;
  grid: GridLayer[];
  activeSquare: GridLayer[];
};

type OpenLayersMapState = {
  openLayersMap: Map | null;
  layers: Layers;
  pending?: boolean;
};

const OpenLayersMap: Comp<{}, OpenLayersMapState> = {
  openLayersMap: null,
  layers: {
    tiles: new TileLayer({
      source: new OSM(),
    }),
    grid: [],
    activeSquare: [],
  },

  // depending on complexity, abstract all this map stuff behind some builder function
  oncreate: async (vnode) => {
    const { tiles } = vnode.state.layers;
    const map = new Map({
      target: "map",
      view: new View({
        // lng, lat
        center: [7.417963250732461, 43.73478447493214],
        zoom: 19,
      }),
      layers: [tiles],
    });

    map.on("moveend", async (...p) => {
      const layers = await getGridForMap(map);
      vnode.state.layers.grid = layers;
      const { tiles, activeSquare: square } = vnode.state.layers;
      map.setLayers([tiles, ...layers, ...square]);
    });

    // lng, lat
    // handle pending state properly, bit rubbish
    map.on("click", async ({ coordinate: [lng, lat] }) => {
      if (vnode.state.pending !== true) {
        vnode.state.pending = true;
        getSquareForMap({ lng, lat }).then((square) => {
          const { tiles, grid } = vnode.state.layers;
          vnode.state.pending = false;
          vnode.state.layers.activeSquare = [square];
          map.setLayers([tiles, ...grid, square]);
        });
      }
    });

    vnode.state.openLayersMap = map;
  },

  view: function () {
    // maybe use a loading spinner
    return (
      <div style={{ "text-align": "center", padding: "1rem" }}>
        <div id="map"></div>
      </div>
    );
  },
};

export default OpenLayersMap;
