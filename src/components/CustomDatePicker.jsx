import { useState } from 'react'

export default function CustomDatePicker({ value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState('days')
  const currentDate = new Date(value)
  const [currentYear, setCurrentYear] = useState(currentDate.getUTCFullYear())
  const [currentMonth, setCurrentMonth] = useState(currentDate.getUTCMonth())

  // Helper functions
  const daysInMonth = (year, month) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const firstDayOfMonth = (year, month) => {
    const day = new Date(Date.UTC(year, month, 1)).getUTCDay()
    return day === 0 ? 6 : day - 1
  }

  // Data
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  // Handlers
  const handleDateSelect = (day) => {
    if (disabled) return
    const newDate = new Date(Date.UTC(currentYear, currentMonth, day))
    onChange(newDate.toISOString().split('T')[0])
    setIsOpen(false)
  }

  const handleMonthSelect = (monthIndex) => {
    if (disabled) return
    setCurrentMonth(monthIndex)
    setView('days')
  }

  const handleYearSelect = (year) => {
    if (disabled) return
    setCurrentYear(year)
    setView('months')
  }

  const navigateMonth = (direction, e) => {
    if (disabled) return
    e.stopPropagation()
    let newMonth = currentMonth + direction
    let newYear = currentYear
    
    if (newMonth < 0) {
      newMonth = 11
      newYear--
    } else if (newMonth > 11) {
      newMonth = 0
      newYear++
    }
    
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const handleViewChange = (newView, e) => {
    if (disabled) return
    e.stopPropagation()
    setView(newView)
  }

  // Render functions
  const renderDays = () => {
    const days = Array.from({ length: daysInMonth(currentYear, currentMonth) }, (_, i) => i + 1)
    const firstDay = firstDayOfMonth(currentYear, currentMonth)

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={(e) => navigateMonth(-1, e)}
            className={`text-card-text hover:text-[#cb3cff] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
          </button>
          <div className="flex gap-2">
            <button
              onClick={(e) => handleViewChange('months', e)}
              className={`text-sm text-card-text hover:text-[#cb3cff] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled}
            >
              {months[currentMonth]}
            </button>
            <button
              onClick={(e) => handleViewChange('years', e)}
              className={`text-sm text-card-text hover:text-[#cb3cff] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled}
            >
              {currentYear}
            </button>
          </div>
          <button
            onClick={(e) => navigateMonth(1, e)}
            className={`text-card-text hover:text-[#cb3cff] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center text-sm text-card-text mb-3">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="w-6 h-6 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center text-sm text-card-text">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="w-6 h-6" />
          ))}
          {days.map((day) => {
            const isSelected = day === currentDate.getUTCDate() && 
                              currentMonth === currentDate.getUTCMonth() &&
                              currentYear === currentDate.getUTCFullYear()
            
            return (
              <div
                key={day}
                onClick={() => handleDateSelect(day)}
                className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#cb3cff]/10 transition-colors ${
                  isSelected ? 'bg-[#cb3cff] text-white' : ''
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {day}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const renderMonths = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => (
          <div
            key={month}
            onClick={() => handleMonthSelect(index)}
            className={`p-2 text-center text-sm text-card-text rounded cursor-pointer hover:bg-[#cb3cff]/10 hover:text-[#cb3cff] transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {month}
          </div>
        ))}
      </div>
    )
  }

  const renderYears = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {years.map((year) => (
          <div
            key={year}
            onClick={() => handleYearSelect(year)}
            className={`p-2 text-center text-sm text-card-text rounded cursor-pointer hover:bg-[#cb3cff]/10 hover:text-[#cb3cff] transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {year}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-brand-800/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-700/50 transition-colors border border-[#cb3cff]/50 hover:border-[#cb3cff]/70 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="text-sm text-card-text">
          {new Date(value).toLocaleDateString('fr-FR')}
        </span>
        <i className={`fas fa-calendar-alt text-[#cb3cff] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        
        {isOpen && (
          <div 
            className="absolute top-full right-0 mt-2 w-64 bg-brand-800/95 rounded-lg shadow-lg border border-[#cb3cff]/50 backdrop-blur-sm z-[9999] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {view === 'days' && renderDays()}
            {view === 'months' && renderMonths()}
            {view === 'years' && renderYears()}
            
            {view !== 'days' && (
              <div className="flex justify-between mt-4 pt-4 border-t border-[#cb3cff]/30">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setView('days')
                  }}
                  className={`text-sm text-card-text hover:text-[#cb3cff] px-3 py-1 rounded hover:bg-[#cb3cff]/10 transition-colors ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={disabled}
                >
                  Retour
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
