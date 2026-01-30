/**
 * Device Status List Modal Component
 * Displays all devices with their current status in a detailed view
 * Shows device ID, stock, capacity, and online/offline status
 * Opened from the dashboard Active Devices card
 * Fully responsive for mobile and desktop screens
 */

"use client"

import { useEffect, useRef, useState } from "react"
import type { Device } from "@/lib/types"

// Backend base URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/devices"

interface DeviceStatusListProps {
  devices: Device[]
  onClose: () => void
}

export default function DeviceStatusList({ devices, onClose }: DeviceStatusListProps) {
  // 🆕 Local live devices state
  const [liveDevices, setLiveDevices] = useState<Device[]>(devices)

  // 🆕 Previous payload reference to avoid unnecessary re-renders
  const previousDataRef = useRef<string>("")

  /**
   * 🆕 Silent background refresh for all devices
   * Updates UI instantly if backend values change
   */
  const fetchDevicesSilently = async () => {
    try {
      const res = await fetch(BACKEND_URL)
      if (!res.ok) return

      const data: Device[] = await res.json()
      const serialized = JSON.stringify(data)

      if (serialized !== previousDataRef.current) {
        previousDataRef.current = serialized
        setLiveDevices(data)
      }
    } catch {
      // Silent failure (no UI disturbance)
    }
  }

  /**
   * 🆕 Start background polling while modal is open
   */
  useEffect(() => {
    previousDataRef.current = JSON.stringify(devices)
    setLiveDevices(devices)

    const interval = setInterval(fetchDevicesSilently, 3000)
    return () => clearInterval(interval)
  }, [devices])

  const onlineCount = liveDevices.filter((d) => d.status === "online").length
  const offlineCount = liveDevices.filter((d) => d.status === "offline").length

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400/20 via-blue-200/15 to-blue-300/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 md:p-6 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">All Devices</h2>
            <p className="text-blue-100 text-xs md:text-sm mt-1">
              {onlineCount} online • {offlineCount} offline
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Devices List */}
        <div className="overflow-y-auto flex-1">
          <div className="space-y-2 md:space-y-3 p-4 md:p-6">
            {liveDevices.map((device) => {
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
                  className={`border-l-4 rounded-lg p-3 md:p-4 transition ${
                    device.status === "online"
                      ? "border-l-green-500 bg-green-50 hover:bg-green-100"
                      : "border-l-red-500 bg-red-50 hover:bg-red-100"
                  }`}
                >
                  {/* Device Header */}
                  <div className="flex items-start justify-between mb-3 flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <p className="font-bold text-sm md:text-base text-gray-800">{device.name}</p>
                      <p className="text-xs md:text-sm text-gray-600">{device.id}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          device.status === "online" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          device.status === "online"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {device.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Device Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs md:text-sm bg-white rounded-lg p-3">
                    {/* Device ID */}
                    <div>
                      <p className="text-gray-600 font-medium">Device ID</p>
                      <p className="text-gray-800 font-semibold">{device.id}</p>
                    </div>

                    {/* Device Status */}
                    <div>
                      <p className="text-gray-600 font-medium">Current Status</p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            device.status === "online" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        <p className="text-gray-800 font-semibold capitalize">{device.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Capacity (IDENTICAL behavior & styling) */}
                  <div className="mt-3 bg-white rounded-lg p-3">
                    <p className="text-gray-600 text-xs md:text-sm font-medium mb-2">Capacity</p>

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm md:text-base font-semibold text-gray-800">
                        {capacityValue.toFixed(2)} L
                      </span>
                      <span className="text-xs text-gray-500">
                        {capacityPercent.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${capacityBarColor} rounded-full transition-all duration-300`}
                        style={{ width: `${capacityPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <p className="text-xs text-gray-500 mt-3">
                    Last updated:{" "}
                    {new Intl.DateTimeFormat("en-KE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Africa/Nairobi",
                    }).format(new Date(device.lastUpdated))}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white rounded-lg font-medium py-2 hover:bg-blue-700 transition text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
