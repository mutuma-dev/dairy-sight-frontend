/**
 * Dashboard Page Component
 * ------------------------
 * Displays key metrics: Total Sales, Active Devices, Peak Hour, Alerts
 * Alerts now read directly from tampered devices (same source as TamperDetection)
 * No flicker, no duplicate fetches, same backend, same data
 */

"use client"

import { useState, useEffect, useMemo } from "react"
import type { AppData, Device, Transaction, Vendor } from "@/lib/types"
import StatsCard from "@/components/cards/stats-card"
import TransactionsList from "@/components/modals/transactions-list"
import DeviceStatusList from "@/components/modals/device-status-list"
import DeviceDetailModal from "@/components/modals/device-detail-modal" // reused modal
import { RefreshCw } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface DashboardProps {
  appData: AppData
  vendorUpdatedTrigger?: number
}

export default function Dashboard({ appData, vendorUpdatedTrigger }: DashboardProps) {
  // Modal states
  const [showTransactions, setShowTransactions] = useState(false)
  const [showDeviceStatus, setShowDeviceStatus] = useState(false)

  // NEW: Selected tampered device modal (same as TamperDetection)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Vendor state
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loadingVendor, setLoadingVendor] = useState(true)
  const [vendorError, setVendorError] = useState("")

  // Devices state (SINGLE SOURCE OF TRUTH)
  const [devices, setDevices] = useState<Device[]>([])
  const [loadingDevices, setLoadingDevices] = useState(true)
  const [deviceError, setDeviceError] = useState("")

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [transactionError, setTransactionError] = useState("")

  /** Fetch vendor */
  const fetchVendor = async () => {
    setLoadingVendor(true)
    setVendorError("")
    try {
      const res = await fetch(`${BACKEND_URL}/api/vendor`)
      if (!res.ok) throw new Error("Failed to fetch vendor")
      setVendor(await res.json())
    } catch (err: any) {
      setVendorError(err.message || "Vendor error")
    } finally {
      setLoadingVendor(false)
    }
  }

  /** Fetch devices (used by Device Status AND Alerts) */
  const fetchDevices = async () => {
    setLoadingDevices(true)
    setDeviceError("")
    try {
      const res = await fetch(`${BACKEND_URL}/api/devices`)
      if (!res.ok) throw new Error("Failed to fetch devices")
      setDevices(await res.json())
    } catch (err: any) {
      setDeviceError(err.message || "Device error")
    } finally {
      setLoadingDevices(false)
    }
  }

  /** Fetch transactions */
  const fetchTransactions = async () => {
    setLoadingTransactions(true)
    setTransactionError("")
    try {
      const res = await fetch(`${BACKEND_URL}/api/transactions`)
      if (!res.ok) throw new Error("Failed to fetch transactions")
      setTransactions(await res.json())
    } catch (err: any) {
      setTransactionError(err.message || "Transaction error")
    } finally {
      setLoadingTransactions(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchVendor()
    fetchDevices()
    fetchTransactions()
  }, [])

  // Vendor refresh trigger
  useEffect(() => {
    if (vendorUpdatedTrigger !== undefined) {
      fetchVendor()
    }
  }, [vendorUpdatedTrigger])

  /** 
   * DERIVED DATA
   * Same logic as TamperDetection — ZERO duplication
   */
  const tamperedDevices = useMemo(
    () => devices.filter((d) => d.isTampered),
    [devices]
  )

  const onlineDevices = devices.filter((d) => d.status === "online").length

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-12 lg:mt-0 gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border">
          {loadingVendor ? (
            "Loading vendor..."
          ) : vendor ? (
            <>
              <strong>Vendor:</strong> {vendor.name} | <strong>ID:</strong> {vendor.id}
            </>
          ) : (
            <span className="text-red-500">{vendorError}</span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <StatsCard
          title="Total Sales (This Week)"
          value={`KES ${(appData.analytics.totalLitres.last7Days * appData.pricing.pricePerLitre).toLocaleString()}`}
          change="+12.5%"
        />

        <StatsCard
          title="Active Devices"
          value={loadingDevices ? "..." : `${onlineDevices} / ${devices.length}`}
          change={loadingDevices ? "" : `${Math.round((onlineDevices / devices.length) * 100)}% uptime`}
          onClick={() => setShowDeviceStatus(true)}
          isClickable
        />

        <StatsCard
          title="Peak Hour"
          value={appData.analytics.peakHours.last7Days.hour}
          change={`${appData.analytics.peakHours.last7Days.litres.toLocaleString()} litres sold`}
        />

        {/* 🔴 ALERTS — NOW POWERED BY TAMPERED DEVICES */}
        <StatsCard
          title="Alerts"
          value={tamperedDevices.length.toString()} // EXACT SAME COUNT AS TAMPER PAGE
          change="Tampered devices detected"
          isClickable
          onClick={() => {
            // Open first tampered device (same behavior as TamperDetection cards)
            if (tamperedDevices.length > 0) {
              setSelectedDevice(tamperedDevices[0])
            }
          }}
        />
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Recent Transactions</h3>
          <RefreshCw className="w-4 h-4 cursor-pointer" onClick={fetchTransactions} />
        </div>
        {loadingTransactions ? "Loading..." : transactions.slice(0, 3).map((t) => (
          <div key={t.id}>{t.id}</div>
        ))}
      </div>

      {/* Device Status */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Device Status</h3>
          <RefreshCw className="w-4 h-4 cursor-pointer" onClick={fetchDevices} />
        </div>
        {loadingDevices ? "Loading..." : devices.map((d) => (
          <div key={d.id}>{d.name}</div>
        ))}
      </div>

      {/* Modals */}
      {showTransactions && (
        <TransactionsList transactions={transactions} onClose={() => setShowTransactions(false)} />
      )}

      {showDeviceStatus && (
        <DeviceStatusList devices={devices} onClose={() => setShowDeviceStatus(false)} />
      )}

      {/* SAME MODAL AS TAMPER PAGE */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
    </div>
  )
}
