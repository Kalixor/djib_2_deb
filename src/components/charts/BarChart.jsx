import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import CustomMultiSelect from '../CustomMultiSelect'
import SelectionDisplay from '../SelectionDisplay'


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-800/95 backdrop-blur-sm p-3 rounded-lg border border-[#cb3cff]/50 shadow-lg">
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-card-text mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-medium">
                            {payload[0].value}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

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

export default function BarChart() {
    const [period, setPeriod] = useState('Mois')
    const [bureauFilter, setBureauFilter] = useState(null)
    const [taxeFilter, setTaxeFilter] = useState(null)
    const [data, setData] = useState(generateData('Mois'))

    const [displayValue, setDisplayValue] = useState('0')
    const [variationValue, setVariationValue] = useState(0)
    const [variationAmount, setVariationAmount] = useState(0)
    const targetValue = useRef(0)
    const animationRef = useRef(null)
    const startTimeRef = useRef(null)

    const [bureauOptions, setBureauOptions] = useState([]);
    const [bureauLabel, setbureauLabel] = useState("Tous les Bureaux");
    const [selectedTaxOptions, setSelectedTaxOptions] = useState([]);
    const [taxLabel, setTaxLabel] = useState("Toutes Taxes");
    // const { period, togglePeriod } = usePeriod()

    const defaultTaxes = useMemo(() =>Array.from({ length: 100 }, (_, i) => ({
        value: `TAX_${i + 1}`,
        label: `Taxe ${i + 1}`,
        }))
        , [])
        
    const defaultBureaux = useMemo(() =>Array.from({ length: 17 }, (_, i) => ({
        value: `BUR_${i + 1}`,
        label: `Bureau ${i + 1}`,
        }))
        , [])

    const handlePeriodChange = (newPeriod) => {
        if (newPeriod !== period) {
            setPeriod(newPeriod)
            setData(generateData(newPeriod, bureauFilter?.value, taxeFilter?.value))
        }
    }

    const handleBureauChange = (selectedOption) => {
        setBureauFilter(selectedOption)
        setData(generateData(period, selectedOption?.value, taxeFilter?.value))
    }

    const getBarChartData = useCallback(() => {
        const baseValues = {
          'totaux': { value: 12520000000, suffix: '', trend: 'up' },
          
        }
    
        const periodFactors = {
          'Journalières': 1,
          'Hebdomadaires': 7,
          'Mensuelles': 30,
          'Annuelles': 365
        }
    
        const factor = periodFactors[period] || 1
        const variation = Math.random() * 0.05
        const baseValue = baseValues['totaux'].value * factor
        const variationAmount = baseValue * variation
    
        return {
          ...baseValues['totaux'],
          value: Math.round(baseValue * (1 + variation)),
          variationAmount: Math.round(variationAmount)
        }
      }, [period, bureauOptions, selectedTaxOptions])
    
    useEffect(() => {
    const { value, variationAmount } = getBarChartData()
    targetValue.current = value
    setVariationAmount(variationAmount)
    setVariationValue(Math.round((variationAmount / (value - variationAmount)) * 100))
    startTimeRef.current = null
    setDisplayValue('0')
    animationRef.current = requestAnimationFrame(animateValue)
    
    return () => {
        if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        }
    }
    }, [getBarChartData])
    
    const animateValue = useCallback((timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const progress = timestamp - startTimeRef.current
        const duration = 800
        
        if (progress < duration) {
          const easedProgress = easeOutQuad(progress / duration)
          const currentDisplay = Math.floor(easedProgress * targetValue.current)
          setDisplayValue(currentDisplay.toLocaleString())
          animationRef.current = requestAnimationFrame(animateValue)
        } else {
          setDisplayValue(targetValue.current.toLocaleString())
        }
      }, [])
    
    const easeOutQuad = useCallback((t) => t * (2 - t), [])

    const renderVariationBadge = useCallback(() => {
        const { trend } = getBarChartData()
        const isPositive = trend === 'up'
        const arrowClass = isPositive 
          ? 'fas fa-arrow-up rotate-45' 
          : 'fas fa-arrow-down rotate-[-35deg]'
    
        return (
          <div className="flex flex-col items-end">
            <div className={`
              px-2 py-1 rounded-full
              border ${isPositive ? 'border-green-500/50' : 'border-red-500/50'}
              bg-${isPositive ? 'green-500/10' : 'red-500/10'}
              backdrop-blur-sm
              shadow-sm
              flex items-center gap-1
              text-xs font-medium
              ${isPositive ? 'text-green-500' : 'text-red-500'}
            `}>
              <span>{variationValue}%</span>
              <i className={`${arrowClass} text-[0.6rem]`} />
            </div>
            <div className={`text-[0.6rem] mt-1 ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {isPositive ? '+' : '-'}{Math.abs(variationAmount).toLocaleString()}
            </div>
          </div>
        )
      }, [getBarChartData, variationValue, variationAmount])

    const handleTaxeChange = (selectedOption) => {
        setTaxeFilter(selectedOption)
        setData(generateData(period, bureauFilter?.value, selectedOption?.value))
    }

    const removeBureauSelection = (option) => {
        setBureauOptions(bureauOptions.filter(item => item.value !== option.value));
        handleBureauChange([option])
    };
    
    const removeTaxSelection = (option) => {
        setSelectedTaxOptions(selectedTaxOptions.filter(item => item.value !== option.value));
        handleTaxeChange([option])
    };

    useEffect(() => {
        (bureauOptions.length ? setbureauLabel("Bureaux") : setbureauLabel("Tous les Bureaux"));
        (selectedTaxOptions.length ? setTaxLabel("Taxes") : setTaxLabel("Toutes Taxes"));

    }, [bureauOptions, selectedTaxOptions]);

    return (
        <div className="group h-full bg-white dark:bg-card p-4 rounded-lg shadow border border-[#343b4f] transition-all duration-300 relative">
            {/* Border gradient */}
            <div className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 17% -3%, #00c2ff 0%, #00c2ff 10%, transparent 30%)`,
                    mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1px'
                }}>
                <div className="bg-white dark:bg-card w-full h-full rounded-lg" />
            </div>

            {/* Period Selector & Filter Combo */}
            <div className="absolute w-80 top-4 right-4 z-20 bg-brand-800/50 backdrop-blur-sm p-2 rounded-lg border border-[#00c2ff]/50">
                <div className="flex gap-10">
                    {['Jour', 'Sem', 'Mois', 'Année'].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => handlePeriodChange(p)}
                            className={`
                                    relative
                                    px-2 py-1 rounded-md
                                    text-[12px] font-medium
                                    transition-colors duration-100
                                    ${period === p
                                                        ? 'bg-[#00c2ff]/10 text-[#00c2ff]'
                                                        : 'text-card-text'
                                                    }
                                    after:absolute
                                    after:inset-0
                                    after:rounded-md
                                    after:border
                                    after:border-transparent
                                    focus:after:border-[#00c2ff]/50
                                    hover:after:border-[#00c2ff]/50
                                    after:pointer-events-none
                                    hover:text-[#00c2ff]
                            `}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {/* Combo Lists */}
                <div className="flex flex-col gap-2 mt-3 justify-end text-[12px]">
                    {/* Bureaux Lists */}
                  <div className="w-76">
                    <CustomMultiSelect
                      options={defaultBureaux}
                      value={bureauFilter}
                      label={bureauLabel}
                      fowardChange = {handleBureauChange}
                      placeHolder="Bureaux"
                      classNamePrefix="react-select"
                      selectedOptions={bureauOptions}
                      setSelectedOptions={setBureauOptions}
                    />
                  </div>
                  {/* Taxes Lists */}
                  <div className="w-76">
                    <CustomMultiSelect
                      options={defaultTaxes}
                      value={taxeFilter}
                      label={taxLabel}
                      fowardChange={handleTaxeChange}
                      placeHolder="Taxes"
                      classNamePrefix="react-select"
                      selectedOptions={selectedTaxOptions}
                      setSelectedOptions={setSelectedTaxOptions}
                    />
                  </div>
                </div>
            </div>
            {/*Header Title  */}                                        
           <div className="flex items-start justify-between mb-2 relative z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-chart-line text-sm text-gray-300 dark:text-card-text" />
                        <h3 className="text-sm font-medium text-gray-500 dark:text-card-text">
                            Évolution des recettes
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {displayValue}
                        </p>
                        {renderVariationBadge(4.2, 'up')}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-56 relative z-10 mt-28 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                        data={data}
                        margin={{ top: 5, right: 20, left: 0, bottom: 30 }}
                    >
                        <XAxis
                            dataKey="name"
                            tick={{
                                fill: '#aeb9e1',
                                fontSize: period === 'Mois' ? 8 : (period === 'Jour' ? 10 : 12)
                            }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            angle={period === 'Année' ? -45 : 0}
                            textAnchor={period === 'Année' ? 'end' : 'middle'}
                            height={40}
                        />
                        <YAxis
                            tick={{ fill: '#aeb9e1', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={false}
                        />
                        <Bar
                            dataKey="value"
                            stroke="#00c2ff"
                            fill="transparent"
                            strokeWidth={period === 'Jour' || period === 'Mois' ? 1 : 2}
                            radius={[4, 4, 0, 0]}
                            barSize={period === 'Jour' || period === 'Mois' ? 4 : 20}
                        />
                    </ReBarChart>
                </ResponsiveContainer>
            </div>
            {/* Bureau Filter display */}
            <div className="flex w-full gap-4 items-start">
                <SelectionDisplay label={bureauLabel} selectedOptions={bureauOptions} removeSelection={removeBureauSelection} />
                <div className="w-1/2 bg-back rounded-lg self-start">
                    <SelectionDisplay label={taxLabel} selectedOptions={selectedTaxOptions} removeSelection={removeTaxSelection} />
                </div>
            </div>
        </div>
    )
}
