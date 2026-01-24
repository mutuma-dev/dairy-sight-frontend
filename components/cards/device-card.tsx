"use client"

/**
 * Device Card Component
 * Reusable card component for displaying device information
 * Used in ATM Devices and Tamper Detection pages
 * Shows device ID, available stock, and status
 */

import type { Device } from "@/lib/types"

interface DeviceCardProps {
  device: Device
  onClick?: () => void
  variant?: "default" | "tampered"
}

export default function DeviceCard({ device, onClick, variant = "default" }: DeviceCardProps) {
  const isTampered = variant === "tampered" || device.isTampered

  return (
    <div
      onClick={onClick}
      className={`rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden bg-white ${
        isTampered ? "border-2 border-red-200" : ""
      }`}
    >
      {/* Card Header */}
      <div
        className={`${
          isTampered ? "bg-gradient-to-r from-red-600 to-red-500" : "bg-gradient-to-r from-blue-600 to-blue-500"
        } p-4 text-white`}
      >
        <h3 className="text-lg font-bold">{device.name}</h3>
        {isTampered && <p className="text-red-100 text-sm mt-1">Tampered Alert</p>}
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Device Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Device Status</span>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                device.status === "online" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm font-semibold text-gray-700 capitalize">{device.status}</span>
          </div>
        </div>

        {/* Click Hint */}
        <div className="pt-4 text-center">
          <p className={`text-xs font-medium ${isTampered ? "text-red-600" : "text-blue-600"}`}>
            Click to view full details →
          </p>
        </div>
      </div>
    </div>
  )
}
