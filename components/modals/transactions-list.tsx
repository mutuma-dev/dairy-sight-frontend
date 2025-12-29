"use client"

/**
 * Transactions List Modal Component
 * Displays all transactions in a clean, professional format
 * Shows transaction ID, device, amount, payment type and details
 * Timestamps displayed in Kenya timezone format
 * Fully responsive for mobile and desktop screens
 */

import type { Transaction } from "@/lib/types"

interface TransactionsListProps {
  transactions: Transaction[]
  onClose: () => void
}

export default function TransactionsList({ transactions, onClose }: TransactionsListProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400/20 via-blue-200/15 to-blue-300/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
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
        <div className="overflow-y-auto flex-1">
          <div className="p-4 md:p-6">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-5 gap-4 mb-3 pb-3 border-b-2 border-gray-200">
              <div className="font-semibold text-gray-700 text-sm">Transaction ID</div>
              <div className="font-semibold text-gray-700 text-sm">Device</div>
              <div className="font-semibold text-gray-700 text-sm">Amount</div>
              <div className="font-semibold text-gray-700 text-sm">Type</div>
              <div className="font-semibold text-gray-700 text-sm">Date & Time</div>
            </div>

            {/* Transaction Rows */}
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-base text-gray-800">{txn.id}</p>
                        <p className="text-xs text-gray-500 mt-1">{txn.deviceName}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">KES {txn.amount.toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-600 font-medium block">Payment Type</span>
                        <span className="text-gray-800 font-semibold">{txn.type === "mpesa" ? "M-PESA" : "Bank"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium block">
                          {txn.type === "mpesa" ? "Phone" : "Account"}
                        </span>
                        <span className="text-gray-800 font-semibold break-all">
                          {txn.type === "mpesa" ? txn.mpesaNumber : txn.bankAccount}
                        </span>
                      </div>
                      {txn.type === "mpesa" && txn.mpesaCode && (
                        <div>
                          <span className="text-gray-600 font-medium block">M-PESA Code</span>
                          <span className="text-gray-800 font-semibold">{txn.mpesaCode}</span>
                        </div>
                      )}
                      {txn.type === "bank" && txn.bankName && (
                        <div>
                          <span className="text-gray-600 font-medium block">Bank</span>
                          <span className="text-gray-800 font-semibold">{txn.bankName}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 font-medium">
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

                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{txn.id}</p>
                      <p className="text-xs text-gray-500">{txn.deviceName}</p>
                    </div>

                    <div className="text-sm text-gray-700">
                      {txn.type === "mpesa" ? txn.mpesaNumber : txn.bankAccount}
                    </div>

                    <div className="font-bold text-blue-600 text-sm">KES {txn.amount.toLocaleString()}</div>

                    <div className="text-sm">
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                        {txn.type === "mpesa" ? "M-PESA" : "Bank"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600">
                      {new Intl.DateTimeFormat("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Africa/Nairobi",
                      }).format(new Date(txn.timestamp))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
