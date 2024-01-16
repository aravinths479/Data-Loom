import { useState, useEffect } from 'react';

const useFetch = (url, token) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Could not fetch the data for that resource');
      }

      const fetchedData = await res.json();
      setData(fetchedData);
      setError(null);
      setIsPending(false);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        setIsPending(false);
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    const abortCont = new AbortController();
    
    fetchData();

    return () => abortCont.abort();
  }, [url, token]);

  const refetch = () => {
    setIsPending(true);
    fetchData();
  };

  return { data, isPending, error, refetch };
};

export default useFetch;
