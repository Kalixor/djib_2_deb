import { createContext, useContext, useState } from 'react'

const PeriodContext = createContext()

export const PeriodProvider = ({ children }) => {
  const [period, setPeriod] = useState('Annuelles')

  const togglePeriod = (newPeriod) => {
    setPeriod(newPeriod)
  }

  return (
    <PeriodContext.Provider value={{ period, togglePeriod }}>
      {children}
    </PeriodContext.Provider>
  )
}

export const usePeriod = () => useContext(PeriodContext)
