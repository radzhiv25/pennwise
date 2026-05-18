"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currencies } from "../mockData";

const Summary = ({ transactions, selectedCurrency }) => {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    symbol: "₹",
  });

  useEffect(() => {
    const currencyTransactions = transactions.filter(
      (transaction) => (transaction.currency || "INR") === selectedCurrency
    );

    const income = currencyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expense = currencyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    setSummary({
      income,
      expense,
      balance: income - expense,
      symbol: currencies[selectedCurrency]?.symbol || "₹",
    });
  }, [transactions, selectedCurrency]);

  const currencyName = currencies[selectedCurrency]?.name || selectedCurrency;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currencyName} Summary</CardTitle>
        <CardDescription>Totals for your selected currency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card size="sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-income">
                {summary.symbol}
                {summary.income.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-expense">
                {summary.symbol}
                {summary.expense.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-xl font-semibold ${summary.balance >= 0 ? "text-primary" : "text-expense"}`}
              >
                {summary.symbol}
                {summary.balance.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

Summary.propTypes = {
  transactions: PropTypes.array.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
};

export default Summary;
