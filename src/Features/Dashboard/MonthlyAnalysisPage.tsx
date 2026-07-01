import { useState } from 'react'
import MonthsListPage from './MonthListPage'
import MonthAnalysisDetail from './MonthAnalysis'

export default function MonthlyAnalysisPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  if (selectedMonth) {
    return (
      <MonthAnalysisDetail
        monthStart={selectedMonth}
        onBack={() => setSelectedMonth(null)}
      />
    )
  }

  return <MonthsListPage onSelectMonth={setSelectedMonth} />
}