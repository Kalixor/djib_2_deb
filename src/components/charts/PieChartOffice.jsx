import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts'
import { useState } from 'react'
import CustomDatePicker from '../CustomDatePicker'

const COLORS = ['#00c2ff', '#0038ff', '#cb3cff']

export default function PieChartOffice({ filters, setFilters }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeIndex, setActiveIndex] = useState(null)
  
  const data = [
    { name: 'Paiements recouvrés', value: 400 },
    { name: 'Paiements en relance', value: 300 },
    { name: 'Paiement contentieux', value: 200 },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const variation = 4.2 // Valeur de variation en pourcentage

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const getOpacity = (index) => {
    return activeIndex === null ? 0.3 : (activeIndex === index ? 1 : 0.1)
  }

  const renderCenterLabel = () => {
    const activeItem = activeIndex !== null ? data[activeIndex] : null
    const labelText = activeItem ? activeItem.name : 'Total'
    const valueText = activeItem ? activeItem.value : total.toLocaleString()

    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        fill="#aeb9e1"
        dominantBaseline="middle"
      >
        <tspan x="50%" dy="-2.0em" fontSize="20" fontWeight="700">
          {valueText}
        </tspan>
      </text>
    )
  }

  const renderVariationBadge = () => {
    const isPositive = variation >= 0
    const arrowClass = isPositive 
      ? 'fas fa-arrow-up rotate-45' 
      : 'fas fa-arrow-down rotate-[-35deg]'

    return (
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
        <span>{variation}%</span>
        <i className={`${arrowClass} text-[0.6rem]`} />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-card w-full p-4 rounded-lg shadow border border-[#343b4f] transition-all duration-300 relative">
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

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <i className="fas fa-coins text-lg text-gray-300 dark:text-card-text" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-card-text">
              Réalisation des Recettes
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {total.toLocaleString()}
            </p>
            {renderVariationBadge()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-card-text">Le :</span>
          <CustomDatePicker 
            value={selectedDate}
            onChange={setSelectedDate}
            disabled={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center gap-2">
        {/* Chart */}
        <div className="w-[80%] h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={110}
                outerRadius={170}
                paddingAngle={1}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex}
                activeShape={{
                  outerRadius: 175,
                  innerRadius: 105,
                  fillOpacity: 1
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={activeIndex === index ? 2 : 1}
                    fillOpacity={getOpacity(index)}
                  />
                ))}
                <Label
                  content={renderCenterLabel}
                  position="center"
                />
              </Pie>
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-[22rem] flex flex-col justify-center mt-[-8rem]">
          <div className="space-y-4">
            {data.map((entry, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center"
                onMouseEnter={() => onPieEnter(null, index)}
                onMouseLeave={onPieLeave}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full transition-opacity" 
                    style={{ 
                      backgroundColor: COLORS[index % COLORS.length],
                      opacity: getOpacity(index)
                    }}
                  />
                  <span className="text-sm font-medium text-card-text">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-white">
                  {entry.value.toLocaleString()} ({((entry.value/total)*100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
