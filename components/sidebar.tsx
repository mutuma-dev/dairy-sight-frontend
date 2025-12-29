/**
 * Sidebar Navigation Component
 * Displays the main navigation menu with vendor info
 * Handles page navigation and menu item selection
 */

"use client"

import type { Vendor } from "@/lib/types"
import { BarChart3, Zap, Lock, LayoutDashboard, Menu } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  vendor: Vendor
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ currentPage, onPageChange, vendor, isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "atm-devices", label: "ATM Devices", icon: Zap },
    { id: "tamper-detection", label: "Tamper Detection", icon: Lock },
    { id: "sales-analytics", label: "Sales Analytics", icon: BarChart3 },
  ]

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed lg:hidden top-4 left-4 z-40 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        aria-label="Toggle menu"
      >
        <Menu size={24} strokeWidth={1.5} />
      </button>

      <aside
        className={`fixed lg:relative w-48 bg-blue-600 text-white flex flex-col transform transition-transform duration-300 ease-in-out z-40 h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-blue-500">
          <h1 className="text-lg lg:text-xl font-bold text-white">Dairy Sight</h1>
          <p className="text-blue-100 text-xs lg:text-sm mt-1">({vendor.name})</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 lg:p-4">
          <ul className="space-y-1 lg:space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
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
          <p className="text-xs text-blue-100 truncate">{vendor.shopName}</p>
        </div>
      </aside>
    </>
  )
}
