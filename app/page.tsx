/**
 * Main App Page
 * Root route that renders the layout with navigation and main content
 * Handles routing between different sections (Dashboard, ATM Devices, etc.)
 */

"use client"

import { useState, useEffect } from "react"
import type { AppData } from "@/lib/types"
import Sidebar from "@/components/sidebar"
import Dashboard from "@/components/pages/dashboard"
import AtmDevices from "@/components/pages/atm-devices"
import TamperDetection from "@/components/pages/tamper-detection"
import SalesAnalytics from "@/components/pages/sales-analytics"
import Price from "@/components/pages/price"
import AccountPage from "@/components/pages/account"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [appData, setAppData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Load app data from JSON file on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/app-data.json")
        const data = await response.json()
        setAppData(data)
      } catch (error) {
        console.error("Failed to load app data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUpdatePrice = (newPrice: number) => {
    if (!appData) return
    setAppData({
      ...appData,
      pricing: { pricePerLitre: newPrice },
    })
    console.log("[v0] Price updated to:", newPrice)
  }

  const handleWithdraw = (amount: number) => {
    if (!appData) return
    const newWithdrawal = {
      id: `WD_${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      amount,
      timestamp: new Date().toISOString(),
    }
    setAppData({
      ...appData,
      account: {
        balance: appData.account.balance - amount,
        withdrawals: [newWithdrawal, ...appData.account.withdrawals],
      },
    })
    console.log("[v0] Withdrawal processed:", amount)
  }

  if (loading || !appData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading Dairy Sight...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page)
          setSidebarOpen(false) // Close sidebar on mobile after navigation
        }}
        vendor={appData.vendor}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        <div className="pt-16 lg:pt-0">
          {currentPage === "dashboard" && <Dashboard appData={appData} />}
          {currentPage === "atm-devices" && <AtmDevices devices={appData.devices} />}
          {currentPage === "tamper-detection" && <TamperDetection devices={appData.devices} />}
          {currentPage === "sales-analytics" && <SalesAnalytics analytics={appData.analytics} />}
          {currentPage === "price" && <Price pricing={appData.pricing} onUpdatePrice={handleUpdatePrice} />}
          {currentPage === "account" && (
            <AccountPage account={appData.account} vendor={appData.vendor} onWithdraw={handleWithdraw} />
          )}
        </div>
      </main>
    </div>
  )
}
