/**
 * Type definitions for Dairy Sight application
 * Contains all TypeScript interfaces and types used throughout the app
 */

export interface Vendor {
  name: string
  shopName: string
  id: string
}

// <CHANGE> Removed availableStock and capacity fields from Device
export interface Device {
  id: string
  name: string
  status: "online" | "offline"
  isTampered: boolean
  lastUpdated: string
}

// <CHANGE> Removed bank fields, added litres field for sales calculation
export interface Transaction {
  id: string
  deviceId: string
  deviceName: string
  litres: number
  amount: number
  currency: string
  timestamp: string
  type: "mpesa"
  mpesaNumber: string
  mpesaCode: string
}

// <CHANGE> Removed availableStock and capacity fields from Alert
export interface Alert {
  id: string
  deviceId: string
  deviceName: string
  status: "online" | "offline"
  type: "offline" | "tampered"
  severity: "critical" | "warning"
  timestamp: string
  resolved: boolean
}

// <CHANGE> Changed units to litres throughout analytics
export interface Analytics {
  totalLitres: {
    last24Hours: number
    last7Days: number
    last30Days: number
    last1Year: number
  }
  peakHours: {
    last24Hours: { hour: string; litres: number }
    last7Days: { hour: string; litres: number }
    last30Days: { hour: string; litres: number }
    last1Year: { hour: string; litres: number }
  }
}

// <CHANGE> Added new interfaces for pricing and account management
export interface Pricing {
  pricePerLitre: number
}

export interface Withdrawal {
  id: string
  amount: number
  timestamp: string
}

export interface Account {
  balance: number
  withdrawals: Withdrawal[]
}

export interface AppData {
  vendor: Vendor
  pricing: Pricing
  account: Account
  devices: Device[]
  transactions: Transaction[]
  alerts: Alert[]
  analytics: Analytics
}

export type TimePeriod = "last24Hours" | "last7Days" | "last30Days" | "last1Year"
