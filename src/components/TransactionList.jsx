"use client";

import { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
import { Download, MoreHorizontal, Pencil, Trash2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeField } from "@/components/ui/date-range-field";
import { cn } from "@/lib/utils";
import {
  downloadTransactionTemplate,
  parseTransactionCsv,
} from "@/lib/transaction-csv";

const TRANSACTION_LIMIT = 15;

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

function currencySymbol(currency) {
  if (currency === "USD") return "$";
  if (currency === "GBP") return "£";
  return "₹";
}

function formatAmount(transaction) {
  const sign = transaction.type === "income" ? "+" : "−";
  return `${sign}${currencySymbol(transaction.currency)}${transaction.amount.toFixed(2)}`;
}

function matchesSearch(transaction, query) {
  if (!query) return true;
  const haystack = `${transaction.category} ${transaction.description || ""}`.toLowerCase();
  return haystack.includes(query);
}

function matchesDateRange(transaction, range) {
  if (!range?.from) return true;

  const from = format(range.from, "yyyy-MM-dd");
  const to = range.to ? format(range.to, "yyyy-MM-dd") : from;

  return transaction.date >= from && transaction.date <= to;
}

const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
  onImportTransactions,
  selectedCurrency,
  isLoading,
  isImporting,
}) => {
  const fileInputRef = useRef(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState(undefined);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [importFeedback, setImportFeedback] = useState(null);

  const currencyTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => (transaction.currency || "INR") === selectedCurrency
      ),
    [transactions, selectedCurrency]
  );

  const categoryOptions = useMemo(() => {
    const names = new Set(
      currencyTransactions.map((transaction) => transaction.category)
    );
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [currencyTransactions]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return currencyTransactions.filter((transaction) => {
      if (typeFilter !== "all" && transaction.type !== typeFilter) return false;
      if (categoryFilter !== "all" && transaction.category !== categoryFilter) {
        return false;
      }
      if (!matchesSearch(transaction, query)) return false;
      if (!matchesDateRange(transaction, dateRange)) return false;
      return true;
    });
  }, [
    currencyTransactions,
    typeFilter,
    categoryFilter,
    searchQuery,
    dateRange,
  ]);

  const visibleTransactions = useMemo(
    () => filteredTransactions.slice(0, TRANSACTION_LIMIT),
    [filteredTransactions]
  );

  const hiddenCount = Math.max(
    0,
    filteredTransactions.length - visibleTransactions.length
  );

  const hasActiveFilters =
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    searchQuery.trim() !== "" ||
    Boolean(dateRange?.from);

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
    setDateRange(undefined);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImportFeedback(null);

    try {
      const text = await file.text();
      const { rows, errors: parseErrors } = parseTransactionCsv(text, {
        defaultCurrency: selectedCurrency,
      });

      if (rows.length === 0) {
        setImportFeedback({
          type: "error",
          messages:
            parseErrors.length > 0
              ? parseErrors.map(
                  (entry) => `Line ${entry.line}: ${entry.message}`
                )
              : ["No valid rows found in the file."],
        });
        return;
      }

      const result = await onImportTransactions(rows);

      const messages = [];
      if (result.imported > 0) {
        messages.push(
          `Imported ${result.imported} transaction${result.imported === 1 ? "" : "s"}.`
        );
      }
      if (parseErrors.length > 0) {
        messages.push(
          `${parseErrors.length} row${parseErrors.length === 1 ? "" : "s"} skipped.`
        );
      }
      result.errors?.forEach((entry) => {
        messages.push(entry.message);
      });

      setImportFeedback({
        type: result.imported > 0 ? "success" : "error",
        messages,
        skipped: parseErrors.map(
          (entry) => `Line ${entry.line}: ${entry.message}`
        ),
      });
    } catch {
      setImportFeedback({
        type: "error",
        messages: ["Could not read the CSV file. Please try again."],
      });
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="gap-2 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm">Activity</CardTitle>
            <CardDescription className="text-xs">
              Latest {visibleTransactions.length}
              {hiddenCount > 0 ? ` of ${filteredTransactions.length}` : ""}{" "}
              · {currencyTransactions.length} total in {selectedCurrency}
            </CardDescription>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={downloadTransactionTemplate}
            >
              <Download className="size-3.5" />
              Template
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              disabled={isImporting}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              {isImporting ? "…" : "Import"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {TYPE_FILTERS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={typeFilter === option.value ? "default" : "outline"}
              className="h-6 px-2 text-xs"
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground"
              onClick={clearFilters}
            >
              Clear
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <Input
            type="search"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field-control h-7"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="field-control h-7 w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoryOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangeField
            value={dateRange}
            onChange={setDateRange}
            className="h-7"
            placeholder="Date range"
          />
        </div>

        {importFeedback ? (
          <div
            role="status"
            className={cn(
              "text-xs leading-snug",
              importFeedback.type === "success"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
            )}
          >
            {importFeedback.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}

        {hiddenCount > 0 ? (
          <p className="text-xs text-muted-foreground">
            Narrow filters to see older matches ({hiddenCount} hidden).
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-1" aria-busy="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-7 animate-pulse bg-muted/60 ring-1 ring-foreground/5"
              />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {hasActiveFilters
              ? "No transactions match your filters."
              : `No ${selectedCurrency} transactions yet.`}
          </p>
        ) : (
          <ul className="divide-y divide-border ring-1 ring-foreground/10">
            {visibleTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="group relative flex items-center gap-2 px-1.5 py-1.5 transition-colors hover:bg-muted/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-medium">
                      {transaction.category}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 tabular-nums text-xs font-semibold",
                        transaction.type === "income"
                          ? "text-income"
                          : "text-expense"
                      )}
                    >
                      {formatAmount(transaction)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[0.65rem] text-muted-foreground">
                    <span className="truncate">
                      {transaction.description || "—"}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {format(parseISO(transaction.date), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
                <div className="relative shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[open=true]:opacity-100"
                    data-open={openMenuId === transaction.id}
                    aria-label="Transaction actions"
                    onClick={() =>
                      setOpenMenuId((current) =>
                        current === transaction.id ? null : transaction.id
                      )
                    }
                  >
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                  {openMenuId === transaction.id ? (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default"
                        aria-label="Close menu"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 z-50 mt-1 min-w-28 bg-popover p-1 shadow-md ring-1 ring-foreground/10">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-full justify-start gap-2 px-2 text-xs"
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit(transaction);
                          }}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-full justify-start gap-2 px-2 text-xs text-destructive hover:text-destructive"
                          onClick={() => {
                            setOpenMenuId(null);
                            onDelete(transaction);
                          }}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onImportTransactions: PropTypes.func.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  isImporting: PropTypes.bool,
};

TransactionList.defaultProps = {
  isLoading: false,
  isImporting: false,
};

export default TransactionList;
