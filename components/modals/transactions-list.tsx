"use client"

/**
 * Transactions List Modal Component
 * Displays all transactions in a linear, readable card layout
 * Shows transaction ID, device, amount, payment type, phone, M-PESA code, and timestamp
 * No litres field included
 * Fully responsive and visually clean
 */

import type { Transaction } from "@/lib/types"

interface TransactionsListProps {
  transactions: Transaction[]
  onClose: () => void
}

export default function TransactionsList({ transactions, onClose }: TransactionsListProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 md:p-6 text-white flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Transaction History</h2>
            <p className="text-blue-100 text-xs md:text-sm mt-1">{transactions.length} transactions</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Transactions List */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              {/* Transaction Info in Linear Layout */}
              <div className="space-y-1">
                <p className="text-gray-800 font-semibold">Transaction ID: <span className="font-normal">{txn.id}</span></p>
                <p className="text-gray-800 font-semibold">Device Name: <span className="font-normal">{txn.deviceName}</span></p>
                <p className="text-gray-800 font-semibold">Device ID: <span className="font-normal">{txn.deviceId}</span></p>
                <p className="text-gray-800 font-semibold">Amount: <span className="font-normal text-blue-600">KES {txn.amount.toLocaleString()}</span></p>
                <p className="text-gray-800 font-semibold">Payment Type: <span className="font-normal">M-PESA</span></p>
                <p className="text-gray-800 font-semibold">Phone: <span className="font-normal break-all">{txn.mpesaNumber}</span></p>
                <p className="text-gray-800 font-semibold">M-PESA Code: <span className="font-normal">{txn.mpesaCode}</span></p>
                <p className="text-gray-500 text-xs">
                  Date:{" "}
                  {new Intl.DateTimeFormat("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZone: "Africa/Nairobi",
                  }).format(new Date(txn.timestamp))}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white rounded-lg font-medium py-2 hover:bg-blue-700 transition text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

