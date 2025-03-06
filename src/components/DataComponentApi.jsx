import React, { useEffect, useState, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function DataComponentApi({ query, params = {} }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Génère l'URL avec les paramètres dynamiques et encode l'URL
  const buildUrl = useCallback(() => {
    const url = new URL(`${BASE_URL}/${query}`);
    // Object.keys(params).forEach(key => url.searchParams.append(key, encodeURIComponent(params[key])));
    // Éviter le double encodage
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]); // NE PAS réencoder ici !
    });
    console.log('URL is : ', url.toString())

    return url.toString();
  }, [query, params]);

  // Fetch des données dynamiques en fonction des props
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(buildUrl());
      if (!response.ok) throw new Error("Erreur lors du chargement des données");

      const result = await response.json();
      setData(result.data || result); // Gère les APIs qui renvoient `{ data: [...] }`
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h2>Résultats pour "{query}"</h2>

      {/* Affichage du chargement */}
      {loading && <p>Chargement...</p>}

      {/* Affichage des erreurs */}
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}

      {/* Affichage des données */}
      {!loading && !error && (
        <ul>
          {data.length > 0 ? (
            data.map((item, index) => <li key={item.id || index}>{item.name || JSON.stringify(item)}</li>)
          ) : (
            <p>Aucune donnée trouvée</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default DataComponentApi;
