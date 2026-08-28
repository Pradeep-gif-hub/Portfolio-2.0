import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { type Map as MapLibreMap, type Marker as MapLibreMarker } from "maplibre-gl";
import { LocateFixed, Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";
import { places, type Place } from "../data/places";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const getBounds = (destinations: Place[]) => {
  const bounds = new maplibregl.LngLatBounds();
  destinations.forEach((place) => bounds.extend(place.coordinates));
  return bounds;
};

const getMarkerElement = (place: Place, selected: boolean, onClick: () => void) => {
  const element = document.createElement("button");
  element.type = "button";
  element.className = `places-marker${selected ? " places-marker-selected" : ""}`;
  element.setAttribute("aria-label", `${place.name} in ${place.city}, ${place.country}`);
  element.title = `${place.name}, ${place.country}`;
  const label = document.createElement("span");
  label.className = "places-marker-label";
  label.textContent = place.city;
  element.append(label);
  element.addEventListener("click", onClick);
  return element;
};

const updateMarkerLabels = (map: MapLibreMap) => {
  const showLabels = map.getZoom() >= 5.7;
  document.querySelectorAll<HTMLElement>(".places-marker-label").forEach((label) => {
    label.style.opacity = showLabels ? "1" : "0";
  });
};

export const PlacesPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, MapLibreMarker>>(new Map());
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const fitAllPlaces = () => {
    const map = mapRef.current;
    if (!map || places.length === 0) return;
    map.fitBounds(getBounds(places), {
      padding: { top: 80, right: 80, bottom: 80, left: 80 },
      maxZoom: 5,
      duration: 850,
    });
  };

  const focusPlace = (place: Place) => {
    const map = mapRef.current;
    if (!map) return;
    setSelectedPlace(place);
    map.flyTo({
      center: place.coordinates,
      zoom: Math.min(Math.max(map.getZoom() + 1.7, 5.5), 8.5),
      duration: 1000,
      essential: true,
    });
  };

  useEffect(() => {
    document.title = "Places I've Visited | Awasthi";
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [78.8, 32.5],
      zoom: 2,
      attributionControl: false,
      renderWorldCopies: false,
      cooperativeGestures: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const addMarkers = () => {
      if (markersRef.current.size > 0) return;
      places.forEach((place) => {
        const marker = new maplibregl.Marker({ element: getMarkerElement(place, false, () => focusPlace(place)) })
          .setLngLat(place.coordinates)
          .addTo(map);
        markersRef.current.set(place.id, marker);
      });
      fitAllPlaces();
      updateMarkerLabels(map);
    };

    const handleError = (event: maplibregl.ErrorEvent) => {
      if (event.error?.message) setMapError(event.error.message);
    };

    map.on("load", addMarkers);
    map.on("styledata", addMarkers);
    map.on("idle", addMarkers);
    map.on("zoom", () => updateMarkerLabels(map));
    map.on("error", handleError);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle("places-marker-selected", selectedPlace?.id === id);
    });
  }, [selectedPlace]);

  return (
    <section className="places-page">
      <div className="places-heading">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="places-eyebrow">Personal atlas / {places.length} destinations</p>
          <h1>Places I&apos;ve Visited</h1>
          <p>Following the places that made the journey memorable.</p>
        </motion.div>
      </div>

      <div className="places-map-shell">
        <div ref={mapContainerRef} className="places-map" aria-label="Interactive OpenStreetMap showing visited places" />

        {mapError && (
          <div className="places-map-error" role="alert">
            <p>Map unavailable</p>
            <span>{mapError}</span>
          </div>
        )}

        {!mapError && (
          <div className="places-actions" aria-label="Map controls">
            <button type="button" aria-label="Zoom in map" onClick={() => mapRef.current?.zoomIn({ duration: 350 })}><Plus size={17} /></button>
            <button type="button" aria-label="Zoom out map" onClick={() => mapRef.current?.zoomOut({ duration: 350 })}><Minus size={17} /></button>
            <button type="button" className="places-view-all" aria-label="View all places" onClick={() => { setSelectedPlace(null); fitAllPlaces(); }}>
              <LocateFixed size={15} />
              View All
            </button>
          </div>
        )}

        {selectedPlace && (
          <aside className="places-card" aria-label={`${selectedPlace.name} details`}>
            <button type="button" className="places-card-close" aria-label={`Close ${selectedPlace.name} details`} onClick={() => setSelectedPlace(null)}>
              <X size={16} />
            </button>
            <img src={selectedPlace.image} alt={`${selectedPlace.name}, ${selectedPlace.city}`} />
            <div className="places-card-body">
              <p className="places-card-kicker">{selectedPlace.visitedDate ?? "Visited"}</p>
              <h2>{selectedPlace.name}</h2>
              <p className="places-card-location">{selectedPlace.city}, {selectedPlace.country}</p>
              {selectedPlace.description && <p className="places-card-description">{selectedPlace.description}</p>}
            </div>
          </aside>
        )}

      </div>
    </section>
  );
};
