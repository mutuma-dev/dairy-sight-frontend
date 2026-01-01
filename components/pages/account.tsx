/**
 * Account Management Component
 * ----------------------------
 * - Fetches vendor details from backend
 * - Allows editing vendor name & shopName (ID immutable)
 * - Saves updated vendor info to backend
 * - Shows success/error feedback
 * - Handles account balance and withdrawals
 */

"use client"

import { useState, useEffect } from "react"
import { Wallet, ArrowDownToLine, Edit, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatKenyanDateTime } from "@/lib/utils"
import type { Account, Vendor } from "@/lib/types"

export default function AccountPage({ account, onWithdraw }: { account: Account; onWithdraw: (amount: number) => void }) {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loadingVendor, setLoadingVendor] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [vendorName, setVendorName] = useState("")
  const [shopName, setShopName] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [error, setError] = useState("")

  const API_URL = "https://40ed9b23-ce6c-4865-9ea7-673fc391e9ac-00-1earrmirya0dv.picard.replit.dev/api/vendor"

  // Fetch vendor details from backend
  const fetchVendor = async () => {
    try {
      setLoadingVendor(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error("Failed to fetch vendor details")
      const data = await res.json()
      setVendor(data)
      setVendorName(data.name)
      setShopName(data.shopName)
    } catch (err: any) {
      console.error(err)
      setFeedback({ type: "error", message: err.message || "Failed to load vendor" })
    } finally {
      setLoadingVendor(false)
    }
  }

  useEffect(() => {
    fetchVendor()
  }, [])

  // Handle vendor update
  const handleVendorUpdate = async () => {
    if (!vendor) return
    if (!vendorName.trim() || !shopName.trim()) {
      setFeedback({ type: "error", message: "Name and Shop Name cannot be empty" })
      return
    }

    try {
      const res = await fetch(`${API_URL}/${vendor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: vendorName.trim(), shopName: shopName.trim() }),
      })
      if (!res.ok) throw new Error("Failed to update vendor")
      const updated = await res.json()
      setVendor(updated)
      setEditMode(false)
      setFeedback({ type: "success", message: "Vendor details updated successfully" })
    } catch (err: any) {
      console.error(err)
      setFeedback({ type: "error", message: err.message || "Failed to update vendor" })
    }
  }

  // Handle withdrawals (same as before)
  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount)
    
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }

    if (amount > account.balance) {
      setError(`Insufficient balance. Your current balance is KES ${account.balance.toLocaleString()}`)
      return
    }

    onWithdraw(amount)
    setIsWithdrawing(false)
    setWithdrawAmount("")
    setError("")
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Manage your account balance, withdrawals, and vendor details
        </p>
      </div>

      {/* Vendor Card */}
      <Card className="p-4 sm:p-6 bg-gray-50 border border-gray-200 relative">
        {loadingVendor ? (
          <p className="text-gray-500 text-center">Loading vendor details...</p>
        ) : vendor ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Vendor Details</h2>
              {!editMode ? (
                <Button size="sm" onClick={() => setEditMode(true)} className="flex items-center gap-1">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleVendorUpdate} className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4" /> Save
                  </Button>
                  <Button size="sm" onClick={() => { setEditMode(false); setVendorName(vendor.name); setShopName(vendor.shopName); }} className="flex items-center gap-1" variant="outline">
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Vendor Fields */}
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Vendor Name</p>
                {editMode ? (
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-semibold text-gray-900">{vendor.name}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mt-2">Shop Name</p>
                {editMode ? (
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-semibold text-gray-900">{vendor.shopName}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mt-2">Vendor ID</p>
                <p className="font-semibold text-gray-900">{vendor.id}</p>
              </div>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <p className={`mt-3 text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {feedback.message}
              </p>
            )}
          </>
        ) : (
          <p className="text-red-600 text-center">No vendor found</p>
        )}
      </Card>

      {/* Account Balance Card */}
      <Card className="p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              KES {account.balance.toLocaleString()}
            </p>
          </div>
        </div>

        {!isWithdrawing ? (
          <Button 
            onClick={() => setIsWithdrawing(true)}
            className="w-full sm:w-auto"
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Withdraw Funds
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount (KES)
              </label>
              <input
                id="amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => {
                  setWithdrawAmount(e.target.value)
                  setError("")
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
                max={account.balance}
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleWithdraw}
                className="flex-1"
              >
                Confirm Withdrawal
              </Button>
              <Button 
                onClick={() => {
                  setIsWithdrawing(false)
                  setWithdrawAmount("")
                  setError("")
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Recent Withdrawals */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Withdrawals</h2>
        <div className="space-y-3">
          {account.withdrawals.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              No withdrawals yet
            </Card>
          ) : (
            account.withdrawals.map((withdrawal) => (
              <Card key={withdrawal.id} className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      KES {withdrawal.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{withdrawal.id}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatKenyanDateTime(withdrawal.timestamp)}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

