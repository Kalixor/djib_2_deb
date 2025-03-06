import { usePeriod } from '../context/PeriodContext'
import { useState, useEffect, useRef } from 'react'
import CustomDatePicker from './CustomDatePicker'
import TableauTabs from './TableauTabs'

export default function Navbar({ onPageChange }) {
  const { period, togglePeriod } = usePeriod()
  const [currentTime, setCurrentTime] = useState(getFormattedTime())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activePage, setActivePage] = useState('home')
  const [showTableauTabs, setShowTableauTabs] = useState(false)
  const animationFrameRef = useRef()

  const updateTime = () => {
    setCurrentTime(getFormattedTime())
    animationFrameRef.current = requestAnimationFrame(updateTime)
  }

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateTime)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  function getFormattedTime() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const handlePageChange = (page) => {
    setActivePage(page)
    setShowTableauTabs(page === 'tableaux')
    onPageChange?.(page)
  }

  return (
    <nav className="bg-brand-800 shadow p-3 relative mx-1">
      <div className="w-full flex justify-between items-center mt-3">
        <div className="ml-2">
          <h1 className="text-2xl font-semibold text-white">
            Activités des Douanes
            <p className="text-sm font-medium text-card-text mt-1">Au {currentTime}</p>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-card-text">Au :</span>
            <CustomDatePicker 
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          
          <div className="bg-brand-800/50 backdrop-blur-sm p-2 rounded-lg border border-[#cb3cff]/50">
            <div className="flex gap-1">
              {['Journalières', 'Hebdomadaires', 'Mensuelles', 'Annuelles'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePeriod(p)}
                  className={`
                    relative
                    px-2 py-1 rounded-md
                    text-xs font-medium
                    transition-colors duration-100
                    ${
                      period === p
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
                  `}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${
                  activePage === 'home'
                    ? 'bg-[#cb3cff]/10 text-[#cb3cff]'
                    : 'text-card-text hover:bg-brand-700/50'
                }`}
              onClick={() => handlePageChange('home')}
            >
              Home
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${
                  activePage === 'tableaux'
                    ? 'bg-[#cb3cff]/10 text-[#cb3cff]'
                    : 'text-card-text hover:bg-brand-700/50'
                }`}
              onClick={() => handlePageChange('tableaux')}
            >
              Tableaux
            </button>
          </div>
        </div>
      </div>

      {showTableauTabs && <TableauTabs />}
    </nav>
  )
}
