/**
 * Dashboard Page Component
 * ------------------------
 * Displays key metrics: Total Sales, Active Devices, Peak Hour, Alerts
 * Fetches devices, recent transactions, and vendor details from backend
 * Supports manual refresh for devices, transactions, and vendor details
 * Vendor details automatically update if edited in Account component
 * Fully responsive design for mobile and desktop
 */

"use client"

import { useState, useEffect } from "react"
import type { AppData, Device, Transaction, Vendor } from "@/lib/types"
import StatsCard from "@/components/cards/stats-card"
import TransactionsList from "@/components/modals/transactions-list"
import AlertsList from "@/components/modals/alerts-list"
import DeviceStatusList from "@/components/modals/device-status-list"
import DeviceDetailModal from "@/components/modals/device-detail-modal"
import { RefreshCw } from "lucide-react" // subtle refresh icon

// Backend base URL (replace with env variable later)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface DashboardProps {
  appData: AppData // static data for analytics, alerts, pricing, etc.
  vendorUpdatedTrigger?: number // incremented whenever vendor is edited
}

export default function Dashboard({ appData, vendorUpdatedTrigger }: DashboardProps) {
  // Modal states
  const [showTransactions, setShowTransactions] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showDeviceStatus, setShowDeviceStatus] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Vendor state
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loadingVendor, setLoadingVendor] = useState(true)
  const [vendorError, setVendorError] = useState("")

  // Devices state
  const [devices, setDevices] = useState<Device[]>([])
  const [loadingDevices, setLoadingDevices] = useState(true)
  const [deviceError, setDeviceError] = useState("")

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [transactionError, setTransactionError] = useState("")

  /** Fetch vendor details from backend */
  const fetchVendor = async () => {
    setLoadingVendor(true)
    setVendorError("")
    try {
      const res = await fetch(`${BACKEND_URL}/api/vendor`)
      if (!res.ok) throw new Error("Failed to fetch vendor details")
      const data: Vendor = await res.json()
      setVendor(data)
    } catch (err: any) {
      setVendorError(err.message || "Unknown error fetching vendor")
    } finally {
      setLoadingVendor(false)
    }
  }

  /** Fetch devices from backend */
  const fetchDevices = async () => {
    setLoadingDevices(true)
    setDeviceError("")
    try {
      const res = await fetch(`${BACKEND_URL}/api/devices`)
      if (!res.ok) throw new Error("Failed to fetch devices")
      const data = await res.json()
      setDevices(data)
    } catch (err: any) {
      setDeviceError(err.message || "Unknown error")
    } finally {
      setLoadingDevices(false)
    }
  }

  /** Fetch transactions from backend */
  const fetchTransactions = async () => {
    setLoadingTransactions(true)
    setTransactionError("")
    try {
      const res = await fetch(`${BACKEND_URL}/api/transactions`)
      if (!res.ok) throw new Error("Failed to fetch transactions")
      const data = await res.json()
      setTransactions(data)
    } catch (err: any) {
      setTransactionError(err.message || "Unknown error")
    } finally {
      setLoadingTransactions(false)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchVendor()
    fetchDevices()
    fetchTransactions()
  }, [])

  // Re-fetch vendor whenever the Account component edits it
  useEffect(() => {
    if (vendorUpdatedTrigger !== undefined) {
      fetchVendor()
    }
  }, [vendorUpdatedTrigger])

  // Derived stats
  const onlineDevices = devices.filter((d) => d.status === "online").length
  const totalDevices = devices.length

  // Tampered devices for alerts
  const tamperedDevices = devices.filter((d) => d.isTampered)

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-12 lg:mt-0 gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 self-start flex items-center gap-2">
          {loadingVendor ? (
            <span>Loading vendor...</span>
          ) : vendor ? (
            <>
              <span className="font-semibold">Vendor:</span> {vendor.name}
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold">ID:</span> {vendor.id}
            </>
          ) : (
            <span className="text-red-500">{vendorError || "Vendor not found"}</span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <StatsCard
          title="Total Sales (This Week)"
          value={`KES ${(appData.analytics.totalLitres.last7Days * appData.pricing.pricePerLitre).toLocaleString()}`}
          change="+12.5%"
          backgroundColor="bg-white"
        />
        <StatsCard
          title="Active Devices"
          value={loadingDevices ? "..." : `${onlineDevices} / ${totalDevices}`}
          change={loadingDevices ? "" : `${Math.round((onlineDevices / totalDevices) * 100)}% uptime`}
          backgroundColor="bg-white"
          onClick={() => setShowDeviceStatus(true)}
          isClickable
        />
        <StatsCard
          title="Peak Hour"
          value={appData.analytics.peakHours.last7Days.hour}
          change={`${appData.analytics.peakHours.last7Days.litres.toLocaleString()} litres sold`}
          backgroundColor="bg-white"
        />
        {/* Alerts Card - UPDATED */}
        <StatsCard
          title="Alerts"
          value={loadingDevices ? "..." : tamperedDevices.length.toString()}
          change="Devices flagged for tampering"
          backgroundColor="bg-white"
          onClick={() => {
            // Open a modal that shows the tampered devices exactly like TamperDetection page
            if (tamperedDevices.length > 0) setSelectedDevice(tamperedDevices[0])
            setShowAlerts(true)
          }}
          isClickable
        />
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 md:p-8 mt-4 md:mt-6 shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to MilkVend Dashboard</h2>
        <p className="text-blue-100 text-sm md:text-base">
          Monitor your milk ATM devices, track sales patterns, and ensure product integrity all in one place. Your vending network is running smoothly.
        </p>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
            Recent Transactions
            <RefreshCw
              className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={fetchTransactions}
            />
          </h3>
          <button
            onClick={() => setShowTransactions(true)}
            className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
          >
            View All →
          </button>
        </div>

        {loadingTransactions ? (
          <p className="text-gray-500 text-sm md:text-base">Loading transactions...</p>
        ) : transactionError ? (
          <p className="text-red-500 text-sm md:text-base">{transactionError}</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">No transactions found</p>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {transactions.slice(0, 3).map((txn) => (
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
        )}
      </div>

      {/* Device Status */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
            Device Status
            <RefreshCw
              className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={fetchDevices}
            />
          </h3>
          <button
            onClick={() => setShowDeviceStatus(true)}
            className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
          >
            View All →
          </button>
        </div>

        {loadingDevices ? (
          <p className="text-gray-500 text-sm md:text-base">Loading devices...</p>
        ) : deviceError ? (
          <p className="text-red-500 text-sm md:text-base">{deviceError}</p>
        ) : devices.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">No devices found</p>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer flex-col sm:flex-row gap-2 sm:gap-0"
                onClick={() => setShowDeviceStatus(true)}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base text-gray-800">{device.name}</p>
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
        )}
      </div>

      {/* Modals */}
      {showTransactions && (
        <TransactionsList transactions={transactions} onClose={() => setShowTransactions(false)} />
      )}
      {showAlerts && tamperedDevices.length > 0 && (
        <DeviceDetailModal
          device={selectedDevice!}
          onClose={() => setShowAlerts(false)}
        />
      )}
      {showDeviceStatus && <DeviceStatusList devices={devices} onClose={() => setShowDeviceStatus(false)} />}
    </div>
  )
}
