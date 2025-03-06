import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart'
import PieChartOffice from './charts/PieChartOffice'
import PaymentTableCard from './charts/PaymentTableCard'
import EvolutionAreaChart from './charts/EvolutionAreaChart'
import KPI from './KPI'
import CustomDatePicker from './CustomDatePicker'
import DataComponentApi from './DataComponentApi'
import NotificationPopup from './NotificationPopup'
import { usePeriod } from '../context/PeriodContext'

const generateData = (period, bureauFilter = null, taxeFilter = null) => {
  const bureaux = ['Bureau A', 'Bureau B', 'Bureau C', 'Bureau D']
  const taxes = ['Taxe Import', 'Taxe Export', 'Taxe Transit', 'Droit Douane']

  const generateItem = (i) => {
      const bureau = bureaux[Math.floor(Math.random() * bureaux.length)]
      const taxe = taxes[Math.floor(Math.random() * taxes.length)]

      if ((bureauFilter && bureau !== bureauFilter) || (taxeFilter && taxe !== taxeFilter)) {
          return null
      }

      return {
          name: i,
          value: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
          bureau,
          taxe
      }
  }

  switch (period) {
      case 'Jour':
          return Array.from({ length: 24 }, (_, i) => generateItem(i)).filter(Boolean)
      case 'Sem':
          return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => generateItem(day, i)).filter(Boolean)
      case 'Mois':
          return Array.from({ length: 30 }, (_, i) => generateItem(i + 1)).filter(Boolean)
      case 'Année':
          return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].map((month, i) => generateItem(month, i)).filter(Boolean)
      default:
          return []
  }
}

const generateYearData = () => {
  const startDate = new Date('2023-12-01')
  const endDate = new Date('2024-12-01')
  const data = []

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    data.push({
      date: new Date(d).toISOString().split('T')[0],
      prevues: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      effectives: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000
    })
  }

  return data
}

const allData = generateYearData()

