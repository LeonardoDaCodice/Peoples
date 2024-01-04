// utils/LocationUtils.js

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  
  export const LocationUtils = {
    calcolaDistanzaTraCoordinate: (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
  
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
  
      return distance;
    },
  
    calculateMapSize: (latitude, longitude, distanza) => {
      const aspectRatio = 1;
      const radiusInDegrees = distanza / 111.32;
      const latitudeDelta = radiusInDegrees * aspectRatio;
      const longitudeDelta = radiusInDegrees;
  
      return {
        latitudeDelta,
        longitudeDelta,
      };
    },
  
    filterPeopleByDistance: (allUsersData, currentLocation, distanza) => {
        try {
          const peopleFiltrati = allUsersData.filter((user) => {
            if (currentLocation && currentLocation.coords && user.latitude && user.longitude) {
              const distanzaTraPersonEPosizione = LocationUtils.calcolaDistanzaTraCoordinate(
                currentLocation.coords.latitude,
                currentLocation.coords.longitude,
                user.latitude,
                user.longitude
              );
      
              return distanzaTraPersonEPosizione <= distanza;
            }
            return false;
          });
      
          return peopleFiltrati;
        } catch (error) {
          console.error('Errore durante il filtraggio delle persone:', error);
          return [];
        }
      },
      
  };
  