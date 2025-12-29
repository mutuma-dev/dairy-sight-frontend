"use client"

/**
 * Stats Card Component
 * Reusable card for displaying dashboard statistics
 * Shows title, value, and change information
 * Can be clickable to open modals
 * Clean, professional design without icons
 */

interface StatsCardProps {
  title: string
  value: string
  change: string
  backgroundColor?: string
  onClick?: () => void
  isClickable?: boolean
}

export default function StatsCard({
  title,
  value,
  change,
  backgroundColor = "bg-white",
  onClick,
  isClickable = false,
}: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${backgroundColor} rounded-lg shadow-md p-6 ${
        isClickable ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
    >
      <h3 className="text-gray-600 font-medium text-sm mb-4">{title}</h3>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-blue-600 text-sm font-semibold">{change}</p>
      </div>
    </div>
  )
}
