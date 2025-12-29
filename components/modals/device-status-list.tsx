/**
 * Device Status List Modal Component
 * Displays all devices with their current status in a detailed view
 * Shows device ID, stock, capacity, and online/offline status
 * Opened from the dashboard Active Devices card
 * Fully responsive for mobile and desktop screens
 */

"use client"

import type { Device } from "@/lib/types"

interface DeviceStatusListProps {
  devices: Device[]
  onClose: () => void
}

export default function DeviceStatusList({ devices, onClose }: DeviceStatusListProps) {
  const onlineCount = devices.filter((d) => d.status === "online").length
  const offlineCount = devices.filter((d) => d.status === "offline").length

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
            {devices.map((device) => (
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
                    <p className="font-bold text-sm md:text-base text-gray-800">{device.id}</p>
                    <p className="text-xs md:text-sm text-gray-600">{device.name}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        device.status === "online" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        device.status === "online" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {device.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Device Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm bg-white rounded-lg p-3">
                  {/* Device ID */}
                  <div>
                    <p className="text-gray-600 font-medium">Device ID</p>
                    <p className="text-gray-800 font-semibold text-xs md:text-sm">{device.id}</p>
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
            ))}
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
