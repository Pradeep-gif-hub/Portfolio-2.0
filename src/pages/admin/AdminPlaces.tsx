import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  MapPin,
  Navigation,
  Search,
  ExternalLink,
  Calendar,
  Globe,
  Compass,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import { type Map as MapLibreMap, type Marker as MapLibreMarker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { places as defaultPlaces, mergePlaces } from '../../data/place/places';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const CATEGORIES = [
  'City',
  'Heritage',
  'Mountains',
  'Coast',
  'Countryside',
  'Desert',
  'International',
  'Nature',
  'Adventure',
];

export interface PlaceItem {
  _id?: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  image?: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  visitedDate?: string;
  order?: number;
}

const placesApi = {
  getAll: async (): Promise<PlaceItem[]> => {
    const token = sessionStorage.getItem('admin_token');
    const response = await fetch('/api/admin/content?type=places', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch places');
    const data = await response.json();
    return data.data;
  },
  create: async (item: Omit<PlaceItem, '_id'>) => {
    const token = sessionStorage.getItem('admin_token');
    const response = await fetch('/api/admin/content?type=places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create place');
    const data = await response.json();
    return data.data;
  },
  update: async (item: PlaceItem) => {
    const token = sessionStorage.getItem('admin_token');
    const response = await fetch('/api/admin/content?type=places', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: item._id, ...item }),
    });
    if (!response.ok) throw new Error('Failed to update place');
    const data = await response.json();
    return data.data;
  },
  delete: async (id: string) => {
    const token = sessionStorage.getItem('admin_token');
    const response = await fetch(`/api/admin/content?type=places&id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete place');
    return response.json();
  },
};

export const AdminPlaces = () => {
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PlaceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [gpsFetching, setGpsFetching] = useState(false);
  const [geoSearching, setGeoSearching] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    city: string;
    country: string;
    latitude: number | string;
    longitude: number | string;
    image: string;
    category: string;
    description: string;
    visitedDate: string;
    order: number;
  }>({
    name: '',
    city: '',
    country: '',
    latitude: 28.6139,
    longitude: 77.209,
    image: '',
    category: 'City',
    description: '',
    visitedDate: '',
    order: 0,
  });

  // Modal map refs
  const modalMapContainerRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<MapLibreMap | null>(null);
  const modalMarkerRef = useRef<MapLibreMarker | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const data = await placesApi.getAll();
      const dbPlaces = Array.isArray(data) ? data : [];
      const merged = mergePlaces(defaultPlaces as any, dbPlaces);
      setPlaces(merged);
    } catch {
      setPlaces(defaultPlaces as any);
    } finally {
      setLoading(false);
    }
  };

  // Initialize interactive map in modal when modal opens
  useEffect(() => {
    if (!showModal) {
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
      }
      modalMarkerRef.current = null;
      return;
    }

    const timer = setTimeout(() => {
      if (!modalMapContainerRef.current) return;

      const lng = Number(formData.longitude) || 77.209;
      const lat = Number(formData.latitude) || 28.6139;

      const map = new maplibregl.Map({
        container: modalMapContainerRef.current,
        style: MAP_STYLE,
        center: [lng, lat],
        zoom: 6,
        attributionControl: false,
      });

      const marker = new maplibregl.Marker({ color: '#1F3A34', draggable: true })
        .setLngLat([lng, lat])
        .addTo(map);

      // On marker drag end, update form
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        setFormData((prev) => ({
          ...prev,
          longitude: Number(lngLat.lng.toFixed(6)),
          latitude: Number(lngLat.lat.toFixed(6)),
        }));
      });

      // On map click, move marker and update form
      map.on('click', (e) => {
        marker.setLngLat(e.lngLat);
        setFormData((prev) => ({
          ...prev,
          longitude: Number(e.lngLat.lng.toFixed(6)),
          latitude: Number(e.lngLat.lat.toFixed(6)),
        }));
      });

      modalMapRef.current = map;
      modalMarkerRef.current = marker;
    }, 150);

    return () => clearTimeout(timer);
  }, [showModal]);

  // Update marker & map center when coordinate inputs change
  const updateMapPosition = (lng: number, lat: number, zoom?: number) => {
    if (modalMarkerRef.current) {
      modalMarkerRef.current.setLngLat([lng, lat]);
    }
    if (modalMapRef.current) {
      modalMapRef.current.flyTo({
        center: [lng, lat],
        zoom: zoom ?? modalMapRef.current.getZoom(),
        duration: 800,
      });
    }
  };

  // Automatic GPS Geolocation handler
  const handleAutoFetchGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsFetching(true);
    setGpsStatus('Requesting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        updateMapPosition(lng, lat, 11);
        setGpsStatus(`GPS detected: ${lat}, ${lng}. Looking up address...`);

        // Reverse geocoding via OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.state_district ||
              address.county ||
              '';
            const country = address.country || '';
            const placeName =
              data.name ||
              address.amenity ||
              address.tourism ||
              address.suburb ||
              city ||
              '';

            setFormData((prev) => ({
              ...prev,
              name: prev.name || placeName,
              city: city || prev.city,
              country: country || prev.country,
            }));

            setGpsStatus(`📍 Located: ${city ? `${city}, ` : ''}${country}`);
          } else {
            setGpsStatus(`📍 Coordinates acquired: ${lat}, ${lng}`);
          }
        } catch {
          setGpsStatus(`📍 Coordinates acquired: ${lat}, ${lng}`);
        } finally {
          setGpsFetching(false);
        }
      },
      (error) => {
        setGpsFetching(false);
        setGpsStatus(`GPS Error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Forward Geocoding Search handler (by location / city name)
  const handleSearchLocation = async () => {
    const query = [formData.name, formData.city, formData.country].filter(Boolean).join(', ');
    if (!query.trim()) {
      alert('Please enter a Place Name, City, or Country to search coordinates.');
      return;
    }

    setGeoSearching(true);
    setGpsStatus(`Searching location "${query}"...`);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (res.ok) {
        const results = await res.json();
        if (results.length > 0) {
          const item = results[0];
          const lat = Number(parseFloat(item.lat).toFixed(6));
          const lng = Number(parseFloat(item.lon).toFixed(6));

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));

          updateMapPosition(lng, lat, 10);
          setGpsStatus(`📍 Found: ${item.display_name.split(',').slice(0, 3).join(', ')}`);
        } else {
          setGpsStatus('No location matches found. Please adjust search terms.');
        }
      }
    } catch {
      setGpsStatus('Error querying geolocation service.');
    } finally {
      setGeoSearching(false);
    }
  };

  const handleEdit = (item: PlaceItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      city: item.city,
      country: item.country,
      longitude: item.coordinates ? item.coordinates[0] : 77.209,
      latitude: item.coordinates ? item.coordinates[1] : 28.6139,
      image: item.image || item.imageUrl || '',
      category: item.category || 'City',
      description: item.description || '',
      visitedDate: item.visitedDate || '',
      order: item.order ?? 0,
    });
    setGpsStatus(null);
    setShowModal(true);
  };

  const handleDelete = async (item: PlaceItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      if (item._id) {
        await placesApi.delete(item._id);
      }
      setPlaces((prev) =>
        prev.filter((p) => (item._id ? p._id !== item._id : p.name !== item.name))
      );
      alert('Place removed successfully!');
    } catch {
      alert('Failed to delete place');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      city: '',
      country: '',
      latitude: 28.6139,
      longitude: 77.209,
      image: '',
      category: 'City',
      description: '',
      visitedDate: '',
      order: 0,
    });
    setGpsStatus(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lat = Number(formData.latitude);
    const lng = Number(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid numerical latitude and longitude.');
      return;
    }

    const payload: Omit<PlaceItem, '_id'> = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      coordinates: [lng, lat],
      image: formData.image.trim() || undefined,
      imageUrl: formData.image.trim() || undefined,
      category: formData.category.trim() || 'City',
      description: formData.description.trim() || undefined,
      visitedDate: formData.visitedDate.trim() || undefined,
      order: Number(formData.order) || 0,
    };

    try {
      if (editingItem?._id) {
        await placesApi.update({ ...payload, _id: editingItem._id });
        alert('Place updated successfully!');
      } else {
        await placesApi.create(payload);
        alert('Place created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchPlaces();
    } catch {
      alert('Failed to save place');
    }
  };

  // Filtered places
  const filteredPlaces = places.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent mx-auto"></div>
            <p className="mt-4 text-theme-muted text-sm">Loading places...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-2 mb-1 flex items-center gap-2">
                <MapPin className="text-theme-accent" size={24} />
                Places Management
              </h1>
              <p className="text-theme-muted text-sm">
                Manage travel destinations, GPS coordinates, and map images
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              variant="primary"
              className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={18} />
              Add New Place
            </Button>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-theme-surface border border-theme-border p-4 rounded-[10px] shadow-card mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="relative w-full md:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
              />
              <input
                type="text"
                placeholder="Search place, city, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text placeholder:text-theme-muted"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-theme-accent text-theme-accent-contrast'
                    : 'bg-theme-subtle border border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                All ({places.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = places.filter(
                  (p) => p.category?.toLowerCase() === cat.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-theme-accent text-theme-accent-contrast'
                        : 'bg-theme-subtle border border-theme-border text-theme-muted hover:text-theme-text'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Places List / Grid */}
          {filteredPlaces.length === 0 ? (
            <div className="bg-theme-surface border border-theme-border p-12 rounded-[10px] shadow-card text-center">
              <Compass size={56} className="mx-auto mb-4 text-theme-muted" />
              <h3 className="heading-3 mb-2">No Places Found</h3>
              <p className="text-theme-muted text-sm mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try clearing your search or filter'
                  : 'Get started by adding your first visited destination with GPS coordinates'}
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                variant="primary"
              >
                Add First Place
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((item) => {
                const placeImg = item.image || item.imageUrl;
                return (
                  <div
                    key={item._id || item.name}
                    className="surface-card overflow-hidden hover:border-theme-accent/70 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      {/* Image / Fallback */}
                      <div className="relative h-44 bg-theme-subtle border-b border-theme-border overflow-hidden">
                        {placeImg ? (
                          <img
                            src={placeImg}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-theme-muted bg-theme-subtle p-4 text-center">
                            <MapPin size={28} className="text-theme-accent mb-1" />
                            <span className="font-semibold text-theme-text text-sm">{item.name}</span>
                            <span className="text-xs text-theme-muted">
                              Auto Wikipedia Image on Public Map
                            </span>
                          </div>
                        )}

                        {item.category && (
                          <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-theme-surface border border-theme-border text-theme-accent text-xs font-medium rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="heading-4">{item.name}</h3>
                          {item.visitedDate && (
                            <span className="text-xs text-theme-muted flex items-center gap-1 shrink-0">
                              <Calendar size={12} />
                              {item.visitedDate}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-theme-accent font-medium flex items-center gap-1 mb-2">
                          <Globe size={13} />
                          {item.city}, {item.country}
                        </p>

                        {item.description && (
                          <p className="text-theme-muted text-xs line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-theme-muted bg-theme-subtle border border-theme-border p-2 rounded-lg font-mono">
                          <Navigation size={12} className="text-theme-accent shrink-0" />
                          <span>
                            Lng: {item.coordinates ? item.coordinates[0] : 'N/A'}, Lat:{' '}
                            {item.coordinates ? item.coordinates[1] : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-3 border-t border-theme-border flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-theme-subtle hover:bg-theme-accent hover:text-theme-accent-contrast text-theme-muted rounded-lg transition-colors"
                        title="Edit Place"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 bg-theme-subtle hover:bg-rose-600 hover:text-white text-theme-muted rounded-lg transition-colors"
                        title="Delete Place"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal for Add / Edit Place */}
          <AnimatePresence>
            {showModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-50"
                  onClick={handleCloseModal}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                >
                  <div className="bg-theme-surface p-6 rounded-[10px] max-w-3xl w-full max-h-[92vh] overflow-y-auto pointer-events-auto border border-theme-border shadow-card">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-theme-border">
                      <div>
                        <h2 className="heading-3 flex items-center gap-2">
                          <MapPin className="text-theme-accent" size={20} />
                          {editingItem ? 'Edit Place' : 'Add New Place'}
                        </h2>
                        <p className="text-xs text-theme-muted mt-0.5">
                          Set location details, GPS coordinates, and place imagery
                        </p>
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-muted hover:text-theme-text"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* GPS Quick Action Bar */}
                      <div className="p-4 bg-theme-subtle border border-theme-border rounded-[10px] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
                            <Navigation size={14} />
                            Automatic GPS Location Detection
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleAutoFetchGPS}
                              disabled={gpsFetching}
                              className="px-3 py-1.5 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-contrast text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              {gpsFetching ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Navigation size={13} />
                              )}
                              Auto-Fetch GPS Location
                            </button>
                            <button
                              type="button"
                              onClick={handleSearchLocation}
                              disabled={geoSearching}
                              className="px-3 py-1.5 bg-theme-surface border border-theme-border hover:border-theme-muted text-theme-text text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              {geoSearching ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Search size={13} />
                              )}
                              Lookup Address
                            </button>
                          </div>
                        </div>

                        {gpsStatus && (
                          <div className="flex items-center gap-2 text-xs text-theme-muted bg-theme-surface p-2.5 rounded-lg border border-theme-border font-mono">
                            <AlertCircle size={14} className="text-theme-accent shrink-0" />
                            <span>{gpsStatus}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Mini Map in Modal */}
                      <div>
                        <label className="block text-xs font-medium text-theme-muted mb-1.5">
                          Interactive Map Location Preview (Click map or drag marker to adjust)
                        </label>
                        <div
                          ref={modalMapContainerRef}
                          className="w-full h-48 rounded-[10px] overflow-hidden border border-theme-border bg-theme-subtle relative"
                        />
                      </div>

                      {/* Basic Details: Name, City, Country */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-theme-text">Place / Landmark Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Eiffel Tower or Manali"
                            className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-theme-text">City *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="e.g., Paris or Kullu"
                            className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-theme-text">Country *</label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="e.g., France or India"
                            className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                            required
                          />
                        </div>
                      </div>

                      {/* Coordinates (Longitude, Latitude) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-theme-text">
                            Latitude (e.g. 28.6139) *
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => {
                              const lat = e.target.value;
                              setFormData({ ...formData, latitude: lat });
                              const numLat = Number(lat);
                              const numLng = Number(formData.longitude);
                              if (!isNaN(numLat) && !isNaN(numLng)) {
                                updateMapPosition(numLng, numLat);
                              }
                            }}
                            className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-theme-text">
                            Longitude (e.g. 77.2090) *
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => {
                              const lng = e.target.value;
                              setFormData({ ...formData, longitude: lng });
                              const numLng = Number(lng);
                              const numLat = Number(formData.latitude);
                              if (!isNaN(numLat) && !isNaN(numLng)) {
                                updateMapPosition(numLng, numLat);
                              }
                            }}
                            className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                            required
                          />
                        </div>
                      </div>

                      {/* Category & Visited Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-theme-text">Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-theme-text">Visited Date / Year</label>
                          <input
                            type="text"
                            value={formData.visitedDate}
                            onChange={(e) =>
                              setFormData({ ...formData, visitedDate: e.target.value })
                            }
                            placeholder="e.g. October 2023 or 2024"
                            className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                          />
                        </div>
                      </div>

                      {/* Image URL & Live Preview */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-theme-text">Place Image URL</label>
                          <a
                            href="https://imgbb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-theme-accent hover:underline flex items-center gap-1"
                          >
                            Upload to ImgBB <ExternalLink size={12} />
                          </a>
                        </div>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/place.jpg (Optional - falls back to Wikipedia automatically)"
                          className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                        />
                        {formData.image && (
                          <div className="mt-3 relative rounded-[10px] overflow-hidden h-40 border border-theme-border bg-theme-subtle">
                            <img
                              src={formData.image}
                              alt="Place Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://placehold.co/600x400/161918/white?text=Invalid+Image+URL';
                              }}
                            />
                            <span className="absolute bottom-2 right-2 text-xs bg-theme-surface border border-theme-border px-2 py-1 rounded text-theme-text">
                              Image Preview
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium mb-1 text-theme-text">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={2}
                          placeholder="Brief memory or note about this destination..."
                          className="w-full px-3.5 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg text-sm focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                        />
                      </div>

                      {/* Submit Actions */}
                      <div className="flex gap-3 pt-4 border-t border-theme-border">
                        <Button
                          type="submit"
                          variant="primary"
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <Save size={18} />
                          {editingItem ? 'Update Place' : 'Save Place'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleCloseModal}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
