/**
 * Sidebar Navigation Component
 * ----------------------------
 * Displays the main navigation menu with vendor info
 * Fetches vendor details from the backend
 * Vendor info refreshes automatically when updated from Account component
 * Handles page navigation and mobile menu toggle
 * Fully responsive with collapsible mobile sidebar
 */

"use client"

import { useState, useEffect } from "react"
import type { Vendor } from "@/lib/types"
import { BarChart3, Zap, Lock, LayoutDashboard, Menu, DollarSign, Wallet, RefreshCw } from "lucide-react"

// Backend URL (replace with env variable later)
const BACKEND_URL = "https://40ed9b23-ce6c-4865-9ea7-673fc391e9ac-00-1earrmirya0dv.picard.replit.dev"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onToggle: () => void
  vendorUpdatedTrigger?: number // increments when vendor details edited
}

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle, vendorUpdatedTrigger }: SidebarProps) {
  // Local vendor state
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loadingVendor, setLoadingVendor] = useState(true)
  const [vendorError, setVendorError] = useState("")

  /** Fetch vendor details from backend */
  const fetchVendor = async () => {
    setLoadingVendor(true)
    setVendorError("")
    try {
      const res = await fetch(`${BACKEND_URL}/api/vendor`)
      if (!res.ok) throw new Error("Failed to fetch vendor details")
      const data: Vendor = await res.json()
      setVendor(data)
    } catch (err: any) {
      setVendorError(err.message || "Unknown error fetching vendor")
    } finally {
      setLoadingVendor(false)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchVendor()
  }, [])

  // Re-fetch vendor when Account component triggers update
  useEffect(() => {
    if (vendorUpdatedTrigger !== undefined) {
      fetchVendor()
    }
  }, [vendorUpdatedTrigger])

  // Navigation menu items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "atm-devices", label: "ATM Devices", icon: Zap },
    { id: "tamper-detection", label: "Tamper Detection", icon: Lock },
    { id: "sales-analytics", label: "Sales Analytics", icon: BarChart3 },
    { id: "price", label: "Price", icon: DollarSign },
    { id: "account", label: "Account", icon: Wallet },
  ]

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed lg:hidden top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
        aria-label="Toggle menu"
      >
        <Menu size={24} strokeWidth={1.5} />
      </button>

      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-56 bg-blue-600 text-white flex flex-col transform transition-transform duration-300 ease-in-out z-40 h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-blue-500">
          <h1 className="text-lg lg:text-xl font-bold text-white">Dairy Sight</h1>

          {/* Vendor details */}
          <div className="mt-2 space-y-1 flex items-center justify-between">
            {loadingVendor ? (
              <span className="text-blue-100 text-xs">Loading vendor...</span>
            ) : vendor ? (
              <div className="flex-1 space-y-1">
                <p className="text-blue-100 text-xs">
                  <span className="font-semibold">Vendor Name:</span> {vendor.name}
                </p>
                <p className="text-blue-100 text-xs">
                  <span className="font-semibold">Vendor ID:</span> {vendor.id}
                </p>
              </div>
            ) : (
              <span className="text-red-500 text-xs">{vendorError || "Vendor not found"}</span>
            )}

            {/* Manual refresh icon */}
            <RefreshCw
              className="w-4 h-4 text-blue-100 hover:text-white cursor-pointer ml-2"
              onClick={fetchVendor}
              title="Refresh vendor"
            />
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <ul className="space-y-1 lg:space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onPageChange(item.id)
                      onToggle()
                    }}
                    className={`w-full text-left px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 lg:gap-3 text-sm lg:text-base ${
                      currentPage === item.id ? "bg-green-500 text-white" : "text-blue-100 hover:bg-blue-500"
                    }`}
                  >
                    <IconComponent size={18} strokeWidth={1.5} />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-blue-500">
          <p className="text-xs text-blue-100 truncate">{vendor?.shopName || "..."}</p>
        </div>
      </aside>
    </>
  )
}

