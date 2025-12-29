/**
 * Tamper Detection Page Component
 * Displays ATM devices that have been flagged as tampered
 * Uses the same card component and structure as ATM Devices for consistency
 * Data is read from app data file and filtered for tampered devices
 */

"use client"

import { useState } from "react"
import type { Device } from "@/lib/types"
import DeviceDetailModal from "@/components/modals/device-detail-modal"

interface TamperDetectionProps {
  devices: Device[]
}

export default function TamperDetection({ devices }: TamperDetectionProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  const tamperedDevices = devices.filter((device) => device.isTampered)

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* Header */}
      <div className="mt-14 lg:mt-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Tamper Detection</h1>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Monitor devices flagged for tampering</p>
      </div>

      {/* Tampered Devices Count */}
      {tamperedDevices.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 rounded text-sm md:text-base shadow-sm">
          <p className="text-red-700 font-semibold">{tamperedDevices.length} device(s) flagged for tampering</p>
        </div>
      )}

      {/* Devices Grid - Responsive grid for mobile and desktop */}
      {tamperedDevices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {tamperedDevices.map((device) => (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-2 border-red-200"
            >
              {/* Card Header - Red for tampered */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 md:p-4 text-white">
                <h3 className="text-base md:text-lg font-bold">{device.id}</h3>
              </div>

              {/* Card Content */}
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Device Status */}
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

                {/* Click to View More */}
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
      )}

      {/* Device Detail Modal */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
    </div>
  )
}
