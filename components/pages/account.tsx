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
import type { Account, Vendor } from "@/lib/types"

export default function AccountPage() {
  // State for account
  const [account, setAccount] = useState<Account | null>(null)
  const [loadingAccount, setLoadingAccount] = useState(true)

  // State for vendor details
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loadingVendor, setLoadingVendor] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [vendorName, setVendorName] = useState("")
  const [shopName, setShopName] = useState("")
  const [vendorFeedback, setVendorFeedback] = useState<{ message: string; success: boolean } | null>(null)

  // Withdrawal state
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [error, setError] = useState("")

  // Base URL (replace with env later)
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

  // Fetch account data
  const fetchAccount = async () => {
    try {
      setLoadingAccount(true)
      const res = await fetch(`${API_BASE}/account`)
      if (!res.ok) throw new Error("Failed to fetch account data")
      const data: Account = await res.json()
      setAccount(data)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoadingAccount(false)
    }
  }

  // Fetch vendor details
  const fetchVendor = async () => {
    try {
      setLoadingVendor(true)
      const res = await fetch(`${API_BASE}/vendor`)
      if (!res.ok) throw new Error("Failed to fetch vendor details")
      const data: Vendor = await res.json()
      setVendor(data)
      setVendorName(data.name)
      setShopName(data.shopName)
    } catch (err: any) {
      console.error(err)
      setVendorFeedback({ message: err.message || "Error fetching vendor", success: false })
    } finally {
      setLoadingVendor(false)
    }
  }

  useEffect(() => {
    fetchAccount()
    fetchVendor()
  }, [])

  // Handle vendor update
  const handleVendorUpdate = async () => {
    if (!vendor) return
    if (!vendorName.trim() || !shopName.trim()) {
      setVendorFeedback({ message: "All fields are required", success: false })
      return
    }

    try {
      const res = await fetch(`${API_BASE}/vendor/${vendor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: vendorName.trim(), shopName: shopName.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update vendor")

      setVendorFeedback({ message: "Vendor updated successfully ✅", success: true })
      setEditMode(false)
      fetchVendor()
    } catch (err: any) {
      console.error(err)
      setVendorFeedback({ message: err.message || "Update failed ❌", success: false })
    } finally {
      setTimeout(() => setVendorFeedback(null), 3000)
    }
  }

  // Handle withdrawal
  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }

    try {
      const res = await fetch(`${API_BASE}/account/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Withdrawal failed")

      setAccount(data) // Update account state with new balance + withdrawal
      setIsWithdrawing(false)
      setWithdrawAmount("")
      setError("")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error processing withdrawal")
    }
  }

  // Handle deposit (optional)
  const handleDeposit = async (amount: number) => {
    try {
      const res = await fetch(`${API_BASE}/account/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Deposit failed")

      setAccount(data)
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account</h1>
      <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your account balance, withdrawals, and vendor info</p>

      {/* Vendor Card */}
      <Card className="p-4 sm:p-6 relative">
        {loadingVendor ? (
          <p className="text-gray-500">Loading vendor details...</p>
        ) : vendor ? (
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Vendor Name</p>
                {!editMode ? (
                  <p className="font-semibold text-gray-900">{vendor.name}</p>
                ) : (
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="border border-gray-300 rounded-md p-1 mt-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}

                <p className="text-sm text-gray-600 mt-2">Shop Name</p>
                {!editMode ? (
                  <p className="font-semibold text-gray-900">{vendor.shopName}</p>
                ) : (
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="border border-gray-300 rounded-md p-1 mt-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}

                <p className="text-sm text-gray-600 mt-2">Vendor ID</p>
                <p className="font-semibold text-gray-900">{vendor.id}</p>
              </div>

              <div className="flex gap-2 mt-1">
                {!editMode ? (
                  <Edit
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600"
                    onClick={() => setEditMode(true)}
                  />
                ) : (
                  <>
                    <Check
                      className="w-5 h-5 text-green-600 cursor-pointer"
                      onClick={handleVendorUpdate}
                    />
                    <X
                      className="w-5 h-5 text-red-600 cursor-pointer"
                      onClick={() => {
                        setEditMode(false)
                        setVendorName(vendor.name)
                        setShopName(vendor.shopName)
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            {vendorFeedback && (
              <p className={`mt-2 text-sm ${vendorFeedback.success ? "text-green-600" : "text-red-600"}`}>
                {vendorFeedback.message}
              </p>
            )}
          </div>
        ) : (
          <p className="text-red-500">Vendor details not found</p>
        )}
      </Card>

      {/* Account Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              KES {account?.balance?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {!isWithdrawing ? (
          <Button onClick={() => setIsWithdrawing(true)} className="w-full sm:w-auto">
            <ArrowDownToLine className="h-4 w-4 mr-2" /> Withdraw Funds
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
                max={account?.balance || 0}
              />
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleWithdraw} className="flex-1">Confirm Withdrawal</Button>
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
    </div>
  )
}


