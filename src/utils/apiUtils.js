// utils/apiUtils.js

export function buildUrl(baseUrl, query, params = {}) {
    const url = new URL(`${baseUrl}/${query}`);
    
    // Ajouter les paramètres dynamiques à l'URL
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]); // NE PAS réencoder ici !
    });
  
    return url.toString();
  }
  
  export async function fetchData(baseUrl, query, params = {}) {
    try {
      const url = buildUrl(baseUrl, query, params);
      console.log("URL is :", url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      throw error;
    }
  }
  