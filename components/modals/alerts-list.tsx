/**
 * Alerts List Modal Component
 * Displays all system alerts for offline devices
 * Shows device ID, stock, capacity, and status
 * Fully responsive for mobile and desktop screens
 */

"use client"

import type { Alert } from "@/lib/types"

interface AlertsListProps {
  alerts: Alert[]
  onClose: () => void
}

export default function AlertsList({ alerts, onClose }: AlertsListProps) {
  const unresolvedAlerts = alerts.filter((a) => !a.resolved)

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400/20 via-blue-200/15 to-blue-300/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 md:p-6 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">System Alerts</h2>
            <p className="text-red-100 text-xs md:text-sm mt-1">{unresolvedAlerts.length} unresolved alert(s)</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-700 p-2 rounded-lg transition flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto flex-1">
          {unresolvedAlerts.length > 0 ? (
            <div className="space-y-2 md:space-y-3 p-4 md:p-6">
              {unresolvedAlerts.map((alert) => (
                <div
                  key={alert.deviceName}
                  className="border-l-4 border-red-500 bg-red-50 rounded-lg p-3 md:p-4 hover:bg-red-100 transition"
                >
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-3 flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <p className="font-bold text-sm md:text-base text-gray-800">{alert.deviceName}</p>
                      <p className="text-xs md:text-sm text-gray-600">Device Offline</p>
                    </div>
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                        alert.severity === "critical" ? "bg-red-600 text-white" : "bg-yellow-600 text-white"
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>

                  {/* Alert Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm bg-white rounded-lg p-3 mb-3">
                    {/* Device ID */}
                    <div>
                      <p className="text-gray-600 font-medium">Device ID</p>
                      <p className="text-gray-800 font-semibold text-xs md:text-sm">{alert.deviceId}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-gray-600 font-medium">Status</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            alert.status === "online" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        <p className="text-gray-800 font-semibold capitalize text-xs md:text-sm">{alert.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500">
                    Reported:{" "}
                    {new Intl.DateTimeFormat("en-KE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Africa/Nairobi",
                    }).format(new Date(alert.timestamp))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 md:p-12 text-center">
              <p className="text-gray-500 text-base md:text-lg">No active alerts</p>
              <p className="text-gray-400 mt-2 text-sm md:text-base">All systems operating normally</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white rounded-lg font-medium py-2 hover:bg-red-700 transition text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
