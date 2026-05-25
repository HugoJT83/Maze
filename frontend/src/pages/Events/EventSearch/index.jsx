import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import Interest from '../../auth/ProfileUser/components/Interest';
import { INTERESTS_CONFIG } from '../../../constant/interestsConfig';
import { axiosClient } from '../../../utils/axiosClient';

// Fix Leaflet marker icons issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MADRID_COORDS = { lat: 40.4168, lng: -3.7038 };
// Bounds para España (Península + Baleares + Canarias)
const SPAIN_BOUNDS = [
  [27.4, -18.4], // Suroeste (Canarias)
  [43.8, 4.4]    // Noreste (Cataluña/Baleares)
];

const EventSearchPage = () => {
  const [searchParams] = useSearchParams();
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(MADRID_COORDS);
  const [events, setEvents] = useState([]);

  // UI States
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  // Filters
  const [radius, setRadius] = useState(50); // 50km default
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  // City/Province Filters
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryid, setCountryid] = useState(null);

  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Items per page in list view

  const [loading, setLoading] = useState(true);

  // Parse URL Params & Setup Location Data
  useEffect(() => {
    let initialProv = '';
    const urlInterests = searchParams.get('interests');
    if (urlInterests) {
      setSelectedInterests(urlInterests.split(','));
    }
    const urlProv = searchParams.get('province');
    if (urlProv) {
      initialProv = urlProv;
      setSelectedProvinceName(urlProv);
    }
    const urlCity = searchParams.get('city');
    if (urlCity) {
      setSelectedCityName(urlCity);
    }

    GetCountries().then((result) => {
      const spain = result.find((item) => item.iso2 === "ES");
      if (spain) {
        setCountryid(spain.id);
        GetState(spain.id).then((res) => {
          setStates(res);
          // If there's an initial province from URL, fetch its cities
          if (initialProv) {
            const foundState = res.find(s => s.name === initialProv);
            if (foundState) {
              GetCity(spain.id, foundState.id).then((citiesRes) => {
                setCities(citiesRes);
              });
            }
          }
        });
      }
    });
  }, [searchParams]);

  const handleStateChange = (e) => {
    const pName = e.target.value;
    if (!pName) {
      setSelectedProvinceName('');
      setCities([]);
      setSelectedCityName('');
    } else {
      setSelectedProvinceName(pName);
      setSelectedCityName(''); // Reset city when province changes
      const foundState = states.find(s => s.name === pName);
      if (foundState && countryid) {
        GetCity(countryid, foundState.id).then((res) => setCities(res));
      }
    }
    setPage(1);
  };

  const handleCityChange = (e) => {
    const cName = e.target.value;
    if (!cName) {
      setSelectedCityName('');
    } else {
      setSelectedCityName(cName);
    }
    setPage(1);
  };

  // Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(coords);
          setMapCenter(coords);
        },
        (error) => {
          console.log("Ubicación denegada o no disponible, usando Madrid por defecto.", error);
          setUserLocation(MADRID_COORDS);
          setMapCenter(MADRID_COORDS);
        }
      );
    } else {
      setUserLocation(MADRID_COORDS);
      setMapCenter(MADRID_COORDS);
    }
  }, []);

  const handleInterestClick = (key) => {
    if (selectedInterests.includes(key)) {
      setSelectedInterests(selectedInterests.filter(i => i !== key));
      setPage(1);
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests([...selectedInterests, key]);
        setPage(1);
      }
    }
  };

  // Fetch events when location or filters change
  useEffect(() => {
    if (!userLocation) return;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
        params.append('radius', radius);
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (selectedProvinceName) params.append('province', selectedProvinceName);
        if (selectedCityName) params.append('city', selectedCityName);
        if (selectedInterests.length > 0) {
          params.append('interests', selectedInterests.join(','));
        }

        const currentLimit = viewMode === 'map' ? 100 : limit;
        params.append('page', page);
        params.append('limit', currentLimit);

        const response = await axiosClient.get(`/events/search?${params.toString()}`);
        setEvents(response.data.events || []);
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userLocation, radius, startDate, endDate, selectedInterests, selectedProvinceName, selectedCityName, page, viewMode, limit]);

  if (!userLocation) {
    return <div className="min-h-screen flex items-center justify-center">Obteniendo ubicación...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white-to-black shadow-lg overflow-y-auto">
        <h2 className="text-2xl text-indigo-to-yellow mb-6 font-Bitcount">Filtros de Búsqueda</h2>

        <div className="mb-6">
          <label className="block font-medium text-indigo-to-yellow mb-2">Ubicación</label>
          <select
            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            onChange={handleStateChange}
            value={selectedProvinceName}
          >
            <option value="">Selecciona una provincia</option>
            {states.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            onChange={handleCityChange}
            disabled={cities.length === 0}
            value={selectedCityName}
          >
            <option value="">Selecciona una ciudad</option>
            {cities.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>

          <div className="mt-4">
            <label className="block font-medium text-indigo-to-yellow mb-2">
              Radio de búsqueda: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="500"
              value={radius}
              onChange={(e) => { setRadius(e.target.value); setPage(1); }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-indigo-to-yellow mb-2">Fecha Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-indigo-to-yellow mb-2">Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium text-indigo-to-yellow mb-2">
            Temáticas (Indica un máximo de 3)
          </label>
          <div className="grid grid-cols-3 gap-4 mt-2 p-5">
            {Object.keys(INTERESTS_CONFIG).map((key) => {
              const interest = INTERESTS_CONFIG[key];
              const isSelected = selectedInterests.includes(key);
              return (
                <Interest
                  key={key}
                  icon={interest.icon}
                  label={interest.label}
                  selectable={true}
                  isSelected={isSelected}
                  onClick={() => handleInterestClick(key)}
                />
              );
            })}
          </div>
        </div>

        {loading && <p className="text-indigo-600 font-semibold">Buscando eventos...</p>}
        {!loading && <p className="text-gray-600 text-center">{events.length} eventos en esta página.</p>}
      </div>

      {/* Main Content Area (Tabs + Map/List) */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col relative z-0 bg-gray-50">

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white-to-black px-4 py-2">
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${viewMode === 'map' ? 'bg-indigo-to-yellow text-white-to-black' : 'text-black-to-white hover:bg-gray-to-yellow/60'}`}
            onClick={() => { setViewMode('map'); setPage(1); }}
          >
            Vista Mapa
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ml-2 ${viewMode === 'list' ? 'bg-indigo-to-yellow text-white-to-black' : 'text-black-to-white hover:bg-gray-to-yellow/60'}`}
            onClick={() => { setViewMode('list'); setPage(1); }}
          >
            Vista Lista
          </button>
        </div>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-hidden relative">

          {viewMode === 'map' && (
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={10}
              minZoom={5}
              maxBounds={SPAIN_BOUNDS}
              maxBoundsViscosity={1.0}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Circle center={[userLocation.lat, userLocation.lng]} radius={radius * 1000} pathOptions={{ fillColor: 'blue', color: 'blue', fillOpacity: 0.1 }} />
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>Tu Ubicación</Popup>
              </Marker>

              {events.map((event) => {
                if (event.location && event.location.coordinates && event.location.coordinates.length === 2) {
                  const [lng, lat] = event.location.coordinates;
                  return (
                    <Marker key={event.id} position={[lat, lng]}>
                      <Popup className="custom-popup">
                        <div className="text-center">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="text-sm text-gray-600 my-1">{event.location.city}, {event.location.province}</p>
                          <div className="mt-2">
                            <Link to={`/my-events/${event.id}`} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">Ver Detalles</Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
          )}

          {viewMode === 'list' && (
            <div className="h-full overflow-y-auto p-6">
              {events.length === 0 && !loading && (
                <div className="text-center mt-10 text-gray-500 text-lg">No se encontraron eventos con estos filtros.</div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow p-5 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        📍 {event.location.city}, {event.location.province}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.interests.map(int => (
                          <span key={int} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                            {INTERESTS_CONFIG[int]?.label || int}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link to={`/my-events/${event.id}`} className="text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                      Ver Detalles
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="font-semibold text-gray-700">Página {page} de {totalPages}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventSearchPage;
