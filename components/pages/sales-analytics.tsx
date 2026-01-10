/**
 * Sales Analytics Page Component
 * Displays Total Sales (Litres) and Peak Hour cards with time period filters
 * Users can filter data by: last 24 hours, last 7 days, last 30 days, last 1 year
 * Data is read directly from app data file (analytics.totalLitres & analytics.peakHours)
 */

"use client"

import { useState } from "react"
import type { Analytics, TimePeriod } from "@/lib/types"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

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

  if (!analytics) {
    return <div className="p-6">Loading analytics...</div>
  }

  const totalLitres = analytics.totalLitres[timePeriod]
  const peakHour = analytics.peakHours[timePeriod]

  // 📊 Line graph data (dynamic & filter-aware)
  const chartData = analytics.salesTrend[timePeriod]

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track sales performance and peak hours
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
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

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-sm">Total Sales</p>
          <h3 className="text-5xl font-bold text-blue-600 mt-4">
            {totalLitres.toLocaleString()} Litres
          </h3>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-sm">Peak Hour</p>
          <h3 className="text-4xl font-bold text-blue-600 mt-4">
            {peakHour.hour}
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            {peakHour.litres.toLocaleString()} litres sold
          </p>
        </div>
      </div>

      {/* 📈 Animated Sales Trend Graph */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Sales Trend ({timePeriods.find(p => p.value === timePeriod)?.label})
        </h2>

        <div className="w-full h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                }}
              />
              <Line
                type="monotone"
                dataKey="litres"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={700}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}


