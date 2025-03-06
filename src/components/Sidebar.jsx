export default function Sidebar({ filters, setFilters }) {
      return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Filtres
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Période
              </label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="day">Jour</option>
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
              </select>
            </div>

            {/* Ajouter d'autres filtres ici */}
          </div>
        </aside>
      )
    }
