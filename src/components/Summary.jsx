import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currencies } from "../mockData";

const Summary = ({ transactions }) => {
  const [summaryByCurrency, setSummaryByCurrency] = useState({});

  //   to maintain the total income, total expense, and balance by currency
  useEffect(() => {
    const summary = {};

    // Group transactions by currency
    const transactionsByCurrency = transactions.reduce((acc, transaction) => {
      const currency = transaction.currency || 'INR';
      if (!acc[currency]) {
        acc[currency] = [];
      }
      acc[currency].push(transaction);
      return acc;
    }, {});

    // Calculate summary for each currency
    Object.keys(transactionsByCurrency).forEach(currency => {
      const currencyTransactions = transactionsByCurrency[currency];
      const income = currencyTransactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

      const expense = currencyTransactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

      summary[currency] = {
        income,
        expense,
        balance: income - expense,
        symbol: currencies[currency]?.symbol || '₹'
      };
    });

    setSummaryByCurrency(summary);
  }, [transactions]);

  return (
    <div className="space-y-6">
      {Object.keys(summaryByCurrency).map(currency => {
        const summary = summaryByCurrency[currency];
        return (
          <div key={currency}>
            <h3 className="text-lg font-semibold mb-3 text-center">
              {currencies[currency]?.name || currency} Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {summary.symbol}{summary.income.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {summary.symbol}{summary.expense.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {summary.symbol}{summary.balance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Summary;