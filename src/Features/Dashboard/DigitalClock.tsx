import { useEffect, useState } from 'react'

export default function DigitalClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval) // cleanup on unmount
  }, [])

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm px-5 py-4 flex flex-col items-center justify-center text-center">
      <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">
        {time}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {date}
      </p>
    </div>
  )
}