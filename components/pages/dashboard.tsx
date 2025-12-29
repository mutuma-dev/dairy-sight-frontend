/**
 * Dashboard Page Component
 * Displays overview cards with key metrics: Total Sales, Active Devices, Peak Hour, and Alerts
 * Also shows Recent Transactions and Device Status
 * All data is read from the app data file
 * Fully responsive design for mobile and desktop
 */

"use client"

import { useState } from "react"
import type { AppData } from "@/lib/types"
import StatsCard from "@/components/cards/stats-card"
import TransactionsList from "@/components/modals/transactions-list"
import AlertsList from "@/components/modals/alerts-list"
import DeviceStatusList from "@/components/modals/device-status-list"

interface DashboardProps {
  appData: AppData
}

export default function Dashboard({ appData }: DashboardProps) {
  const [showTransactions, setShowTransactions] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showDeviceStatus, setShowDeviceStatus] = useState(false)

  const onlineDevices = appData.devices.filter((d) => d.status === "online").length
  const totalDevices = appData.devices.length

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* Header - Added top padding for mobile menu */}
      <div className="flex items-center justify-between mt-12 lg:mt-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats Cards Grid - Improved responsive design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {/* Total Sales Card */}
        <StatsCard
          title="Total Sales (This Week)"
          value={`KES ${appData.analytics.totalSales.last7Days.toLocaleString()}`}
          change="+12.5%"
          backgroundColor="bg-white"
        />

        {/* Active Devices Card */}
        <StatsCard
          title="Active Devices"
          value={`${onlineDevices} / ${totalDevices}`}
          change={`${Math.round((onlineDevices / totalDevices) * 100)}% uptime`}
          backgroundColor="bg-white"
          onClick={() => setShowDeviceStatus(true)}
          isClickable
        />

        {/* Peak Hour Card */}
        <StatsCard
          title="Peak Hour"
          value={appData.analytics.peakHours.last7Days.hour}
          change={`${appData.analytics.peakHours.last7Days.units.toLocaleString()} units sold`}
          backgroundColor="bg-white"
        />

        {/* Alerts Card */}
        <StatsCard
          title="Alerts"
          value={appData.alerts.filter((a) => !a.resolved).length.toString()}
          change="Requires attention"
          backgroundColor="bg-white"
          onClick={() => setShowAlerts(true)}
          isClickable
        />
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 md:p-8 mt-4 md:mt-6 shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to MilkVend Dashboard</h2>
        <p className="text-blue-100 text-sm md:text-base">
          Monitor your milk ATM devices, track sales patterns, and ensure product integrity all in one place. Your
          vending network is running smoothly.
        </p>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Recent Transactions</h3>
          <button
            onClick={() => setShowTransactions(true)}
            className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
          >
            View All →
          </button>
        </div>

        <div className="space-y-2 md:space-y-3">
          {appData.transactions.slice(0, 3).map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer flex-col sm:flex-row gap-2 sm:gap-0"
              onClick={() => setShowTransactions(true)}
            >
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <p className="font-medium text-sm md:text-base text-gray-800">{txn.id}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">{txn.deviceName}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Intl.DateTimeFormat("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Africa/Nairobi",
                  }).format(new Date(txn.timestamp))}
                </p>
              </div>
              <p className="text-blue-600 font-semibold text-sm md:text-base">KES {txn.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Device Status Section */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Device Status</h3>
          <button
            onClick={() => setShowDeviceStatus(true)}
            className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
          >
            View All →
          </button>
        </div>

        <div className="space-y-2 md:space-y-3">
          {appData.devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer flex-col sm:flex-row gap-2 sm:gap-0"
              onClick={() => setShowDeviceStatus(true)}
            >
              <div className="flex-1">
                <p className="font-medium text-sm md:text-base text-gray-800">{device.id}</p>
                <p className="text-xs md:text-sm text-gray-500">Stock: {device.availableStock}L</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    device.status === "online" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span className="text-xs md:text-sm font-medium text-gray-700 capitalize">{device.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showTransactions && (
        <TransactionsList transactions={appData.transactions} onClose={() => setShowTransactions(false)} />
      )}
      {showAlerts && <AlertsList alerts={appData.alerts} onClose={() => setShowAlerts(false)} />}
      {showDeviceStatus && <DeviceStatusList devices={appData.devices} onClose={() => setShowDeviceStatus(false)} />}
    </div>
  )
}
