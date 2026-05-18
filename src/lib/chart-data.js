import { currencies } from "@/mockData";

export const CHART_TYPES = [
  {
    id: "line",
    label: "Line",
    title: "Income vs expenses over time",
    description: "Daily trends for income and spending",
  },
  {
    id: "area",
    label: "Area",
    title: "Income vs expenses (area)",
    description: "Filled view of daily cash flow",
  },
  {
    id: "bar",
    label: "Bar",
    title: "Monthly comparison",
    description: "Income and expenses by month",
  },
  {
    id: "pie",
    label: "Pie",
    title: "Spending by category",
    description: "Share of expenses per category",
  },
  {
    id: "radial",
    label: "Radial",
    title: "Top expense categories",
    description: "Radial breakdown of largest spends",
  },
  {
    id: "radar",
    label: "Radar",
    title: "Category overview",
    description: "Compare expense levels across categories",
  },
];

export function getCurrencySymbol(selectedCurrency) {
  return currencies[selectedCurrency]?.symbol ?? "₹";
}

export function filterByCurrency(transactions, selectedCurrency) {
  return transactions.filter(
    (transaction) => (transaction.currency || "INR") === selectedCurrency
  );
}

export function buildTimeSeriesData(transactions) {
  const grouped = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }
    if (transaction.type === "income") {
      acc[date].income += transaction.amount;
    } else {
      acc[date].expense += transaction.amount;
    }
    return acc;
  }, {});

  return Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

export function buildMonthlyData(transactions) {
  const grouped = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (transaction.type === "income") {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    return acc;
  }, {});

  return Object.values(grouped);
}

export function buildExpenseCategoryData(transactions, limit = 8) {
  const grouped = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category || "Other";
      if (!acc[category]) {
        acc[category] = { category, amount: 0, fill: "" };
      }
      acc[category].amount += transaction.amount;
      return acc;
    }, {});

  return Object.values(grouped)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
    .map((item, index) => ({
      ...item,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
}

export function buildPieCategoryData(transactions) {
  return buildExpenseCategoryData(transactions, 6).map((item) => ({
    name: item.category,
    value: item.amount,
    fill: item.fill,
  }));
}

export function buildCategoryChartConfig(categories) {
  const config = {};
  categories.forEach((item, index) => {
    config[item.category] = {
      label: item.category,
      color: `var(--chart-${(index % 5) + 1})`,
    };
  });
  return config;
}

export const flowChartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-2)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-5)",
  },
};
