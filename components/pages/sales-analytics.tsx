/**
 * Sales Analytics Page Component
 * Displays Total Sales (Litres) and Peak Hour cards with time period filters
 * Users can filter data by: last 24 hours, last 7 days, last 30 days, last 1 year
 * Data is read directly from app data file (analytics.totalLitres & analytics.peakHours)
 */

"use client"

import { useState } from "react"
import type { Analytics, TimePeriod } from "@/lib/types"

interface SalesAnalyticsProps {
  analytics: Analytics
}

export default function SalesAnalytics({ analytics }: SalesAnalyticsProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("last7Days")

  // Time period options
  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: "last24Hours", label: "Last 24 Hours" },
    { value: "last7Days", label: "Last 7 Days" },
    { value: "last30Days", label: "Last 30 Days" },
    { value: "last1Year", label: "Last 1 Year" },
  ]

  // 🔐 Safety guard (prevents crashes if data is missing)
  if (!analytics) {
    return <div className="p-6">Loading analytics...</div>
  }

  // ✅ Correct paths based on your data file
  const totalLitres = analytics.totalLitres[timePeriod]
  const peakHour = analytics.peakHours[timePeriod]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track sales performance and peak hours
        </p>
      </div>

      {/* Time Period Filter */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {timePeriods.map((period) => (
          <button
            key={period.value}
            onClick={() => setTimePeriod(period.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timePeriod === period.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gray-600 font-medium text-sm">Total Sales</p>
              <h2 className="text-gray-800 text-xs mt-1">
                {timePeriods.find((p) => p.value === timePeriod)?.label}
              </h2>
            </div>
            {/*  <div className="text-4xl">💰</div> */}
          </div>

          <h3 className="text-5xl font-bold text-blue-600">
            {totalLitres.toLocaleString()} Litres
          </h3>
        </div>

        {/* Peak Hour Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gray-600 font-medium text-sm">Peak Hour</p>
              <h2 className="text-gray-800 text-xs mt-1">
                {timePeriods.find((p) => p.value === timePeriod)?.label}
              </h2>
            </div>
            {/* <div className="text-4xl">📈</div> */}
          </div>

          <h3 className="text-4xl font-bold text-blue-600">
            {peakHour.hour}
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            {peakHour.litres.toLocaleString()} litres sold
          </p>
        </div>
      </div>
    </div>
  )
}

