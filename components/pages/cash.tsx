"use client"

/**
 * Cash Payments Component
 * -----------------------
 * - Fetches cash payment records from backend
 * - Displays payments in a responsive table
 * - Formats timestamp into readable date & time
 * - Maintains app theme, UI components, and styling
 */

import { useEffect, useState } from "react"
import { Banknote } from "lucide-react"
import { Card } from "@/components/ui/card"

// Shape of a cash payment record
interface CashPayment {
  id: string
  amount: number
  mac_address: string
  timestamp: string
}

export default function Cash() {
  // State management
  const [cashPayments, setCashPayments] = useState<CashPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API base URL from env
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + "/api"

  // Fetch cash payments
  const fetchCashPayments = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/account/cash`)
      if (!res.ok) throw new Error("Failed to fetch cash payments")
      const data: CashPayment[] = await res.json()
      setCashPayments(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error loading cash payments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  // Initial fetch
  fetchCashPayments()

  // Refresh every 2 seconds
  const interval = setInterval(() => {
    fetchCashPayments()
  }, 2000)

  // Cleanup on unmount
  return () => clearInterval(interval)
}, [])


  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cash Payments</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Overview of all recorded cash transactions
        </p>
      </div>

      {/* Cash Payments Card */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Banknote className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Cash Payment History</h2>
        </div>

        {/* Loading State */}
        {loading && <p className="text-sm text-gray-500">Loading cash payments...</p>}

        {/* Error State */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Empty State */}
        {!loading && !error && cashPayments.length === 0 && (
          <p className="text-sm text-gray-500">No cash payments recorded yet.</p>
        )}

        {/* Desktop Table */}
        {!loading && cashPayments.length > 0 && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Amount (KES)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">MAC Address</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cashPayments.map((payment) => {
                  const date = new Date(payment.timestamp)
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-mono">{payment.id}</td>
                      <td className="px-4 py-2 font-semibold">{payment.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm font-mono">{payment.mac_address}</td>
                      <td className="px-4 py-2">{date.toLocaleDateString()}</td>
                      <td className="px-4 py-2">{date.toLocaleTimeString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && cashPayments.length > 0 && (
          <div className="sm:hidden space-y-3">
            {cashPayments.map((payment) => {
              const date = new Date(payment.timestamp)
              return (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Payment ID</p>
                  <p className="font-mono text-sm">{payment.id}</p>

                  <div className="flex justify-between mt-2">
                    <p className="font-semibold">KES {payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{date.toLocaleDateString()}</p>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">MAC Address</p>
                  <p className="font-mono text-xs break-all">{payment.mac_address}</p>

                  <p className="text-xs text-gray-500 mt-1">{date.toLocaleTimeString()}</p>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
