/**
 * ATM Devices Page Component
 * Displays a grid of ATM device cards with summary information
 * Clicking a card opens detailed view with full information
 * Allows adding new devices via a modal form
 */

"use client"

import { useState } from "react"
import type { Device } from "@/lib/types"
import DeviceDetailModal from "@/components/modals/device-detail-modal"

interface AtmDevicesProps {
  devices: Device[]
}

export default function AtmDevices({ devices }: AtmDevicesProps) {
  const [deviceList, setDeviceList] = useState<Device[]>(devices)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDevice, setNewDevice] = useState({ id: "", name: "", status: "online" })

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setNewDevice({ ...newDevice, [field]: value })
  }

  // Handle checkbox toggle
  const handleStatusToggle = () => {
    setNewDevice({ ...newDevice, status: newDevice.status === "online" ? "offline" : "online" })
  }

  // Add new device
  const handleAddDevice = () => {
    if (!newDevice.id.trim() || !newDevice.name.trim()) {
      alert("Please fill in all fields.")
      return
    }

    const exists = deviceList.find((d) => d.id === newDevice.id.trim())
    if (exists) {
      alert("A device with this ID already exists.")
      return
    }

    setDeviceList([...deviceList, { ...newDevice }])
    setNewDevice({ id: "", name: "", status: "online" })
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 lg:pt-6">
      {/* Header */}
      <div className="flex justify-between items-start mt-14 lg:mt-0">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">ATM Devices</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Manage and monitor all milk vending ATM devices
          </p>
        </div>

        {/* Add Device Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm md:text-base hover:bg-blue-700 transition"
        >
          + Add Device
        </button>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {deviceList.map((device) => (
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
                <p className="text-xs md:text-sm text-blue-600 font-medium">Click to view full details →</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Device Detail Modal */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Add New Device</h2>

            {/* Device ID */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Device ID</label>
              <input
                type="text"
                value={newDevice.id}
                onChange={(e) => handleChange("id", e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Device Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Device Name</label>
              <input
                type="text"
                value={newDevice.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Checkbox */}
            <div className="flex items-center gap-3">
              <label className="text-gray-700 text-sm">Status:</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newDevice.status === "online"}
                  onChange={handleStatusToggle}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 text-sm">Online</span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

