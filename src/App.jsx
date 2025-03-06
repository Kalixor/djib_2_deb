import { useState } from 'react'
import { PeriodProvider } from './context/PeriodContext'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'

function App() {
  const [filters, setFilters] = useState({
    period: 'month',
    office: 'all',
    payment: 'all'
  })
  const [activePage, setActivePage] = useState('home')

  return (
    <PeriodProvider>
      <div className="min-h-screen bg-brand-800 text-white">
        <Navbar onPageChange={setActivePage} />
        {activePage === 'home' && <Dashboard filters={filters} setFilters={setFilters} />}
      </div>
    </PeriodProvider>
  )
}

export default App
