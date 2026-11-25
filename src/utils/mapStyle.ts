import type { StyleSpecification } from "maplibre-gl";

// OpenFreeMap's liberty style requests vector tiles from
// tiles.openfreemap.org/planet. EasyPrivacy blocks that path, MapLibre
// reports "Failed to fetch", and the page covers the map. CARTO's raster
// tiles are a full labeled basemap and are not on that blocklist.
export const MAP_STYLE: StyleSpecification = {
  version: 8,
  name: "Positron",
  sources: {
    carto: {
      type: "raster",
      tiles: ["https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
    },
  },
  layers: [
    {
      id: "carto",
      type: "raster",
      source: "carto",
    },
  ],
};
