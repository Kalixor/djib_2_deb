import { useEffect, useState } from 'react'

const NotificationPopup = ({ type, message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true)

  const styles = {
    error: {
      bg: 'bg-red-500/90',
      icon: 'fas fa-exclamation-circle',
    },
    info: {
      bg: 'bg-blue-500/90',
      icon: 'fas fa-info-circle',
    },
    system: {
      bg: 'bg-gray-500/90',
      icon: 'fas fa-cog',
    },
    success: {
      bg: 'bg-green-500/90',
      icon: 'fas fa-check-circle',
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className={`
          ${styles[type].bg} 
          p-6 rounded-lg shadow-lg 
          flex items-center gap-4
          animate-bounce-in
        `}>
          <i className={`${styles[type].icon} text-2xl text-white`} />
          <span className="text-white text-lg">{message}</span>
        </div>
      </div>
    </>
  )
}

export default NotificationPopup
