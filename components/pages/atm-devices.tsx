/**
 * ATM Devices Page Component
 * Displays a grid of ATM device cards with summary information
 * Clicking a card opens detailed view with full information
 * Data is read from app data file
 */

"use client"

import { useState } from "react"
import type { Device } from "@/lib/types"
import DeviceDetailModal from "@/components/modals/device-detail-modal"

interface AtmDevicesProps {
  devices: Device[]
}

export default function AtmDevices({ devices }: AtmDevicesProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* Header */}
      <div className="mt-12 lg:mt-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">ATM Devices</h1>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
          Manage and monitor all milk vending ATM devices
        </p>
      </div>

      {/* Devices Grid - Responsive grid for mobile and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => setSelectedDevice(device)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 md:p-4 text-white">
              <h3 className="text-base md:text-lg font-bold">{device.id}</h3>
            </div>

            {/* Card Content */}
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              {/* Available Stock */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium text-sm md:text-base">Available Stock</span>
                <span className="text-xl md:text-2xl font-bold text-blue-600">{device.availableStock}L</span>
              </div>

              {/* Device Status */}
              <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-200">
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

              {/* Click to View More */}
              <div className="pt-3 md:pt-4 text-center">
                <p className="text-xs md:text-sm text-blue-600 font-medium">Click to view full details →</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Device Detail Modal */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
    </div>
  )
}
