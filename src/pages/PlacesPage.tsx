import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { type Map as MapLibreMap, type Marker as MapLibreMarker } from "maplibre-gl";
import { LocateFixed, Minus, Navigation, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";
import { places as defaultPlaces, type Place } from "../data/place/places";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const getPlaceId = (place: Place): string => {
  return place._id || place.id || `${place.name}-${place.city}-${place.country}`;
};

const getBounds = (destinations: Place[]) => {
  const bounds = new maplibregl.LngLatBounds();
  destinations.forEach((place) => {
    if (place.coordinates && place.coordinates.length === 2) {
      bounds.extend(place.coordinates);
    }
  });
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
  const userMarkerRef = useRef<MapLibreMarker | null>(null);
  const [placeList, setPlaceList] = useState<Place[]>(defaultPlaces);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [onlineImage, setOnlineImage] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Fetch places from DB API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("/api/public-data?type=places");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.data) && data.data.length > 0) {
            setPlaceList(data.data);
          }
        }
      } catch {
        // Fallback to defaultPlaces already set
      }
    };

    fetchPlaces();
  }, []);

  // Fetch Wikipedia image if no custom image is available
  useEffect(() => {
    if (!selectedPlace) {
      setOnlineImage("");
      return;
    }

    const customImage = selectedPlace.image || selectedPlace.imageUrl;
    if (customImage) {
      setOnlineImage(customImage);
      return;
    }

    const controller = new AbortController();
    setOnlineImage("");

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedPlace.name)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((summary: { thumbnail?: { source?: string } } | null) => {
        setOnlineImage(summary?.thumbnail?.source ?? "");
      })
      .catch(() => {
        if (!controller.signal.aborted) setOnlineImage("");
      });

    return () => controller.abort();
  }, [selectedPlace]);

  const fitAllPlaces = (list: Place[] = placeList) => {
    const map = mapRef.current;
    if (!map || list.length === 0) return;
    map.fitBounds(getBounds(list), {
      padding: { top: 80, right: 80, bottom: 80, left: 80 },
      maxZoom: 5,
      duration: 850,
    });
  };

  const focusPlace = (place: Place) => {
    const map = mapRef.current;
    if (!map) return;
    setSelectedPlace(place);
    setImageFailed(false);
    map.flyTo({
      center: place.coordinates,
      zoom: Math.min(Math.max(map.getZoom() + 1.7, 5.5), 8.5),
      duration: 1000,
      essential: true,
    });
  };

  // Locate User GPS position
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const map = mapRef.current;
        if (!map) return;

        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat([lng, lat]);
        } else {
          const userPin = document.createElement("div");
          userPin.className = "w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-ping";
          const wrapper = document.createElement("div");
          wrapper.className = "relative flex items-center justify-center";
          wrapper.appendChild(userPin);
          const core = document.createElement("div");
          core.className = "absolute w-3 h-3 rounded-full bg-blue-600 border border-white";
          wrapper.appendChild(core);

          userMarkerRef.current = new maplibregl.Marker({ element: wrapper })
            .setLngLat([lng, lat])
            .addTo(map);
        }

        map.flyTo({
          center: [lng, lat],
          zoom: 10,
          duration: 1200,
          essential: true,
        });
      },
      (error) => {
        setIsLocating(false);
        alert(`Unable to retrieve GPS location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Initialize MapLibre
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

    const handleError = (event: maplibregl.ErrorEvent) => {
      if (event.error?.message) setMapError(event.error.message);
    };

    map.on("zoom", () => updateMarkerLabels(map));
    map.on("error", handleError);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Markers when placeList or map changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const syncMarkers = () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      placeList.forEach((place) => {
        if (!place.coordinates || place.coordinates.length !== 2) return;
        const placeId = getPlaceId(place);
        const marker = new maplibregl.Marker({
          element: getMarkerElement(place, selectedPlace ? getPlaceId(selectedPlace) === placeId : false, () => focusPlace(place)),
        })
          .setLngLat(place.coordinates)
          .addTo(map);
        markersRef.current.set(placeId, marker);
      });

      fitAllPlaces(placeList);
      updateMarkerLabels(map);
    };

    if (map.isStyleLoaded()) {
      syncMarkers();
    } else {
      map.once("load", syncMarkers);
    }
  }, [placeList]);

  // Update selected marker CSS
  useEffect(() => {
    const selectedId = selectedPlace ? getPlaceId(selectedPlace) : null;
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle("places-marker-selected", selectedId === id);
    });
  }, [selectedPlace]);

  return (
    <section className="places-page">
      <div className="places-heading">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="places-eyebrow">Personal atlas / {placeList.length} destinations</p>
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
            <button
              type="button"
              aria-label="Locate my position with GPS"
              title="Locate my current position"
              onClick={handleLocateMe}
              className={isLocating ? "animate-pulse" : ""}
            >
              <Navigation size={15} />
            </button>
            <button type="button" aria-label="Zoom in map" onClick={() => mapRef.current?.zoomIn({ duration: 350 })}>
              <Plus size={17} />
            </button>
            <button type="button" aria-label="Zoom out map" onClick={() => mapRef.current?.zoomOut({ duration: 350 })}>
              <Minus size={17} />
            </button>
            <button
              type="button"
              className="places-view-all"
              aria-label="View all places"
              onClick={() => {
                setSelectedPlace(null);
                fitAllPlaces();
              }}
            >
              <LocateFixed size={15} />
              View All
            </button>
          </div>
        )}

        {selectedPlace && (
          <aside className="places-card" aria-label={`${selectedPlace.name} details`}>
            <button
              type="button"
              className="places-card-close"
              aria-label={`Close ${selectedPlace.name} details`}
              onClick={() => setSelectedPlace(null)}
            >
              <X size={16} />
            </button>
            {onlineImage && !imageFailed ? (
              <img
                src={onlineImage}
                alt={`${selectedPlace.name}, ${selectedPlace.city}`}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="places-card-image-fallback" aria-label={`${selectedPlace.name} image placeholder`}>
                {selectedPlace.name}
              </div>
            )}
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
