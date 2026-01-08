/**
 * Tamper Detection Page Component
 * -------------------------------
 * - Fetches all devices from backend API
 * - Filters only tampered devices (isTampered === true)
 * - Auto-refreshes every 10 seconds
 * - Shows last refreshed timestamp and optional manual refresh button
 * - Shows loading spinner while fetching
 * - Displays notifications on errors
 * - Clicking a card opens full device details modal
 */

"use client"

import { useState, useEffect } from "react"
import type { Device } from "@/lib/types"
import DeviceDetailModal from "@/components/modals/device-detail-modal"
import { RefreshCw } from "lucide-react" // using lucide-react for refresh icon

// Backend base URL (move to env later)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/devices"

export default function TamperDetection() {
  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null)

  // Filter tampered devices
  const tamperedDevices = deviceList.filter((device) => device.isTampered)

  /**
   * Show notification banner
   */
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  /**
   * Fetch all devices from backend
   */
  const fetchDevices = async () => {
    setLoading(true)
    try {
      const res = await fetch(BACKEND_URL)
      if (!res.ok) throw new Error("Failed to fetch devices")
      const data: Device[] = await res.json()
      setDeviceList(data)
      setLastRefreshed(new Date().toLocaleTimeString()) // update timestamp
    } catch (error) {
      console.error("Error fetching devices:", error)
      showNotification("error", "Failed to load devices from backend.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch devices on mount and set auto-refresh
  useEffect(() => {
    fetchDevices()

    const interval = setInterval(() => {
      fetchDevices()
    }, 10000) // auto-refresh every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white z-50 transition-opacity ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mt-14 lg:mt-0">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Tamper Detection</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Monitor devices flagged for tampering</p>
        </div>

        {/* Last Refreshed & Manual Refresh */}
        <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
          {lastRefreshed && <span>Last refreshed: {lastRefreshed}</span>}
          <button
            onClick={fetchDevices}
            className="p-1 hover:text-gray-800 transition"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Tampered Devices Count */}
      {tamperedDevices.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 rounded text-sm md:text-base shadow-sm">
          <p className="text-red-700 font-semibold">{tamperedDevices.length} device(s) flagged for tampering</p>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-red-600 border-dashed rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-700">Loading devices...</span>
        </div>
      )}

      {/* Devices Grid */}
      {!loading && (tamperedDevices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {tamperedDevices.map((device) => (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-2 border-red-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 md:p-4 text-white">
                <h3 className="text-base md:text-lg font-bold">{device.id}</h3>
              </div>

              {/* Card Content */}
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium text-sm md:text-base">Device Status</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        device.status === "online" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-xs md:text-sm font-semibold text-gray-700 capitalize">{device.status}</span>
                  </div>
                </div>
                <div className="pt-3 md:pt-4 text-center">
                  <p className="text-xs md:text-sm text-red-600 font-medium">Click to view full details →</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base md:text-lg">No tampered devices detected</p>
        </div>
      ))}

      {/* Device Detail Modal */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
    </div>
  )
}

