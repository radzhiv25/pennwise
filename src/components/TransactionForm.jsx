import { useState, useEffect } from "react";
import Summary from "./Summary";
import TransactionList from "./TransactionList";
import Chart from "./Chart";
import EditTransactionDialog from "./EditTransactionDialog";
import KanbanBoard from "./KanbanBoard";
import { mockTransactions, categories } from "../mockData";
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

const TransactionForm = () => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [currency, setCurrency] = useState("INR");
  const [transactions, setTransactions] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(savedTransactions);
  }, []);

  //   to submit the transaction
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new transaction object
    const newTransaction = {
      id: Date.now().toString(), // Simple ID generation
      type,
      amount: parseFloat(amount),
      category,
      date: format(date, 'yyyy-MM-dd'),
      description,
      status,
      currency,
    };

    // Add the new transaction to the array
    const updatedTransactions = [...transactions, newTransaction];

    // Update the state and local storage
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Reset the form fields after submission
    setAmount(0);
    setCategory("");
    setDate(new Date());
    setDescription("");
    setStatus("todo");
  };

  //   to edit a transaction
  const handleEdit = (transaction) => {
    const index = transactions.findIndex(t => t.id === transaction.id);
    setEditingTransaction(transaction);
    setEditingIndex(index);
    setIsEditDialogOpen(true);
  };

  //   to delete a transaction
  const handleDelete = (transaction) => {
    const updatedTransactions = transactions.filter(t => t.id !== transaction.id);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  //   to save edited transaction
  const handleSaveEdit = (updatedTransaction) => {
    const updatedTransactions = transactions.map((transaction, index) =>
      index === editingIndex ? updatedTransaction : transaction
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  //   to close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTransaction(null);
    setEditingIndex(null);
  };

  //   to load mock data
  const handleLoadMockData = () => {
    setTransactions(mockTransactions);
    localStorage.setItem('transactions', JSON.stringify(mockTransactions));
  };

  //   to clear all data
  const handleClearData = () => {
    setTransactions([]);
    localStorage.removeItem('transactions');
  };

  //   to handle status change from Kanban board
  const handleStatusChange = (transactionId, newStatus) => {
    console.log('Status change called:', { transactionId, newStatus });
    console.log('Current transactions:', transactions);

    const updatedTransactions = transactions.map(transaction =>
      transaction.id === transactionId
        ? { ...transaction, status: newStatus }
        : transaction
    );

    console.log('Updated transactions:', updatedTransactions);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  return (
    <div className="space-y-6">
      {/* transaction form to enter the amount */}
      <Card>
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
          <CardDescription>
            Enter your income or expense details below.
          </CardDescription>
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
                <Label htmlFor="amount">Amount</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="flex-1"
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            <Button type="submit" className="w-max">
              Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Mock Data Controls */}
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
            >
              <Database className="h-4 w-4" />
              Load Mock Data
            </Button>
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
      <Summary transactions={transactions} />
      <Chart transactions={transactions} />
      <KanbanBoard
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
      <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />

      <EditTransactionDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        transaction={editingTransaction}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default TransactionForm;