export default function Dashboard({ filters, setFilters }) {
  const [activeKPI, setActiveKPI] = useState(null)
  const [startDate, setStartDate] = useState('2023-12-01')
  const [endDate, setEndDate] = useState('2024-01-01')
  const [notification, setNotification] = useState(null)
  const [lineChartPeriod, setLineChartPeriod] = useState('Sem')
  const [lineChartData, setLineChartData] = useState(generateData('Sem'))


  const handleDateChange = (type, date) => {
    const newStart = type === 'start' ? date : startDate
    const newEnd = type === 'end' ? date : endDate

    // Vérification des limites
    const minDate = new Date('2023-12-01')
    const maxDate = new Date('2024-12-01')

    if (new Date(newStart) < minDate || new Date(newEnd) > maxDate) {
      setNotification({
        type: 'error',
        message: 'La période doit être comprise entre 01/12/2023 et 01/12/2024'
      })
      return
    }

    if (new Date(newStart) > new Date(newEnd)) {
      setNotification({
        type: 'error',
        message: 'La date de début ne peut pas être postérieure à la date de fin'
      })
      return
    }

    if (type === 'start') {
      setStartDate(date)
    } else {
      setEndDate(date)
    }
  }

  // Filtrage des données selon la période sélectionnée
  const filteredData = allData.filter(d => {
    const currentDate = new Date(d.date)
    return currentDate >= new Date(startDate) && currentDate <= new Date(endDate)
  })

  // Calcul du nombre de jours sélectionnés
  const daysDifference = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))

  // Configuration de l'axe X en fonction du nombre de jours
  const xAxisConfig = {
    interval: Math.max(0, Math.floor(daysDifference / 10)),
    angle: daysDifference > 50 ? -45 : 0,
    fontSize: daysDifference > 50 ? 10 : 12,
    tickFormatter: (date) => {
      const d = new Date(date)
      return daysDifference > 50 ?
        `${d.getDate()}/${d.getMonth() + 1}` :
        d.toLocaleDateString('fr-FR')
    }
  }

  const renderVariationBadge = (value, trend) => {
    const isPositive = trend === 'up'
    const arrowClass = isPositive
      ? 'fas fa-arrow-up rotate-45'
      : 'fas fa-arrow-down rotate-[-35deg]'

    return (
      <div className={`
        px-2 py-1 rounded-full
        border ${isPositive
          ? 'border-green-500/50'
          : 'border-red-500/50'
        }
        bg-${isPositive
          ? 'green-500/10'
          : 'red-500/10'
        }
        backdrop-blur-sm
        shadow-sm
        flex items-center gap-1
        text-xs font-medium
        ${isPositive
          ? 'text-green-500'
          : 'text-red-500'
        }
      `}>
        <span>{value}%</span>
        <i className={`${arrowClass} text-[0.6rem]`} />
      </div>
    )
  }

  const handleLineChartPeriodChange = (newPeriod) => {
    if (newPeriod !== lineChartPeriod) {
        setLineChartPeriod(newPeriod)
        setLineChartData(generateData(newPeriod))
    }
  }

  // Définition des paramètres SQL dynamiques
  const table = "df_offices_taxes"; // Table à utiliser
  const column1 = "TotalPaidValue"; // Première colonne obligatoire
  const column2 = "TotalAssessedValue"; // Seconde colonne optionnelle (null si non utilisée)
  const period = "Period"; // Nom du champ période (ex: Year, Month, Week...)
  const periodFormat = "%Y"; // Format de la période (ex: %Y, %Y-%m, %Y-%W...)

  // Construction de la requête SQL dynamique
  const sqlQuery = `
    SELECT 
      STRFTIME('${periodFormat}', CAST(Date AS DATE)) AS ${period},
      SUM(${column1}) AS ${column1}
      ${column2 ? `, SUM(${column2}) AS ${column2}` : ''} 
    FROM ${table}
    GROUP BY ${period}
    ORDER BY ${period}
  `;


  return (
    <main className="p-6">
      {notification && (
        <NotificationPopup
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 relative" style={{ gridAutoRows: '1fr' }}>
        <KPI
          title="Paiements"
          value="12.52B"
          isActive={activeKPI === 'Paiements'}
          onClick={() => setActiveKPI(activeKPI === 'Paiements' ? null : 'Paiements')}
          style={{ gridRow: 'span 2' }}
        />
        <KPI
          title="Bureaux"
          value="1.2K"
          isActive={activeKPI === 'Bureaux'}
          onClick={() => setActiveKPI(activeKPI === 'Bureaux' ? null : 'Bureaux')}
          style={{ gridRow: 'span 2' }}
        />
        <KPI
          title="Recettes Prévues"
          value="8.2M"
          isActive={activeKPI === 'Recettes Prévues'}
          onClick={() => setActiveKPI(activeKPI === 'Recettes Prévues' ? null : 'Recettes Prévues')}
          style={{ gridRow: 'span 2' }}
        />
        <KPI
          title="Recettes Totales"
          value="20.7M"
          isActive={activeKPI === 'Recettes Totales'}
          onClick={() => setActiveKPI(activeKPI === 'Recettes Totales' ? null : 'Recettes Totales')}
          style={{ gridRow: 'span 2' }}
        />
      </div>
      
      {/* Evolution card */}
      <div className="flex gap-5 mb-6">
        <div className="w-[60%] bg-white dark:bg-card p-4 rounded-lg shadow border border-[#343b4f] relative">
          <div className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(circle at 17% -25%, #00c2ff 0%, #00c2ff 10%, transparent 30%)`,
              mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
              WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px'
            }}>
            <div className="bg-white dark:bg-card w-full h-full rounded-lg" />
          </div>

          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <i className="fas fa-chart-area text-lg text-gray-300 dark:text-card-text" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-card-text">
                  Recettes Douanières
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  20.7M
                </p>
                {renderVariationBadge(4.2, 'up')}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-card-text">Du :</span>
                <CustomDatePicker
                  value={startDate}
                  onChange={(date) => handleDateChange('start', date)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-card-text">Au :</span>
                <CustomDatePicker
                  value={endDate}
                  onChange={(date) => handleDateChange('end', date)}
                />
              </div>
            </div>
          </div>
          {/* Evolution Chart assesed / effective */}
          <div className="h-96">
            <EvolutionAreaChart
              data={filteredData}
              xAxisConfig={xAxisConfig}
            />
          </div>

           {/* LineChart pour la tendance hebdomadaire */}
           <div className="relative mt-20">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-chart-line text-sm text-gray-300 dark:text-card-text" />
                            <h3 className="text-xs font-medium text-gray-500 dark:text-card-text">
                                Paiements
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                15.3M
                            </p>
                            {renderVariationBadge(2.1, 'up')}
                        </div>
                    </div>
                    <div className="bg-brand-800/50 backdrop-blur-sm p-2 rounded-lg border border-[#cb3cff]/50">
                        <div className="flex gap-1">
                            {['Sem', 'Mois', 'Année'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => handleLineChartPeriodChange(p)}
                                    className={`
                                        relative
                                        px-2 py-1 rounded-md
                                        text-[12px] font-medium
                                        transition-colors duration-100
                                        ${lineChartPeriod === p
                                                                ? 'bg-[#cb3cff]/10 text-[#cb3cff]'
                                                                : 'text-card-text'
                                                            }
                                        after:absolute
                                        after:inset-0
                                        after:rounded-md
                                        after:border
                                        after:border-transparent
                                        focus:after:border-[#cb3cff]/50
                                        hover:after:border-[#cb3cff]/50
                                        after:pointer-events-none
                                        hover:text-[#cb3cff]
                                      `}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <LineChart data={lineChartData} />
            </div>
        </div>

        <div className="w-[40%]">
          <BarChart filters={filters} setFilters={setFilters} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <PieChartOffice filters={filters} setFilters={setFilters} />
        <PaymentTableCard />
      </div>

      {/* <div>
      <h1>Affichage des résultats SQL</h1>
      <DataComponentApi query="query" params={{ sql: sqlQuery }} />
    </div> */}

    </main>
  )
}
