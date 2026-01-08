/**
 * Price Management Component (Backend Connected)
 * ----------------------------------------------
 * Fetches and updates the milk price per litre from the backend API
 * Shows success/error feedback on price update
 */

"use client"

import { useState, useEffect } from "react"
import { DollarSign, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Pricing } from "@/lib/types"

const BACKEND_URL =  process.env.NEXT_PUBLIC_BACKEND_URL

export default function Price() {
  const [pricing, setPricing] = useState<Pricing>({ pricePerLitre: 0 })
  const [newPrice, setNewPrice] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Fetch current price from backend
  const fetchPrice = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/pricing`)
      const data = await res.json()
      setPricing(data)
      setNewPrice(data.pricePerLitre.toString())
      setFeedback(null)
    } catch (error) {
      console.error("Failed to fetch price:", error)
      setFeedback({ type: "error", message: "Failed to fetch current price" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrice()
  }, [])

  // Update price on backend
  const handleSetPrice = async () => {
    const price = parseInt(newPrice)
    if (isNaN(price) || price <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid price greater than 0" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricePerLitre: price }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setPricing({ pricePerLitre: price })
        setFeedback({ type: "success", message: data.message || "Price updated successfully" })
        setIsEditing(false)
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to update price" })
      }
    } catch (error) {
      console.error("Error updating price:", error)
      setFeedback({ type: "error", message: "Failed to update price" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Price Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Set and manage the milk price per litre
          </p>
        </div>
        {/* Optional Refresh Button */}
        <Button onClick={fetchPrice} variant="outline" className="flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mb-4 p-3 rounded ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <Card className="p-6 sm:p-8">
        {/* Current Price */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Price Per Litre</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              {loading ? "Loading..." : `KES ${pricing.pricePerLitre}`}
            </p>
          </div>
        </div>

        {/* Edit Section */}
        {!isEditing ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              This price is used to calculate all sales analytics and revenue across the system.
            </p>
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              Set New Price
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                New Price (KES per Litre)
              </label>
              <input
                id="price"
                type="number"
                value={newPrice}
                onChange={(e) => {
                  setNewPrice(e.target.value)
                  setFeedback(null)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
                min="1"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSetPrice} className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Confirm Price"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  setNewPrice(pricing.pricePerLitre.toString())
                  setFeedback(null)
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

      {/* Price Impact Info */}
      <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">Price Impact</h3>
        <p className="text-sm text-gray-600">
          Changing the price per litre will affect all future sales calculations and analytics.
          Historical transactions will retain their original values.
        </p>
      </Card>
    </div>
  )
}

