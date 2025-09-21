// Mock data for testing the expense tracker
export const mockTransactions = [
    // INR Transactions
    {
        id: "1",
        type: "income",
        amount: 5000,
        category: "Salary",
        date: "2024-01-01",
        description: "Monthly salary",
        status: "done",
        currency: "INR"
    },
    {
        id: "2",
        type: "income",
        amount: 1200,
        category: "Freelance",
        date: "2024-01-05",
        description: "Web development project",
        status: "done",
        currency: "INR"
    },
    {
        id: "3",
        type: "expense",
        amount: 800,
        category: "Rent",
        date: "2024-01-01",
        description: "Monthly rent payment",
        status: "done",
        currency: "INR"
    },
    {
        id: "4",
        type: "expense",
        amount: 300,
        category: "Groceries",
        date: "2024-01-02",
        description: "Weekly grocery shopping",
        status: "done",
        currency: "INR"
    },
    {
        id: "5",
        type: "expense",
        amount: 150,
        category: "Transportation",
        date: "2024-01-03",
        description: "Fuel and public transport",
        status: "done",
        currency: "INR"
    },
    {
        id: "6",
        type: "expense",
        amount: 200,
        category: "Entertainment",
        date: "2024-01-04",
        description: "Movie tickets and dinner",
        status: "done",
        currency: "INR"
    },
    {
        id: "7",
        type: "income",
        amount: 800,
        category: "Investment",
        date: "2024-01-10",
        description: "Dividend from stocks",
        status: "done",
        currency: "INR"
    },
    {
        id: "8",
        type: "expense",
        amount: 100,
        category: "Utilities",
        date: "2024-01-08",
        description: "Electricity bill",
        status: "done",
        currency: "INR"
    },
    {
        id: "9",
        type: "expense",
        amount: 250,
        category: "Healthcare",
        date: "2024-01-12",
        description: "Doctor visit and medicine",
        status: "done",
        currency: "INR"
    },
    {
        id: "10",
        type: "expense",
        amount: 400,
        category: "Groceries",
        date: "2024-01-15",
        description: "Monthly grocery shopping",
        status: "done",
        currency: "INR"
    },
    {
        id: "11",
        type: "income",
        amount: 300,
        category: "Side Hustle",
        date: "2024-01-18",
        description: "Online tutoring",
        status: "done",
        currency: "INR"
    },
    {
        id: "12",
        type: "expense",
        amount: 80,
        category: "Transportation",
        date: "2024-01-20",
        description: "Uber rides",
        status: "done",
        currency: "INR"
    },
    {
        id: "13",
        type: "expense",
        amount: 120,
        category: "Entertainment",
        date: "2024-01-22",
        description: "Concert tickets",
        status: "done",
        currency: "INR"
    },
    {
        id: "14",
        type: "expense",
        amount: 60,
        category: "Utilities",
        date: "2024-01-25",
        description: "Internet bill",
        status: "done",
        currency: "INR"
    },
    {
        id: "15",
        type: "income",
        amount: 5000,
        category: "Salary",
        date: "2024-02-01",
        description: "Monthly salary",
        status: "done",
        currency: "INR"
    },
    {
        id: "16",
        type: "expense",
        amount: 800,
        category: "Rent",
        date: "2024-02-01",
        description: "Monthly rent payment",
        status: "done",
        currency: "INR"
    },
    {
        id: "17",
        type: "expense",
        amount: 350,
        category: "Groceries",
        date: "2024-02-05",
        description: "Weekly grocery shopping",
        status: "done",
        currency: "INR"
    },
    {
        id: "18",
        type: "expense",
        amount: 180,
        category: "Transportation",
        date: "2024-02-08",
        description: "Fuel and public transport",
        status: "done",
        currency: "INR"
    },
    {
        id: "19",
        type: "expense",
        amount: 300,
        category: "Entertainment",
        date: "2024-02-10",
        description: "Restaurant and movies",
        status: "done",
        currency: "INR"
    },
    {
        id: "20",
        type: "expense",
        amount: 90,
        category: "Utilities",
        date: "2024-02-12",
        description: "Water bill",
        status: "done",
        currency: "INR"
    },
    // Additional transactions with different statuses for Kanban demo
    {
        id: "21",
        type: "expense",
        amount: 500,
        category: "Shopping",
        date: "2024-02-15",
        description: "New laptop purchase",
        status: "todo",
        currency: "INR"
    },
    {
        id: "22",
        type: "income",
        amount: 2000,
        category: "Freelance",
        date: "2024-02-16",
        description: "Website redesign project",
        status: "in-progress",
        currency: "INR"
    },
    {
        id: "23",
        type: "expense",
        amount: 1200,
        category: "Travel",
        date: "2024-02-18",
        description: "Vacation booking",
        status: "todo",
        currency: "INR"
    },
    {
        id: "24",
        type: "expense",
        amount: 300,
        category: "Healthcare",
        date: "2024-02-20",
        description: "Dental checkup",
        status: "in-progress",
        currency: "INR"
    },
    {
        id: "25",
        type: "income",
        amount: 1500,
        category: "Investment",
        date: "2024-02-22",
        description: "Stock dividends",
        status: "todo",
        currency: "INR"
    },
    // USD Transactions
    {
        id: "26",
        type: "income",
        amount: 5000,
        category: "Salary",
        date: "2024-01-01",
        description: "US Salary",
        status: "done",
        currency: "USD"
    },
    {
        id: "27",
        type: "expense",
        amount: 1200,
        category: "Rent",
        date: "2024-01-01",
        description: "US Apartment rent",
        status: "done",
        currency: "USD"
    },
    {
        id: "28",
        type: "expense",
        amount: 300,
        category: "Groceries",
        date: "2024-01-02",
        description: "US Grocery shopping",
        status: "done",
        currency: "USD"
    },
    {
        id: "29",
        type: "income",
        amount: 800,
        category: "Freelance",
        date: "2024-01-05",
        description: "US Freelance project",
        status: "in-progress",
        currency: "USD"
    },
    {
        id: "30",
        type: "expense",
        amount: 200,
        category: "Entertainment",
        date: "2024-01-04",
        description: "US Movie tickets",
        status: "todo",
        currency: "USD"
    },
    // GBP Transactions
    {
        id: "31",
        type: "income",
        amount: 3000,
        category: "Salary",
        date: "2024-01-01",
        description: "UK Salary",
        status: "done",
        currency: "GBP"
    },
    {
        id: "32",
        type: "expense",
        amount: 800,
        category: "Rent",
        date: "2024-01-01",
        description: "UK Apartment rent",
        status: "done",
        currency: "GBP"
    },
    {
        id: "33",
        type: "expense",
        amount: 150,
        category: "Groceries",
        date: "2024-01-02",
        description: "UK Grocery shopping",
        status: "done",
        currency: "GBP"
    },
    {
        id: "34",
        type: "income",
        amount: 500,
        category: "Freelance",
        date: "2024-01-05",
        description: "UK Freelance project",
        status: "in-progress",
        currency: "GBP"
    },
    {
        id: "35",
        type: "expense",
        amount: 100,
        category: "Entertainment",
        date: "2024-01-04",
        description: "UK Movie tickets",
        status: "todo",
        currency: "GBP"
    }
];

// Predefined categories
export const categories = [
    "Salary",
    "Freelance",
    "Investment",
    "Side Hustle",
    "Rent",
    "Groceries",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Education",
    "Shopping",
    "Food & Dining",
    "Travel",
    "Insurance",
    "Other"
];

// Currency symbols and exchange rates
export const currencies = {
    INR: { symbol: "₹", name: "Indian Rupee", rate: 1 },
    USD: { symbol: "$", name: "US Dollar", rate: 83.5 },
    GBP: { symbol: "£", name: "British Pound", rate: 105.2 }
};