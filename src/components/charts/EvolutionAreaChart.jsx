import { AreaChart as ReAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-800/95 backdrop-blur-sm p-3 rounded-lg border border-[#cb3cff]/50 shadow-lg">
        <p className="text-xs text-card-text mb-2">{new Date(label).toLocaleDateString('fr-FR')}</p>
        <div className="flex flex-col gap-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-card-text">
                {item.name}: <span className="font-medium">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function EvolutionAreaChart({ data, xAxisConfig }) {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart
          data={data}
          margin={{ top: 30, right: 5, left: 5, bottom: 20 }}
        >
          <defs>
            <linearGradient id="prevuesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00c2ff" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00c2ff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="effectivesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#cb3cff" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#cb3cff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date"
            tickFormatter={xAxisConfig.tickFormatter}
            tick={{ 
              fill: '#aeb9e1', 
              fontSize: xAxisConfig.fontSize
            }}
            axisLine={false}
            tickLine={false}
            interval={xAxisConfig.interval}
            angle={xAxisConfig.angle}
            textAnchor={xAxisConfig.angle === 0 ? 'middle' : 'end'}
            height={xAxisConfig.angle === 0 ? 40 : 60}
          />
          <YAxis 
            tick={{ fill: '#aeb9e1', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend 
            verticalAlign="top"
            align="center"
            wrapperStyle={{
              paddingBottom: 10,
              paddingTop: 10
            }}
            formatter={(value) => (
              <span className="text-xs text-card-text">
                {value === 'prevues' ? 'Prévues' : 'Effectives'}
              </span>
            )}
          />
          <Area 
            type="monotone" 
            dataKey="prevues" 
            stroke="#00c2ff" 
            fillOpacity={1} 
            fill="url(#prevuesGradient)" 
            activeDot={{ r: 6, stroke: '#00c2ff', strokeWidth: 2, fill: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="effectives" 
            stroke="#cb3cff" 
            fillOpacity={1} 
            fill="url(#effectivesGradient)" 
            activeDot={{ r: 6, stroke: '#cb3cff', strokeWidth: 2, fill: '#fff' }}
          />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
