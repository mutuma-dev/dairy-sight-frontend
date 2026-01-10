"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

/* ----------------------------------
   MOCK DATA (SELF-CONTAINED)
-----------------------------------*/

type TimePeriod = "last24Hours" | "last7Days" | "last30Days" | "last1Year"

const DATA = {
  last24Hours: {
    totalLitres: 420,
    peakHour: { hour: "08:00 - 09:00", litres: 120 },
    trend: [
      { label: "00:00", litres: 12 },
      { label: "03:00", litres: 30 },
      { label: "06:00", litres: 58 },
      { label: "09:00", litres: 92 },
      { label: "12:00", litres: 76 },
      { label: "15:00", litres: 64 },
      { label: "18:00", litres: 81 },
      { label: "21:00", litres: 55 },
    ],
  },

  last7Days: {
    totalLitres: 2840,
    peakHour: { hour: "07:00 - 08:00", litres: 480 },
    trend: [
      { label: "Mon", litres: 410 },
      { label: "Tue", litres: 380 },
      { label: "Wed", litres: 460 },
      { label: "Thu", litres: 520 },
      { label: "Fri", litres: 610 },
      { label: "Sat", litres: 730 },
      { label: "Sun", litres: 690 },
    ],
  },

  last30Days: {
    totalLitres: 11800,
    peakHour: { hour: "06:00 - 07:00", litres: 1600 },
    trend: [
      { label: "Week 1", litres: 2800 },
      { label: "Week 2", litres: 3100 },
      { label: "Week 3", litres: 2900 },
      { label: "Week 4", litres: 3000 },
    ],
  },

  last1Year: {
    totalLitres: 142000,
    peakHour: { hour: "06:00 - 07:00", litres: 19000 },
    trend: [
      { label: "Jan", litres: 11000 },
      { label: "Feb", litres: 9800 },
      { label: "Mar", litres: 12300 },
      { label: "Apr", litres: 11800 },
      { label: "May", litres: 12900 },
      { label: "Jun", litres: 13200 },
      { label: "Jul", litres: 14100 },
      { label: "Aug", litres: 13600 },
      { label: "Sep", litres: 12400 },
      { label: "Oct", litres: 13000 },
      { label: "Nov", litres: 11900 },
      { label: "Dec", litres: 12200 },
    ],
  },
}

/* ----------------------------------
   COMPONENT
-----------------------------------*/

export default function SalesAnalytics() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("last7Days")

  const filters: { value: TimePeriod; label: string }[] = [
    { value: "last24Hours", label: "Last 24 Hours" },
    { value: "last7Days", label: "Last 7 Days" },
    { value: "last30Days", label: "Last 30 Days" },
    { value: "last1Year", label: "Last 1 Year" },
  ]

  const activeData = DATA[timePeriod]

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
        <p className="text-gray-600 mt-2">
          Milk vending machine performance overview
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setTimePeriod(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timePeriod === filter.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Sales</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-4">
            {activeData.totalLitres.toLocaleString()} L
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Peak Hour</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-4">
            {activeData.peakHour.hour}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {activeData.peakHour.litres.toLocaleString()} litres sold
          </p>
        </div>
      </div>

      {/* Animated Graph */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sales Trend
        </h3>

        <div className="w-full h-[260px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeData.trend}>
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
