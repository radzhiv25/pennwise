# PennWise

A simple and intuitive expense tracker application built with ReactJS and TailwindCSS. This application allows users to add, delete, and edit transactions, categorize them as income or expenses, and visualize their financial data. It helps you manage your finances effectively by keeping track of all your transactions in one place.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Demo

Check out the live demo: [PennWise](https://pennwise.vercel.app/)

## Features

- **Add New Transactions**: Record income and expenses by specifying the amount, category, date, and description.
- **Edit Transactions**: Modify existing transactions directly from the transaction list.
- **Delete Transactions**: Remove transactions that are no longer needed.
- **View Summary**: See a summary of total income, total expenses, and the balance (Income - Expenses).
- **Visualize Data**: View a chart that visually represents income and expenses over time.
- **Responsive Design**: Seamlessly use the application on any device, thanks to TailwindCSS.

## Installation

To get a local copy up and running, follow these simple steps:

### Prerequisites

- Node.js (version 12 or higher)
- npm (version 6 or higher) or yarn

### Installation Steps

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/expense-tracker.git
    cd expense-tracker
    ```

2. **Install dependencies:**

    ```sh
    npm install
    # or if you prefer yarn
    yarn install
    ```

## Usage

1. **Start the development server:**

    ```sh
    npm start
    # or if you prefer yarn
    yarn start
    ```

2. **Open your browser and navigate to `http://localhost:5173`**

3. **Use the application to manage your transactions.**

## Technologies Used

- **ReactJS**: A JavaScript library for building user interfaces, especially single-page applications, using a component-based architecture.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Chart.js**: A popular JavaScript library for creating charts to visualize your data.
- **React Icons**: A library of popular icons for React applications.
- **Supabase**: Managed Postgres database for persisting transactions and preferences.

## Environment Variables

Create a `.env` file at the project root with the following variables (these are required for Supabase connectivity):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Refer to the [Supabase documentation](https://supabase.com/docs/guides/getting-started/quickstarts) to obtain these values.

## Project Structure

```plaintext
├── src
│   ├── components
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Summary.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   ├── Summary.jsx
│   │   └── ...
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── ...
├── tailwind.config.js
├── package.json
└── ...
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
