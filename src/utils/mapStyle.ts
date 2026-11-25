import type { StyleSpecification } from "maplibre-gl";

// CARTO's raster endpoint now returns an "API key required" watermark.
// OpenFreeMap vector tiles are requested from /planet, which privacy
// filters block. These Esri canvas tiles are a labeled light basemap
// served as plain images, so they draw without a key or that filter.
export const MAP_STYLE: StyleSpecification = {
  version: 8,
  name: "Light gray",
  sources: {
    "esri-gray": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri, © OpenStreetMap contributors",
    },
    "esri-labels": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
  },
  layers: [
    { id: "esri-gray", type: "raster", source: "esri-gray" },
    { id: "esri-labels", type: "raster", source: "esri-labels" },
  ],
};
