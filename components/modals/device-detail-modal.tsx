"use client"

/**
 * Device Detail Modal Component
 * Displays full information about a device when clicked from the device list
 * Shows all device properties: ID, available stock, capacity, and status
 * Can be used for both ATM Devices and Tamper Detection pages
 */

import type { Device } from "@/lib/types"

interface DeviceDetailModalProps {
  device: Device
  onClose: () => void
}

export default function DeviceDetailModal({ device, onClose }: DeviceDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400/20 via-blue-200/15 to-blue-300/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 md:p-6 text-white flex justify-between items-start sticky top-0">
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold">{device.id}</h2>
            <p className="text-blue-100 mt-1 text-xs md:text-sm truncate">{device.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-1 rounded transition flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Available Stock */}
          <div className="bg-blue-50 rounded-lg p-3 md:p-4">
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Available Stock</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{device.availableStock} L</p>
          </div>

          {/* Capacity */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4">
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Capacity</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{device.capacity} L</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full"
                style={{ width: `${(device.availableStock / device.capacity) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((device.availableStock / device.capacity) * 100)}% filled
            </p>
          </div>

          {/* Device Status */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4">
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-2">Device Status</p>
            <div className="flex items-center gap-3">
              <span
                className={`inline-block w-4 h-4 rounded-full ${
                  device.status === "online" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span className="text-base md:text-lg font-semibold text-gray-800 capitalize">{device.status}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs md:text-sm text-gray-500 border-t pt-4">
            <p>
              Last Updated:{" "}
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
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t flex gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white rounded-lg font-medium py-2 hover:bg-blue-700 transition text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
