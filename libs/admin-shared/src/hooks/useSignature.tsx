import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useSignature({
  product = 'smartdms',
}: { product?: string } = {}) {
  return useQuery(
    ['signature'],
    async () => {
      const response = await axios.get(`${import.meta.env.VITE_FILE_URL}`, {
        params: {
          product,
        },
      });

      return response.data;
    },
    {
      cacheTime: 0,
    }
  );
}
