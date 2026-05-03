import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useGeolocation = () => {
  const [locationData, setLocationData] = useState(null);
  const [errorInfo, setErrorInfo] = useState('');

  useEffect(() => {
    let mounted = true;

    const askPermissionAndFetch = async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        
        if (!granted) {
          if (mounted) setErrorInfo('É necessário aceitar a permissão de GPS.');
          return;
        }

        const currentPos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (mounted) {
          setLocationData({
            lat: currentPos.coords.latitude,
            lng: currentPos.coords.longitude,
          });
        }
      } catch (e) {
        if (mounted) setErrorInfo('Não foi possível obter a localização do dispositivo.');
      }
    };

    askPermissionAndFetch();

    return () => {
      mounted = false;
    };
  }, []);

  return { locationData, errorInfo };
};
