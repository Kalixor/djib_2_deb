import { useState, useMemo } from 'react'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
// import 'primereact/resources/themes/saga-blue/theme.css';  // Thème
import 'primereact/resources/themes/md-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';          // Styles de base
import 'primeicons/primeicons.css';
import '../tabs_styles.css';

export default function TableauTabs() {
  const [activeTab, setActiveTab] = useState('tableau1')

  

  // Données initiales
  const [products] = useState([
    { date: '2024-01', bureau: 'Bureau A', montant: 12000, statut: 'Payé' },
    { date: '2024-01', bureau: 'Bureau B', montant: 8000, statut: 'En attente' },
    { date: '2024-01', bureau: 'Bureau C', montant: 15000, statut: 'Payé' },
    { date: '2024-02', bureau: 'Bureau A', montant: 9000, statut: 'Annulé' },
    { date: '2024-02', bureau: 'Bureau B', montant: 11000, statut: 'Payé' },
    { date: '2024-03', bureau: 'Bureau C', montant: 7500, statut: 'Annulé' },
    { date: '2024-03', bureau: 'Bureau A', montant: 105, statut: 'Payé' },
    { date: '2024-02', bureau: 'Bureau B', montant: 15000, statut: 'Annulé' },
    { date: '2024-03', bureau: 'Bureau C', montant: 683965, statut: 'En attente' },
    { date: '2024-04', bureau: 'Bureau B', montant: 45225, statut: 'Payé' },
  ]);

   // Définition du groupe de colonnes pour l'en-tête
   const headerGroup = (
    <ColumnGroup>
      <Row >
        <Column header="" colSpan={1} />
        <Column header="Bureaux État" colSpan={2} alignHeader="center"  />
        <Column header="Montant" colSpan={1} />
      </Row>
      <Row frozen>
        <Column header="Date" />
        <Column header="Bureau" />
        <Column header="Statut" />
        <Column header="Montant" />
      </Row>
    </ColumnGroup>
  );

  // État pour les filtres
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    bureau: { value: null, matchMode: FilterMatchMode.CONTAINS },
    statut: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  // const formattedData = rawData.map(item => ({
  //   ...item,
  //   date: new Date(`${item.date}-01`), // Conversion en objet Date
  // }));
  
  // setProducts(formattedData);

  // Fonction pour formater le mois en 'MMMM yyyy'
  const formatMonth = (date) => {
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  // Modèle pour les sous-en-têtes avec une classe CSS spécifique
  const rowGroupHeaderTemplate = (data) => (
    <tr className="custom-subheader">
      <td colSpan="4">{data.date}</td>
    </tr>
  );

  // Modèle pour les sous-en-têtes avec une classe CSS spécifique
  // Function to calculate the total amount for a group
  const calculateGroupTotal = (group) => {
    return group.reduce((acc, item) => acc + item.montant, 0);
  };

  // Template for the group footer
  // const rowGroupFooterTemplate = (data, options) => {

  //   console.log('options is : ', options)

  //   const groupTotal = calculateGroupTotal(options.rows);
  //   return (
  //     <tr className="custom-group-footer">
  //       <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>
  //         Total for {formatMonth(data.date)}:
  //       </td>
  //       <td style={{ fontWeight: 'bold' }}>{groupTotal.toLocaleString()} Fdj</td>
  //       <td></td>
  //     </tr>
  //   );
  // };

  const renderTable1 = () => (
    <div>
      <h2 className="text-xl text-center font-bold text-white mb-4 p-6">Tableau des Stocks</h2>
      <div className="mt-4 bg-white dark:bg-card p-4 rounded-lg shadow border border-[#343b4f]">
        <div className="card">
          <DataTable
            value={products}
            // rowGroupMode="subheader"
            // groupRowsBy="date"
            // sortMode="single"
            // sortField="date"
            // sortOrder={1}
            // rowGroupHeaderTemplate={rowGroupHeaderTemplate}
            // rowGroupFooterTemplate={rowGroupFooterTemplate}
            headerColumnGroup={headerGroup}
            scrollable
            // showGridlines
            scrollHeight="500px"
            // style={{ width: '800px' }}
            className="custom-datatable"
          >
            <Column field="date" header="Date" frozen style={{ width: '150px' }} />
            <Column field="bureau" header="Bureau" style={{ width: '150px' }} />
            <Column field="statut" header="Statut" style={{ width: '150px' }} />
            <Column field="montant" header="Montant" style={{ width: '150px' }} />
            
          </DataTable>
        </div>
      </div>
    </div>
  )

  const renderTable2 = () => (
    <div>
      <h2 className="text-xl text-center font-bold text-white mb-4 p-6">Tableau des Stocks</h2>
      <div className="mt-4 bg-white dark:bg-card p-4 rounded-lg shadow border border-[#343b4f]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-card-text">
            <thead className="bg-brand-800/90">
              <tr>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">ID</th>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Type</th>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Quantité</th>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Valeur</th>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Destination</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#343b4f] hover:bg-[#ce68fd]/10">
                <td colSpan={5} className="px-4 py-3 text-center text-gray-400 dark:text-card-text">
                  Aucune donnée disponible
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderTable3 = () => (
    <div>
      <h2 className="text-xl text-center font-bold text-white mb-4 p-6">Tableau des Opérations</h2>
      <div className="mt-4 bg-white dark:bg-card p-4 rounded-lg shadow border border-[#343b4f]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-card-text">
            <thead className="bg-brand-800/90">
              <tr>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Opération</th>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Heure</th>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Utilisateur</th>
                <th scope="col" className="px-4 py-2 text-[#00c2ff]">Détails</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#343b4f] hover:bg-[#ce68fd]/10">
                <td colSpan={4} className="px-4 py-3 text-center text-gray-400 dark:text-card-text">
                  Aucune donnée disponible
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-brand-800/50 backdrop-blur-sm p-2 rounded-lg border border-[#cb3cff]/50 mt-2">
      <div className="flex gap-1">
        {['Tableau 1', 'Tableau 2', 'Tableau 3'].map((tab, index) => (
          <button
            key={tab}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium
              transition-colors duration-100
              ${activeTab === `tableau${index + 1}`
                ? 'bg-[#cb3cff]/10 text-[#cb3cff]'
                : 'text-card-text hover:bg-brand-700/50'
              }
            `}
            onClick={() => setActiveTab(`tableau${index + 1}`)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'tableau1' && renderTable1()}
      {activeTab === 'tableau2' && renderTable2()}
      {activeTab === 'tableau3' && renderTable3()}
    </div>
  )
}
