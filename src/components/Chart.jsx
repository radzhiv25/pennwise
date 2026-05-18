"use client";

import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import {
  CHART_TYPES,
  buildCategoryChartConfig,
  buildExpenseCategoryData,
  buildMonthlyData,
  buildPieCategoryData,
  buildTimeSeriesData,
  filterByCurrency,
  flowChartConfig,
  getCurrencySymbol,
} from "@/lib/chart-data";

const CHART_HEIGHT = "min-h-[280px] w-full";

function formatAxisDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const Chart = ({ transactions, selectedCurrency }) => {
  const [chartType, setChartType] = useState("line");
  const symbol = getCurrencySymbol(selectedCurrency);

  const filtered = useMemo(
    () => filterByCurrency(transactions, selectedCurrency),
    [transactions, selectedCurrency]
  );

  const timeSeries = useMemo(() => buildTimeSeriesData(filtered), [filtered]);
  const monthly = useMemo(() => buildMonthlyData(filtered), [filtered]);
  const expenseCategories = useMemo(
    () => buildExpenseCategoryData(filtered),
    [filtered]
  );
  const pieData = useMemo(() => buildPieCategoryData(filtered), [filtered]);

  const categoryConfig = useMemo(
    () => buildCategoryChartConfig(expenseCategories),
    [expenseCategories]
  );

  const activeMeta = CHART_TYPES.find((t) => t.id === chartType) ?? CHART_TYPES[0];

  const formatMoney = (value) => `${symbol}${Number(value).toLocaleString()}`;

  const tooltipFormatter = (value, name) => (
    <div className="flex w-full items-center justify-between gap-4">
      <span className="text-muted-foreground">{name}</span>
      <span className="font-mono font-medium tabular-nums">
        {formatMoney(value)}
      </span>
    </div>
  );

  if (filtered.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial charts</CardTitle>
          <CardDescription>
            Visualize your data with shadcn chart components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No data for this currency. Add transactions to see charts.
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ChartContainer config={flowChartConfig} className={CHART_HEIGHT}>
            <LineChart data={timeSeries} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatAxisDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => `${symbol}${v}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => formatAxisDate(v)}
                    formatter={tooltipFormatter}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="var(--color-expense)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        );

      case "area":
        return (
          <ChartContainer config={flowChartConfig} className={CHART_HEIGHT}>
            <AreaChart data={timeSeries} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatAxisDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => `${symbol}${v}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => formatAxisDate(v)}
                    formatter={tooltipFormatter}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="income"
                fill="var(--color-income)"
                stroke="var(--color-income)"
                fillOpacity={0.35}
                stackId="a"
              />
              <Area
                type="monotone"
                dataKey="expense"
                fill="var(--color-expense)"
                stroke="var(--color-expense)"
                fillOpacity={0.35}
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        );

      case "bar":
        return (
          <ChartContainer config={flowChartConfig} className={CHART_HEIGHT}>
            <BarChart data={monthly} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => `${symbol}${v}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="expense"
                fill="var(--color-expense)"
                radius={[0, 0, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        );

      case "pie":
        if (pieData.length === 0) {
          return (
            <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No expense transactions to chart.
            </p>
          );
        }
        return (
          <ChartContainer config={categoryConfig} className={CHART_HEIGHT}>
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                strokeWidth={2}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        );

      case "radial":
        if (expenseCategories.length === 0) {
          return (
            <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No expense transactions to chart.
            </p>
          );
        }
        return (
          <ChartContainer config={categoryConfig} className={CHART_HEIGHT}>
            <RadialBarChart
              data={expenseCategories}
              innerRadius={36}
              outerRadius={110}
              dataKey="amount"
              nameKey="category"
            >
              <ChartTooltip
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />
              <RadialBar
                background
                dataKey="amount"
                cornerRadius={0}
                label={{ position: "insideStart", fill: "var(--background)" }}
              />
              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent nameKey="category" />}
              />
            </RadialBarChart>
          </ChartContainer>
        );

      case "radar":
        if (expenseCategories.length === 0) {
          return (
            <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No expense transactions to chart.
            </p>
          );
        }
        return (
          <ChartContainer config={categoryConfig} className={CHART_HEIGHT}>
            <RadarChart data={expenseCategories} outerRadius={96}>
              <ChartTooltip
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
              <PolarGrid />
              <Radar
                dataKey="amount"
                fill="var(--chart-1)"
                fillOpacity={0.45}
                stroke="var(--chart-1)"
              />
            </RadarChart>
          </ChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>{activeMeta.title}</CardTitle>
            <CardDescription>{activeMeta.description}</CardDescription>
          </div>
          <FormField label="Chart type" className="w-full sm:w-44">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger id="chart-type">
                <SelectValue placeholder="Select chart" />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
};

Chart.propTypes = {
  transactions: PropTypes.array.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
};

export default Chart;
