import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currencies } from "../mockData";

const Summary = ({ transactions, selectedCurrency }) => {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    symbol: '₹'
  });

  //   to maintain the total income, total expense, and balance for selected currency
  useEffect(() => {
    // Filter transactions for the selected currency
    const currencyTransactions = transactions.filter(transaction =>
      (transaction.currency || 'INR') === selectedCurrency
    );

    const income = currencyTransactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expense = currencyTransactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    setSummary({
      income,
      expense,
      balance: income - expense,
      symbol: currencies[selectedCurrency]?.symbol || '₹'
    });
  }, [transactions, selectedCurrency]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-center">
          {currencies[selectedCurrency]?.name || selectedCurrency} Summary
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
    </div>
  );
};

Summary.propTypes = {
  transactions: PropTypes.array.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
};

export default Summary;