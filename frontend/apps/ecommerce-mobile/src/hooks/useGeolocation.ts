import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
  error: string | null;
  loading: boolean;
  // Additional location details
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    timestamp: null,
    error: null,
    loading: false,
    city: null,
    state: null,
    country: null,
    pincode: null,
  });

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
    watchPosition = false,
  } = options;

  // Reverse geocoding to get address details
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      if (!response.ok) throw new Error('Failed to reverse geocode');

      const data = await response.json();
      const address = data.address || {};

      setState(prev => ({
        ...prev,
        city: address.city || address.town || address.village || null,
        state: address.state || null,
        country: address.country || null,
        pincode: address.postcode || null,
      }));
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleSuccess = async (position: GeolocationPosition) => {
    const coords = position.coords;

    setState(prev => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      altitude: coords.altitude,
      altitudeAccuracy: coords.altitudeAccuracy,
      heading: coords.heading,
      speed: coords.speed,
      timestamp: position.timestamp,
      error: null,
      loading: false,
    }));

    // Perform reverse geocoding
    await reverseGeocode(coords.latitude, coords.longitude);
  };

  const handleError = (error: GeolocationPositionError) => {
    let errorMessage = '';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          'Location permission denied. Please enable location access in your browser settings.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable. Please check your device settings.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Please try again.';
        break;
      default:
        errorMessage = 'An unknown error occurred while getting your location.';
    }

    setState(prev => ({
      ...prev,
      error: errorMessage,
      loading: false,
    }));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    if (watchPosition) {
      const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions);

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions);
    }
  };

  useEffect(() => {
    // Auto-request location on mount
    requestLocation();
  }, []);

  return {
    ...state,
    requestLocation,
    isSupported: typeof window !== 'undefined' && !!navigator.geolocation,
  };
}
