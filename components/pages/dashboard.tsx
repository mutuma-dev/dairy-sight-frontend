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
import { RefreshCw } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface DashboardProps {
  appData: AppData
  vendorUpdatedTrigger?: number
}

export default function Dashboard({ appData, vendorUpdatedTrigger }: DashboardProps) {
  const [showTransactions, setShowTransactions] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showDeviceStatus, setShowDeviceStatus] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loadingVendor, setLoadingVendor] = useState(true)
  const [vendorError, setVendorError] = useState("")

  const [devices, setDevices] = useState<Device[]>([])
  const [loadingDevices, setLoadingDevices] = useState(true)
  const [deviceError, setDeviceError] = useState("")

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [transactionError, setTransactionError] = useState("")

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

  useEffect(() => {
    fetchVendor()
    fetchDevices()
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (vendorUpdatedTrigger !== undefined) {
      fetchVendor()
    }
  }, [vendorUpdatedTrigger])

  const onlineDevices = devices.filter((d) => d.status === "online").length
  const totalDevices = devices.length
  const tamperedDevices = devices.filter((d) => d.isTampered)

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* HEADER + STATS unchanged */}

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
            {devices.map((device) => {
              /**
               * -------------------------
               * IMMEDIATE DATA DETECTION
               * -------------------------
               * No assumptions.
               * Backend is authoritative.
               */
              const capacityValue = device.capacity
              const capacityPercent = Math.min((capacityValue / 100) * 100, 100)

              const capacityBarColor =
                capacityPercent >= 50
                  ? "bg-green-500"
                  : capacityPercent >= 25
                  ? "bg-yellow-400"
                  : "bg-red-500"

              return (
                <div
                  key={device.id}
                  className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer space-y-2"
                  onClick={() => setShowDeviceStatus(true)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm md:text-base text-gray-800">{device.name}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          device.status === "online" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-xs md:text-sm font-medium text-gray-700 capitalize">
                        {device.status}
                      </span>
                    </div>
                  </div>

                  {/* CAPACITY — SAME LOGIC, SMALLER UI */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Capacity</span>
                      <span>{capacityPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${capacityBarColor} transition-all duration-300`}
                        style={{ width: `${capacityPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODALS unchanged */}
      {showTransactions && (
        <TransactionsList transactions={transactions} onClose={() => setShowTransactions(false)} />
      )}
      {showAlerts && tamperedDevices.length > 0 && (
        <DeviceDetailModal device={selectedDevice!} onClose={() => setShowAlerts(false)} />
      )}
      {showDeviceStatus && (
        <DeviceStatusList devices={devices} onClose={() => setShowDeviceStatus(false)} />
      )}
    </div>
  )
}
