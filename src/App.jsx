import { useState } from 'react'
import { PeriodProvider } from './context/PeriodContext'
import { PreloadedDataProvider } from './context/preLoadContext';
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
    <PreloadedDataProvider>
       <PeriodProvider>
        <div className="min-h-screen bg-brand-800 text-white">
          <Navbar onPageChange={setActivePage} />
          {activePage === 'home' && <Dashboard filters={filters} setFilters={setFilters} />}
        </div>
      </PeriodProvider>
    </PreloadedDataProvider>
  )
}

export default App
