/**
 * Price Management Component
 * Allows the user to view and update the milk price per litre
 * All data is read from the centralized data file
 */

"use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Pricing } from "@/lib/types"

interface PriceProps {
  pricing: Pricing
  onUpdatePrice: (newPrice: number) => void
}

export default function Price({ pricing, onUpdatePrice }: PriceProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newPrice, setNewPrice] = useState(pricing.pricePerLitre.toString())
  const [error, setError] = useState("")

  const handleSetPrice = () => {
    const price = parseInt(newPrice)
    
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price greater than 0")
      return
    }

    onUpdatePrice(price)
    setIsEditing(false)
    setError("")
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Price Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Set and manage the milk price per litre
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Price Per Litre</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              KES {pricing.pricePerLitre}
            </p>
          </div>
        </div>

        {!isEditing ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              This price is used to calculate all sales analytics and revenue across the system.
            </p>
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
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
                  setError("")
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
                min="1"
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSetPrice}
                className="flex-1"
              >
                Confirm Price
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false)
                  setNewPrice(pricing.pricePerLitre.toString())
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
