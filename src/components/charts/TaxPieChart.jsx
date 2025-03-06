import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts'
import { useState } from 'react'

const COLORS = ['#00c2ff', '#0038ff', '#cb3cff', '#ff8042', '#00c49f']

export default function TaxPieChart({ data }) {
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
            <i className="fas fa-file-invoice-dollar text-lg text-gray-300 dark:text-card-text" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-card-text">
              Répartition par Taxe
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
                cy="50%"
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

      <div className="w-full flex flex-col justify-center mt-[-5rem] px-2">
        <div className="space-y-1">
          {data.map((entry, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center"
              onMouseEnter={() => onPieEnter(null, index)}
              onMouseLeave={onPieLeave}
            >
              <div className="flex items-center gap-1">
                <div 
                  className="w-2.5 h-2.5 rounded-full transition-opacity" 
                  style={{ 
                    backgroundColor: COLORS[index % COLORS.length],
                    opacity: getOpacity(index)
                  }}
                />
                <span className="text-xs font-medium text-card-text">
                  {entry.name}
                </span>
              </div>
              <span className="text-xs font-medium text-white ml-1">
                {entry.value.toLocaleString()} ({((entry.value/total)*100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
