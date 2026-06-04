"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { DateField } from "@/components/ui/date-field";
import { format } from "date-fns";
import { categories } from "../mockData";

const EditTransactionDialog = ({
    isOpen,
    onClose,
    transaction,
    onSave
}) => {
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState("income");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("INR");

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount);
            setType(transaction.type);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setDescription(transaction.description);
            setCurrency(transaction.currency || "INR");
        }
    }, [transaction]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedTransaction = {
            ...transaction,
            type,
            amount: parseFloat(amount),
            category,
            date: format(date, 'yyyy-MM-dd'),
            description,
            currency,
        };

        onSave(updatedTransaction);
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogDescription>
                        Make changes to your transaction here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-type">Transaction Type</Label>
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
                                <Label htmlFor="edit-amount">Amount</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        id="edit-amount"
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
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
                        <FormField label="Date">
                            <DateField value={date} onChange={setDate} />
                        </FormField>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter description"
                                rows="3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

EditTransactionDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    transaction: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        amount: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        description: PropTypes.string,
        currency: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
};

EditTransactionDialog.defaultProps = {
    transaction: null,
};

export default EditTransactionDialog;
