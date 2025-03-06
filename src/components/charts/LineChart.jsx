import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-800/95 backdrop-blur-sm p-3 rounded-lg border border-[#cb3cff]/50 shadow-lg">
        <p className="text-xs text-card-text mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-card-text font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default function LineChart({ data }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey="name"
            tick={{ fill: '#aeb9e1', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#aeb9e1', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#cb3cff" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: '#cb3cff', strokeWidth: 2, fill: '#fff' }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
