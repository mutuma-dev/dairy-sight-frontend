/**
 * Type definitions for Dairy Sight application
 * Contains all TypeScript interfaces and types used throughout the app
 */

export interface Vendor {
  name: string
  shopName: string
  id: string
}

export interface Device {
  id: string
  name: string
  availableStock: number
  capacity: number
  status: "online" | "offline"
  isTampered: boolean
  lastUpdated: string
}

export interface Transaction {
  id: string
  deviceId: string
  deviceName: string
  amount: number
  currency: string
  timestamp: string
  type: "mpesa" | "bank"
  mpesaNumber: string | null
  mpesaCode: string | null
  bankAccount: string | null
  bankName: string | null
}

export interface Alert {
  id: string
  deviceId: string
  deviceName: string
  availableStock: number
  capacity: number
  status: "online" | "offline"
  type: "offline" | "tampered" | "low_stock"
  severity: "critical" | "warning"
  timestamp: string
  resolved: boolean
}

export interface Analytics {
  totalSales: {
    last24Hours: number
    last7Days: number
    last30Days: number
    last1Year: number
  }
  peakHours: {
    last24Hours: { hour: string; units: number }
    last7Days: { hour: string; units: number }
    last30Days: { hour: string; units: number }
    last1Year: { hour: string; units: number }
  }
}

export interface AppData {
  vendor: Vendor
  devices: Device[]
  transactions: Transaction[]
  alerts: Alert[]
  analytics: Analytics
}

export type TimePeriod = "last24Hours" | "last7Days" | "last30Days" | "last1Year"
