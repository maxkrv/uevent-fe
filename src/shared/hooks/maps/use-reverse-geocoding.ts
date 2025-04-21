import { useMutation } from '@tanstack/react-query';

import { Coordinates, LocationDto } from '@/shared/types/maps';

export const useReverseGeocoding = (onSuccess?: (address: LocationDto) => void) => {
  const mutation = useMutation<LocationDto, Error, Coordinates>({
    mutationFn: ({ lat, lng }) =>
      new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status !== google.maps.GeocoderStatus.OK || !results || results.length === 0) {
            return reject(new Error('Reverse geocoding failed'));
          }

          resolve({
            address: results[0].formatted_address,
            lat,
            lng
          });
        });
      }),
    onSuccess
  });

  return mutation;
};
