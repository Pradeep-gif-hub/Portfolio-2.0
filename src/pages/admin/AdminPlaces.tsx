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
      setPlaces(Array.isArray(data) ? data : []);
    } catch {
      alert('Failed to load places from server.');
      setPlaces([]);
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

      const marker = new maplibregl.Marker({ color: '#10b981', draggable: true })
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this place?')) return;
    try {
      await placesApi.delete(id);
      alert('Place deleted successfully!');
      fetchPlaces();
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading places...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
                <MapPin className="text-accent-primary" size={28} />
                Places Management
              </h1>
              <p className="text-text-secondary">
                Manage travel destinations, GPS coordinates, and map images
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn-neon flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={20} />
              Add New Place
            </Button>
          </div>

          {/* Search & Filter Controls */}
          <div className="glass-effect p-4 rounded-xl mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                placeholder="Search place, city, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-accent-primary text-white'
                    : 'bg-dark-800 text-text-secondary hover:text-white'
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
                        ? 'bg-accent-primary text-white'
                        : 'bg-dark-800 text-text-secondary hover:text-white'
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
            <div className="glass-effect p-12 rounded-xl text-center">
              <Compass size={64} className="mx-auto mb-4 text-text-secondary" />
              <h3 className="text-xl font-bold mb-2">No Places Found</h3>
              <p className="text-text-secondary mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try clearing your search or filter'
                  : 'Get started by adding your first visited destination with GPS coordinates'}
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="btn-neon"
              >
                Add First Place
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((item) => {
                const placeImg = item.image || item.imageUrl;
                return (
                  <motion.div
                    key={item._id || item.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect rounded-xl overflow-hidden border border-dark-700 hover:border-accent-primary/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image / Fallback */}
                      <div className="relative h-44 bg-dark-800 overflow-hidden">
                        {placeImg ? (
                          <img
                            src={placeImg}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary bg-gradient-to-br from-dark-800 to-dark-900 p-4 text-center">
                            <MapPin size={32} className="text-accent-primary/60 mb-1" />
                            <span className="font-bold text-white text-sm">{item.name}</span>
                            <span className="text-xs text-text-secondary">
                              Auto Wikipedia Image on Public Map
                            </span>
                          </div>
                        )}

                        {item.category && (
                          <span className="absolute top-2 right-2 px-3 py-1 bg-dark-900/80 backdrop-blur-md border border-dark-700 text-accent-primary text-xs font-semibold rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-lg text-white">{item.name}</h3>
                          {item.visitedDate && (
                            <span className="text-xs text-text-secondary flex items-center gap-1 shrink-0">
                              <Calendar size={12} />
                              {item.visitedDate}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-accent-primary font-medium flex items-center gap-1 mb-2">
                          <Globe size={13} />
                          {item.city}, {item.country}
                        </p>

                        {item.description && (
                          <p className="text-text-secondary text-xs line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-text-tertiary bg-dark-800/60 p-2 rounded-lg font-mono">
                          <Navigation size={12} className="text-accent-primary shrink-0" />
                          <span>
                            Lng: {item.coordinates ? item.coordinates[0] : 'N/A'}, Lat:{' '}
                            {item.coordinates ? item.coordinates[1] : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 border-t border-dark-800/60 flex items-center justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-dark-800 hover:bg-accent-primary hover:text-white text-text-secondary rounded-lg transition-colors"
                        title="Edit Place"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => item._id && handleDelete(item._id)}
                        className="p-2 bg-dark-800 hover:bg-red-500 hover:text-white text-text-secondary rounded-lg transition-colors"
                        title="Delete Place"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
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
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                  onClick={handleCloseModal}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                >
                  <div className="glass-effect p-6 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto pointer-events-auto border border-dark-700 shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-700">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <MapPin className="text-accent-primary" size={24} />
                          {editingItem ? 'Edit Place' : 'Add New Place'}
                        </h2>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Set location details, GPS coordinates, and place imagery
                        </p>
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-text-secondary hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* GPS Quick Action Bar */}
                      <div className="p-4 bg-dark-800/80 border border-dark-700 rounded-xl space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
                            <Navigation size={14} />
                            Automatic GPS Location Detection
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleAutoFetchGPS}
                              disabled={gpsFetching}
                              className="px-3 py-1.5 bg-accent-primary hover:bg-accent-primary/80 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
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
                              className="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
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
                          <div className="flex items-center gap-2 text-xs text-text-secondary bg-dark-900/90 p-2.5 rounded-lg border border-dark-700 font-mono">
                            <AlertCircle size={14} className="text-accent-primary shrink-0" />
                            <span>{gpsStatus}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Mini Map in Modal */}
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                          Interactive Map Location Preview (Click map or drag marker to adjust)
                        </label>
                        <div
                          ref={modalMapContainerRef}
                          className="w-full h-48 rounded-xl overflow-hidden border border-dark-700 bg-dark-900 relative"
                        />
                      </div>

                      {/* Basic Details: Name, City, Country */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Place / Landmark Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Eiffel Tower or Manali"
                            className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="e.g., Paris or Kullu"
                            className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Country *</label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="e.g., France or India"
                            className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                            required
                          />
                        </div>
                      </div>

                      {/* Coordinates (Longitude, Latitude) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
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
                            className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
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
                            className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                            required
                          />
                        </div>
                      </div>

                      {/* Category & Visited Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Visited Date / Year</label>
                          <input
                            type="text"
                            value={formData.visitedDate}
                            onChange={(e) =>
                              setFormData({ ...formData, visitedDate: e.target.value })
                            }
                            placeholder="e.g. October 2023 or 2024"
                            className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                          />
                        </div>
                      </div>

                      {/* Image URL & Live Preview */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium">Place Image URL</label>
                          <a
                            href="https://imgbb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent-primary hover:underline flex items-center gap-1"
                          >
                            Upload to ImgBB <ExternalLink size={12} />
                          </a>
                        </div>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/place.jpg (Optional - falls back to Wikipedia automatically)"
                          className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                        />
                        {formData.image && (
                          <div className="mt-3 relative rounded-xl overflow-hidden h-40 border border-dark-700 bg-dark-900">
                            <img
                              src={formData.image}
                              alt="Place Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://placehold.co/600x400/1e293b/white?text=Invalid+Image+URL';
                              }}
                            />
                            <span className="absolute bottom-2 right-2 text-xs bg-dark-950/80 px-2 py-1 rounded text-white backdrop-blur-sm">
                              Image Preview
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={2}
                          placeholder="Brief memory or note about this destination..."
                          className="w-full px-3.5 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-accent-primary"
                        />
                      </div>

                      {/* Submit Actions */}
                      <div className="flex gap-4 pt-4 border-t border-dark-700">
                        <Button
                          type="submit"
                          className="btn-neon flex-1 flex items-center justify-center gap-2"
                        >
                          <Save size={18} />
                          {editingItem ? 'Update Place' : 'Save Place'}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleCloseModal}
                          className="flex-1 bg-dark-700 hover:bg-dark-600"
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
