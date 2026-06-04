"use client";

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Summary from "./Summary";
import TransactionList from "./TransactionList";
import Chart from "./Chart";
import EditTransactionDialog from "./EditTransactionDialog";
import { mockTransactions, categories } from "../mockData";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { DateField } from "@/components/ui/date-field";
import { Database, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

const TransactionForm = ({ selectedCurrency }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions. Please try again.");
      setTransactions([]);
    } else {
      setTransactions(data || []);
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const requireUser = () => {
    if (!user) {
      setError("You must be logged in to perform this action.");
      return false;
    }
    return true;
  };

  //   to submit the transaction
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requireUser()) return;

    setIsSyncing(true);
    setError(null);

    const newTransaction = {
      user_id: user.id,
      type,
      amount: parseFloat(amount),
      category,
      date: format(date, "yyyy-MM-dd"),
      description,
      currency: selectedCurrency,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(newTransaction)
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    } else {
      setTransactions((prev) => [data, ...prev]);
      setAmount(0);
      setCategory("");
      setDate(new Date());
      setDescription("");
    }

    setIsSyncing(false);
  };

  //   to edit a transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  //   to delete a transaction
  const handleDelete = async (transaction) => {
    if (!requireUser()) return;

    setIsSyncing(true);
    setError(null);

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transaction.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction. Please try again.");
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
    }

    setIsSyncing(false);
  };

  //   to save edited transaction
  const handleSaveEdit = async (updatedTransaction) => {
    if (!requireUser()) return;

    setIsSyncing(true);
    setError(null);

    const { data, error } = await supabase
      .from("transactions")
      .update({
        type: updatedTransaction.type,
        amount: updatedTransaction.amount,
        category: updatedTransaction.category,
        date: updatedTransaction.date,
        description: updatedTransaction.description,
        currency: updatedTransaction.currency,
      })
      .eq("id", updatedTransaction.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating transaction:", error);
      setError("Failed to update transaction. Please try again.");
    } else if (data) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === data.id ? data : transaction
        )
      );
    }

    setIsSyncing(false);
  };

  //   to close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTransaction(null);
  };

  //   to load mock data
  const handleLoadMockData = async () => {
    if (!requireUser()) return;

    setIsSyncing(true);
    setError(null);

    const payload = mockTransactions.map(({ id, status, ...rest }) => ({
      user_id: user.id,
      ...rest,
    }));

    const { data, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select();

    if (error) {
      console.error("Error loading mock data:", error);
      setError("Failed to load mock data. Please try again.");
    } else {
      setTransactions((prev) => {
        const existingIds = new Map(prev.map((t, index) => [t.id, index]));
        const merged = [...prev];

        data.forEach((transaction) => {
          const existingIndex = existingIds.get(transaction.id);
          if (existingIndex === undefined) {
            merged.push(transaction);
          } else {
            merged[existingIndex] = transaction;
          }
        });

        return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    }

    setIsSyncing(false);
  };

  const handleImportTransactions = async (rows) => {
    if (!requireUser()) {
      return {
        imported: 0,
        errors: [{ message: "You must be logged in to import transactions." }],
      };
    }

    setIsSyncing(true);
    setError(null);

    const payload = rows.map((row) => ({
      user_id: user.id,
      type: row.type,
      amount: row.amount,
      category: row.category,
      date: row.date,
      description: row.description,
      currency: row.currency,
    }));

    const { data, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select();

    if (error) {
      console.error("Error importing transactions:", error);
      setError("Failed to import transactions. Please try again.");
      setIsSyncing(false);
      return {
        imported: 0,
        errors: [{ message: "Import failed. Check your CSV and try again." }],
      };
    }

    setTransactions((prev) => {
      const merged = [...prev];
      const indexById = new Map(merged.map((item, index) => [item.id, index]));

      (data || []).forEach((transaction) => {
        const existingIndex = indexById.get(transaction.id);
        if (existingIndex === undefined) {
          merged.push(transaction);
        } else {
          merged[existingIndex] = transaction;
        }
      });

      return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    setIsSyncing(false);
    return { imported: data?.length ?? 0, errors: [] };
  };

  //   to clear all data
  const handleClearData = async () => {
    if (!requireUser()) return;

    setIsSyncing(true);
    setError(null);

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error clearing data:", error);
      setError("Failed to clear data. Please try again.");
    } else {
      setTransactions([]);
    }

    setIsSyncing(false);
  };

  const currencySymbol =
    selectedCurrency === "USD" ? "$" : selectedCurrency === "GBP" ? "£" : "₹";

  return (
    <div className="dashboard-stack">
      <Card>
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
          <CardDescription>
            Enter your income or expense details below.
          </CardDescription>
          {error && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardHeader>
        <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Transaction Type" htmlFor="type">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={`Amount (${currencySymbol})`} htmlFor="amount">
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </FormField>

              <FormField label="Category" htmlFor="category">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Date">
                <DateField value={date} onChange={setDate} />
              </FormField>
            </div>

            <FormField label="Description" htmlFor="description">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={2}
              />
            </FormField>

            <Button type="submit" disabled={isSyncing}>
              {isSyncing ? "Saving…" : "Add Transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Summary transactions={transactions} selectedCurrency={selectedCurrency} />
      <Chart transactions={transactions} selectedCurrency={selectedCurrency} />

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImportTransactions={handleImportTransactions}
        selectedCurrency={selectedCurrency}
        isLoading={isLoading}
        isImporting={isSyncing}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleLoadMockData}
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              disabled={isSyncing}
            >
              <Database className="h-3.5 w-3.5" />
              Load Mock Data
            </Button>
            <Button
              onClick={handleClearData}
              variant="destructive"
              size="sm"
              className="gap-2 text-xs"
              disabled={isSyncing}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditTransactionDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        transaction={editingTransaction}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

TransactionForm.propTypes = {
  selectedCurrency: PropTypes.string.isRequired,
};

export default TransactionForm;