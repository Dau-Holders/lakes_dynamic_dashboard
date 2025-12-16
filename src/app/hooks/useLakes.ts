import { useState, useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

interface Lake {
  label: string;
  value: string;
}

export default function useLakes() {
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const privateApi = useRefreshToken();

  useEffect(() => {
    const fetchLakes = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all lakes without pagination (page_size=100 should be more than enough)
        const response = await privateApi.get("/lakes/?page_size=100");
        const lakesData = response.data.results.map((lake: any) => ({
          label: lake.name,
          value: lake.name,
        }));
        setLakes(lakesData);
      } catch (err) {
        console.error("Error fetching lakes:", err);
        setError("Failed to load lakes");
      } finally {
        setLoading(false);
      }
    };

    fetchLakes();
  }, []);

  return { lakes, loading, error };
}
