/**
 * Account Management Component
 * Displays account balance and allows withdrawals
 * All data is read from the centralized data file
 */

"use client"

import { useState } from "react"
import { Wallet, ArrowDownToLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatKenyanDateTime } from "@/lib/utils"
import type { Account, Vendor } from "@/lib/types"

interface AccountPageProps {
  account: Account
  vendor: Vendor
  onWithdraw: (amount: number) => void
}

export default function AccountPage({ account, vendor, onWithdraw }: AccountPageProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [error, setError] = useState("")

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Manage your account balance and withdrawals
        </p>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">Vendor Name</p>
        <p className="font-semibold text-gray-900">{vendor.name}</p>
        <p className="text-sm text-gray-600 mt-2">Vendor ID</p>
        <p className="font-semibold text-gray-900">{vendor.id}</p>
      </div>

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
