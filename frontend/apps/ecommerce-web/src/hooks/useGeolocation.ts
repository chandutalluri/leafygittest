import { useState, useEffect } from 'react';
import axios from 'axios';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    state: null,
    city: null,
    pincode: null,
    address: null,
    loading: true,
    error: null,
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using a free reverse geocoding API (Nominatim)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );

      const data = response.data;
      const address = data.address || {};

      setLocation({
        latitude: lat,
        longitude: lng,
        state: address.state || address.province || address.region || null,
        city: address.city || address.town || address.village || null,
        pincode: address.postcode || null,
        address: data.display_name || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to get address details',
      }));
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
      },
      error => {
        console.error('Geolocation error:', error);
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Unable to get your location',
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const requestLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
      },
      error => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Unable to get your location',
        }));
      }
    );
  };

  return { ...location, requestLocation };
}
