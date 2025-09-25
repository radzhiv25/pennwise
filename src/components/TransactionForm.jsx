import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Summary from "./Summary";
import TransactionList from "./TransactionList";
import Chart from "./Chart";
import EditTransactionDialog from "./EditTransactionDialog";
import KanbanBoard from "./KanbanBoard";
import { mockTransactions, categories } from "../mockData";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Database, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

const TransactionForm = ({ selectedCurrency }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
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
      status,
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
      setStatus("todo");
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
        status: updatedTransaction.status,
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

    const payload = mockTransactions.map(({ id, ...rest }) => ({
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

  //   to handle status change from Kanban board
  const handleStatusChange = async (transactionId, newStatus) => {
    if (!requireUser()) return;

    setError(null);

    const { data, error } = await supabase
      .from("transactions")
      .update({ status: newStatus })
      .eq("id", transactionId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating status:", error);
      setError("Failed to update transaction status. Please try again.");
    } else if (data) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === data.id ? data : transaction
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
          <CardDescription>
            Enter your income or expense details below.
          </CardDescription>
          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({selectedCurrency === 'USD' ? '$' : selectedCurrency === 'GBP' ? '£' : '₹'})</Label>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows="3"
              />
            </div>
            <Button type="submit" className="w-max" disabled={isSyncing}>
              {isSyncing ? "Saving..." : "Add Transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Load sample data to test the application or clear all data to start fresh.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={handleLoadMockData}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isSyncing}
            >
              <Database className="h-4 w-4" />
              Load Mock Data
            </Button>
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="flex items-center gap-2"
              disabled={isSyncing}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
      <Summary transactions={transactions} selectedCurrency={selectedCurrency} />
      <Chart transactions={transactions} selectedCurrency={selectedCurrency} />
      <KanbanBoard
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        selectedCurrency={selectedCurrency}
        isLoading={isLoading}
      />
      <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} selectedCurrency={selectedCurrency} isLoading={isLoading} />

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