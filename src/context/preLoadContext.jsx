import React, { createContext, useState, useEffect } from 'react';
import { fetchData } from '../utils/apiUtils'; // Import de ta fonction fetchData

// Création du contexte
export const PreloadedDataContext = createContext();

export const PreloadedDataProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // État pour stocker les données préchargées
  const [preloadedData, setPreloadedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Définition des paramètres SQL dynamiques
  const table = "df_offices_taxes"; // Table à utiliser
  const column1 = "TotalPaidValue"; // Première colonne obligatoire
  const column2 = "TotalAssessedValue"; // Seconde colonne optionnelle (null si non utilisée)
  const period = "Period"; // Nom du champ période (ex: Year, Month, Week...)
  const periodFormat = "%Y"; // Format de la période (ex: %Y, %Y-%m, %Y-%W...)

  const getSqlQuery =(fld) => {
    return  `
    SELECT 
      STRFTIME('${fld.periodFormat}', CAST(Date AS DATE)) AS ${fld.period},
      SUM(${fld.column1}) AS ${fld.column1}
      ${column2 ? `, SUM(${column2}) AS ${column2}` : ''} 
    FROM ${table}
    GROUP BY ${fld.period}
    ORDER BY ${fld.period}
  `

  }

  // Liste des requêtes SQL à précharger
  const queries = {
    totPerYear: getSqlQuery({table : 'df_offices_taxes', 
                        column1 : 'TotalPaidValue',
                        column2 : 'TotalAssessedValue',
                        period : 'Year',
                        periodFormat :'%Y' }),
    totPerMonth: getSqlQuery({table : 'df_offices_taxes', 
                        column1 : 'TotalPaidValue',
                        column2 : 'TotalAssessedValue',
                        period : 'Month',
                        periodFormat :'%Y-%m' }),
    totPerWeek: getSqlQuery({table : 'df_offices_taxes', 
                        column1 : 'TotalPaidValue',
                        column2 : 'TotalAssessedValue',
                        period : 'Week',
                        periodFormat :'%Y-%W' }),
    totPerDay: getSqlQuery({table : 'df_offices_taxes', 
                        column1 : 'TotalPaidValue',
                        column2 : 'TotalAssessedValue',
                        period : 'Day',
                        periodFormat :'%Y-%m-%d'}),
    burByName:  `SELECT DISTINCT CodeOffice, OfficeName, FROM df_offices_taxes`,
    taxByName:  `SELECT DISTINCT CodeTaxe, TaxeDescription, FROM df_taxes WHERE TaxeDescription IS NOT NULL`,
    
  };

  // Fonction pour charger toutes les requêtes en parallèle
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
//         let results = {};

//         // Parcourt chaque requête SQL et exécute fetchData()
//         await Promise.all(
//           Object.entries(queries).map(async ([key, sql]) => {
//             results[key] = await fetchData(BASE_URL, "query", { sql });
//           })
//         );

//         setPreloadedData(results);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

  // Fonction pour charger toutes les requêtes séquenciellement
   useEffect(() => {
    const fetchSequentially = async () => {
      try {
        setLoading(true);
        let results = {};

        // EXÉCUTE LES REQUÊTES EN SÉQUENTIEL (évite les blocages)
        for (const [key, sql] of Object.entries(queries)) {
          results[key] = await fetchData(BASE_URL, "query", { sql });
        }

        setPreloadedData(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSequentially();
  }, []);

  return (
    <PreloadedDataContext.Provider value={{ preloadedData, loading, error }}>
      {children}
    </PreloadedDataContext.Provider>
  );
};
