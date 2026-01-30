/**
 * ATM Devices Page Component
 * -------------------------
 * - Fetches devices from backend API
 * - Adds new devices via POST request
 * - Shows modern inline notifications
 * - Automatically refreshes device list after adding
 * - Shows loading spinner while fetching devices
 * - Backend URL is centralized for easy move to env file
 */

"use client"

import { useState, useEffect, useRef } from "react"
import type { Device } from "@/lib/types"
import DeviceDetailModal from "@/components/modals/device-detail-modal"

// Backend base URL (replace with env variable later)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/devices"

export default function AtmDevices() {
  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDevice, setNewDevice] = useState({ id: "", name: "", status: "online" })
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false) // Loading state

  // 🆕 Keep previous data reference for comparison
  const previousDataRef = useRef<string>("")

  /**
   * Fetch devices from backend
   */
  const fetchDevices = async () => {
    setLoading(true) // Start loading
    try {
      const res = await fetch(BACKEND_URL)
      if (!res.ok) throw new Error("Failed to fetch devices")
      const data: Device[] = await res.json()
      setDeviceList(data)
      previousDataRef.current = JSON.stringify(data)
    } catch (error) {
      console.error("Error fetching devices:", error)
      showNotification("error", "Failed to load devices from backend.")
    } finally {
      setLoading(false) // Stop loading
    }
  }

  /**
   * 🆕 Silent background refresh (NO loading, NO flicker)
   * Only updates state if backend data actually changed
   */
  const fetchDevicesSilently = async () => {
    try {
      const res = await fetch(BACKEND_URL)
      if (!res.ok) return

      const data: Device[] = await res.json()
      const serialized = JSON.stringify(data)

      if (serialized !== previousDataRef.current) {
        previousDataRef.current = serialized
        setDeviceList(data)
      }
    } catch {
      // Silent failure (no UI disturbance)
    }
  }

  // Fetch devices on mount
  useEffect(() => {
    fetchDevices()
  }, [])

  /**
   * 🆕 Background polling for real-time updates
   */
  useEffect(() => {
    const interval = setInterval(fetchDevicesSilently, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (field: string, value: string) => {
    setNewDevice({ ...newDevice, [field]: value })
  }

  const handleStatusToggle = () => {
    setNewDevice({ ...newDevice, status: newDevice.status === "online" ? "offline" : "online" })
  }

  /**
   * Show notification banner
   */
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  /**
   * Add a new device via backend POST request
   * After successful add, re-fetch device list from backend
   */
  const handleAddDevice = async () => {
    if (!newDevice.id.trim() || !newDevice.name.trim()) {
      showNotification("error", "Please fill in all fields.")
      return
    }

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDevice),
      })

      const data = await res.json()

      if (!res.ok) {
        showNotification("error", data.error || "Failed to add device")
        return
      }

      // Success → clear form, close modal, notify user
      setNewDevice({ id: "", name: "", status: "online" })
      setShowAddModal(false)
      showNotification("success", data.message || "Device added successfully")

      // Re-fetch devices from backend to update list
      fetchDevices()
    } catch (error) {
      console.error("Error adding device:", error)
      showNotification("error", "Failed to add device. Check backend connection.")
    }
  }

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
      <div className="flex justify-between items-start mt-14 lg:mt-0">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">ATM Devices</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Manage and monitor all milk vending ATM devices
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm md:text-base hover:bg-blue-700 transition"
        >
          + Add Device
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-700">Loading devices...</span>
        </div>
      )}

      {/* Devices Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {deviceList.map((device) => (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 md:p-4 text-white">
                <h3 className="text-base md:text-lg font-bold">{device.name}</h3>
              </div>
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
                  <p className="text-xs md:text-sm text-blue-600 font-medium">Click to view full details →</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Device Detail Modal */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Add New Device</h2>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Device ID</label>
              <input
                type="text"
                value={newDevice.id}
                onChange={(e) => handleChange("id", e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Device Name</label>
              <input
                type="text"
                value={newDevice.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
