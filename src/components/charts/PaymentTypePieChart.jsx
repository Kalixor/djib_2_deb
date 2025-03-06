import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts'
import { useState } from 'react'

const COLORS = ['#00c2ff', '#0038ff', '#cb3cff']

export default function PaymentTypePieChart({ data, bureauFilter, period }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const total = data.reduce((sum, item) => sum + item.value, 0)

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
    const labelText = activeItem ? activeItem.value.toLocaleString() : total.toLocaleString()
    const titleText = activeItem ? activeItem.name : 'Total'

    return (
      <>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fill="#aeb9e1"
          dominantBaseline="middle"
          fontSize="20"
          fontWeight="700"
        >
          {labelText}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          fill="#aeb9e1"
          fontSize="14"
        >
          {titleText}
        </text>
      </>
    )
  }

  return (
    <div className="bg-white dark:bg-card p-3 rounded-lg shadow border border-[#343b4f] transition-all duration-300 relative h-[420px]">
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

      <div className="flex justify-between items-start mb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <i className="fas fa-money-bill-wave text-lg text-gray-300 dark:text-card-text" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-card-text">
              Modes de Paiement
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mt-8">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="52%"
                startAngle={180}
                endAngle={0}
                innerRadius={90}
                outerRadius={140}
                paddingAngle={1}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex}
                activeShape={{
                  outerRadius: 145,
                  innerRadius: 85,
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
      </div>

      {bureauFilter && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <h2 className="text-2xl font-bold text-white">
            {bureauFilter}
          </h2>
          {period && (
            <div className="text-xs text-yellow-400/80 mt-1">
              {period}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
