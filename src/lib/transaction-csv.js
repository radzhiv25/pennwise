const VALID_TYPES = new Set(["income", "expense"]);
const VALID_CURRENCIES = new Set(["INR", "USD", "GBP"]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const TRANSACTION_CSV_HEADERS = [
  "type",
  "amount",
  "category",
  "date",
  "description",
  "currency",
];

export const TRANSACTION_CSV_TEMPLATE = `${TRANSACTION_CSV_HEADERS.join(",")}
income,5000,Salary,2024-01-15,Monthly salary,INR
expense,1200,Rent,2024-01-01,,INR
expense,45.50,Groceries,2024-01-16,Weekly shop,USD
`;

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function normalizeHeader(header) {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseDateValue(value) {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return value;
}

/**
 * @param {string} text
 * @param {{ defaultCurrency?: string }} [options]
 * @returns {{ rows: Array<{ type: string, amount: number, category: string, date: string, description: string, currency: string }>, errors: Array<{ line: number, message: string }> }}
 */
export function parseTransactionCsv(text, options = {}) {
  const { defaultCurrency = "INR" } = options;
  const errors = [];
  const rows = [];

  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { rows, errors: [{ line: 0, message: "File is empty." }] };
  }

  const headerCells = parseCsvLine(lines[0]).map(normalizeHeader);
  const required = ["type", "amount", "category", "date"];
  const missing = required.filter((name) => !headerCells.includes(name));

  if (missing.length > 0) {
    return {
      rows,
      errors: [
        {
          line: 1,
          message: `Missing required column(s): ${missing.join(", ")}. Expected: ${TRANSACTION_CSV_HEADERS.join(", ")}`,
        },
      ],
    };
  }

  const columnIndex = Object.fromEntries(
    headerCells.map((name, index) => [name, index])
  );

  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    const lineNumber = lineIndex + 1;
    const cells = parseCsvLine(lines[lineIndex]);

    if (cells.length === 1 && cells[0] === "") {
      continue;
    }

    const getCell = (name) => cells[columnIndex[name]] ?? "";

    const type = getCell("type").toLowerCase();
    if (!VALID_TYPES.has(type)) {
      errors.push({
        line: lineNumber,
        message: `Invalid type "${getCell("type")}". Use income or expense.`,
      });
      continue;
    }

    const amountRaw = getCell("amount").replace(/,/g, "");
    const amount = Number.parseFloat(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push({
        line: lineNumber,
        message: `Invalid amount "${getCell("amount")}".`,
      });
      continue;
    }

    const category = getCell("category").trim();
    if (!category) {
      errors.push({ line: lineNumber, message: "Category is required." });
      continue;
    }

    const date = parseDateValue(getCell("date").trim());
    if (!date) {
      errors.push({
        line: lineNumber,
        message: `Invalid date "${getCell("date")}". Use YYYY-MM-DD.`,
      });
      continue;
    }

    const currency = (getCell("currency").trim() || defaultCurrency).toUpperCase();
    if (!VALID_CURRENCIES.has(currency)) {
      errors.push({
        line: lineNumber,
        message: `Invalid currency "${getCell("currency")}". Use INR, USD, or GBP.`,
      });
      continue;
    }

    rows.push({
      type,
      amount: Math.round(amount * 100) / 100,
      category,
      date,
      description: getCell("description").trim(),
      currency,
    });
  }

  return { rows, errors };
}

export function downloadTransactionTemplate() {
  const blob = new Blob([TRANSACTION_CSV_TEMPLATE], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pennwise-transactions-template.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
