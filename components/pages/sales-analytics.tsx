"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

/* ----------------------------------
   TYPES
-----------------------------------*/
type TimePeriod = "last24Hours" | "last7Days" | "last30Days" | "last1Year"

/* ----------------------------------
   MOCK DATA (UPDATED FORMAT)
-----------------------------------*/
const DATA: Record<
  TimePeriod,
  {
    totalLitres: number
    totalRevenue: number
    peakHour: { hour: string; litres: number }
    salesOverview: { label: string; litres: number }[]
    revenueByVolume: { label: string; revenue: number }[]
    revenueByDevice: { device: string; revenue: number }[]
  }
> = {
  last24Hours: {
    totalLitres: 420,
    totalRevenue: 25200,
    peakHour: { hour: "08:00 - 09:00", litres: 120 },
    salesOverview: [
      { label: "00:00", litres: 12 },
      { label: "03:00", litres: 30 },
      { label: "06:00", litres: 58 },
      { label: "09:00", litres: 92 },
      { label: "12:00", litres: 76 },
      { label: "15:00", litres: 64 },
      { label: "18:00", litres: 81 },
      { label: "21:00", litres: 55 },
    ],
    revenueByVolume: [
      { label: "0.5L", revenue: 4200 },
      { label: "1L", revenue: 9800 },
      { label: "2L", revenue: 11200 },
    ],
    revenueByDevice: [
      { device: "Machine A", revenue: 9800 },
      { device: "Machine B", revenue: 8200 },
      { device: "Machine C", revenue: 7200 },
    ],
  },

  last7Days: {
    totalLitres: 2840,
    totalRevenue: 170400,
    peakHour: { hour: "07:00 - 08:00", litres: 480 },
    salesOverview: [
      { label: "Mon", litres: 410 },
      { label: "Tue", litres: 380 },
      { label: "Wed", litres: 460 },
      { label: "Thu", litres: 520 },
      { label: "Fri", litres: 610 },
      { label: "Sat", litres: 730 },
      { label: "Sun", litres: 690 },
    ],
    revenueByVolume: [
      { label: "0.5L", revenue: 42000 },
      { label: "1L", revenue: 61000 },
      { label: "2L", revenue: 67400 },
    ],
    revenueByDevice: [
      { device: "Machine A", revenue: 62000 },
      { device: "Machine B", revenue: 54000 },
      { device: "Machine C", revenue: 54400 },
    ],
  },

  last30Days: {
    totalLitres: 11800,
    totalRevenue: 708000,
    peakHour: { hour: "06:00 - 07:00", litres: 1600 },
    salesOverview: [
      { label: "Week 1", litres: 2800 },
      { label: "Week 2", litres: 3100 },
      { label: "Week 3", litres: 2900 },
      { label: "Week 4", litres: 3000 },
    ],
    revenueByVolume: [
      { label: "0.5L", revenue: 168000 },
      { label: "1L", revenue: 248000 },
      { label: "2L", revenue: 292000 },
    ],
    revenueByDevice: [
      { device: "Machine A", revenue: 248000 },
      { device: "Machine B", revenue: 230000 },
      { device: "Machine C", revenue: 230000 },
    ],
  },

  last1Year: {
    totalLitres: 142000,
    totalRevenue: 8520000,
    peakHour: { hour: "06:00 - 07:00", litres: 19000 },
    salesOverview: [
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
    revenueByVolume: [
      { label: "0.5L", revenue: 2100000 },
      { label: "1L", revenue: 3000000 },
      { label: "2L", revenue: 3420000 },
    ],
    revenueByDevice: [
      { device: "Machine A", revenue: 2900000 },
      { device: "Machine B", revenue: 2800000 },
      { device: "Machine C", revenue: 2820000 },
    ],
  },
}

/* ----------------------------------
   COMPONENT
-----------------------------------*/
export default function SalesAnalytics() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("last7Days")

  const filters = [
    { value: "last24Hours", label: "Last 24 Hours" },
    { value: "last7Days", label: "Last 7 Days" },
    { value: "last30Days", label: "Last 30 Days" },
    { value: "last1Year", label: "Last 1 Year" },
  ] as const

  const active = DATA[timePeriod]

  return (
    <div className="p-4 sm:p-6 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
        <p className="text-gray-600 mt-2">
          Milk vending machine performance overview
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setTimePeriod(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timePeriod === f.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Sales</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {active.totalLitres.toLocaleString()} L
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-4xl font-bold text-green-600 mt-3">
            ₹{active.totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Peak Hour</p>
          <h2 className="text-2xl font-bold text-blue-600 mt-3">
            {active.peakHour.hour}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {active.peakHour.litres} L sold
          </p>
        </div>
      </div>

      {/* Sales Overview (Line Chart) */}
      <ChartCard title="Sales Overview">
        <LineChart data={active.salesOverview}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="litres"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ r: 4 }}
            animationDuration={700}
          />
        </LineChart>
      </ChartCard>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue by Volume">
          <BarChart data={active.revenueByVolume}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#16A34A" animationDuration={700} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Revenue by Device">
          <BarChart data={active.revenueByDevice}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="device" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#9333EA" animationDuration={700} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  )
}

/* ----------------------------------
   REUSABLE CHART CARD
-----------------------------------*/
function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-[260px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {children as any}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
