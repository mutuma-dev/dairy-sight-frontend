/**
 * Sales Analytics Page Component
 * Displays Total Sales and Peak Hour cards with time period filters
 * Users can filter data by: last 24 hours, last 7 days, last 30 days, last 1 year
 * Data is read from app data file
 */

"use client"

import { useState } from "react"
import type { Analytics, TimePeriod } from "@/lib/types"

interface SalesAnalyticsProps {
  analytics: Analytics
}

export default function SalesAnalytics({ analytics }: SalesAnalyticsProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("last7Days")

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: "last24Hours", label: "Last 24 Hours" },
    { value: "last7Days", label: "Last 7 Days" },
    { value: "last30Days", label: "Last 30 Days" },
    { value: "last1Year", label: "Last 1 Year" },
  ]

  const totalSalesValue = analytics.totalSales[timePeriod]
  const peakHourData = analytics.peakHours[timePeriod]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
        <p className="text-gray-600 mt-2">Track sales performance and peak hours</p>
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

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gray-600 font-medium text-sm">Total Sales</p>
              <h2 className="text-gray-800 text-xs mt-1">{timePeriods.find((p) => p.value === timePeriod)?.label}</h2>
            </div>
            <div className="text-4xl">💰</div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-5xl font-bold text-blue-600">KES {totalSalesValue.toLocaleString()}</h3>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-blue-600 text-sm font-semibold">+12.5%</p>
              <p className="text-gray-500 text-xs">compared to previous period</p>
            </div>
          </div>
        </div>

        {/* Peak Hour Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gray-600 font-medium text-sm">Peak Hour</p>
              <h2 className="text-gray-800 text-xs mt-1">{timePeriods.find((p) => p.value === timePeriod)?.label}</h2>
            </div>
            <div className="text-4xl">📈</div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-5xl font-bold text-blue-600">{peakHourData.hour}</h3>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-blue-600 text-sm font-semibold">{peakHourData.units.toLocaleString()} units sold</p>
              <p className="text-gray-500 text-xs">Peak sales timeframe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
