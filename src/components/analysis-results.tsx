'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Line, LineChart } from 'recharts'
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Coffee,
  Target,
  Dumbbell,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

const chartConfig = {
  value: {
    label: "Amount",
  },
  amount: {
    label: "Amount",
  },
  income: {
    label: "Income",
  },
  expense: {
    label: "Expense",
  },
} satisfies ChartConfig

interface AnalysisResultsProps {
  data: {
    currency: string
    financialScore: number
    totalIncome: number
    totalExpenses: number
    categories: Array<{ name: string; value: number; percentage: number }>
    subscriptions: Array<{ name: string; amount: number; category: string }>
    weekdaySpending: Array<{ day: string; amount: number }>
    cashFlow: Array<{ date: string; income: number; expense: number }>
    topVendors: Array<{ name: string; amount: number; transactions: number }>
    insights: {
      weekendPattern: string
      peakHours: string
      yearEndProjection: string
      seasonalAlert: string
      emergencyFundRecommendation: string
    }
    opportunities: Array<{
      type: string
      title: string
      current: string
      savings: number
      description: string
    }>
    transactionInsights: Array<{ original: string; decoded: string; category: string }>
    anomalies: Array<{ type: string; message: string }>
    scoreImprovements: Array<{ points: number; title: string; description: string; type: string }>
    forecast: {
      projectedExpenses: number
      expectedIncome: number
      netPosition: number
    }
  }
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  const netBalance = data.totalIncome - data.totalExpenses
  const monthlySubscriptions = data.subscriptions.reduce((sum, sub) => sum + sub.amount, 0)
  const currency = data.currency || '$'

  const formatMoney = (amount: number, decimals: number = 2) => {
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    return `${currency}${formatted}`
  }

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'coffee': return Coffee
      case 'gym': return Dumbbell
      case 'savings': return PiggyBank
      case 'entertainment': return Target
      default: return Target
    }
  }

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'coffee': return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' }
      case 'gym': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' }
      case 'savings': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' }
      case 'entertainment': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' }
      default: return { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-600 dark:text-gray-400' }
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Financial Health Score</h2>
              <p className="text-muted-foreground">Based on your income, expenses, and spending patterns</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{data.financialScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          </div>
          <Progress value={data.financialScore} className="mt-6 h-3" />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Income</p>
              <p className="text-2xl font-semibold text-green-600">{formatMoney(data.totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expenses</p>
              <p className="text-2xl font-semibold text-red-600">{formatMoney(data.totalExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className={`text-2xl font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatMoney(netBalance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={data.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="space-y-4">
              {data.categories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="font-semibold">{formatMoney(category.value)}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{category.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-primary">{formatMoney(monthlySubscriptions)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatMoney(monthlySubscriptions * 12)} per year
            </p>
          </div>
          <div className="space-y-3">
            {data.subscriptions.map((sub) => (
              <div key={sub.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{sub.name}</p>
                  <Badge variant="secondary" className="mt-1">
                    {sub.category}
                  </Badge>
                </div>
                <p className="font-semibold">{formatMoney(sub.amount)}/mo</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending Behavior Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Spending by Day of Week</h4>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={data.weekdaySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert>
                <Calendar className="w-4 h-4" />
                <AlertDescription>
                  <strong>Weekend Pattern:</strong> {data.insights.weekendPattern}
                </AlertDescription>
              </Alert>
              <Alert>
                <Clock className="w-4 h-4" />
                <AlertDescription>
                  <strong>Peak Hours:</strong> {data.insights.peakHours}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.opportunities.map((opportunity, index) => {
              const Icon = getOpportunityIcon(opportunity.type)
              const colors = getOpportunityColor(opportunity.type)
              return (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 ${colors.bg} rounded-lg`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{opportunity.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {opportunity.current}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-600">{formatMoney(opportunity.savings)}</span>
                        <span className="text-sm text-muted-foreground">potential annual savings</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {opportunity.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={data.cashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
            </LineChart>
          </ChartContainer>
          <Alert className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-950">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Cash Flow Warning:</strong> You may experience cash shortage around the 20th of the month. Consider timing your expenses accordingly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topVendors.map((vendor, index) => (
              <div key={vendor.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{vendor.name}</p>
                    <p className="text-sm text-muted-foreground">{vendor.transactions} transactions</p>
                  </div>
                </div>
                <p className="text-lg font-bold">{formatMoney(vendor.amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Future Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3-Month Forecast</h4>
              <p className="text-muted-foreground mb-3">Based on current spending trends</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Projected Expenses</span>
                  <span className="font-semibold">{formatMoney(data.forecast.projectedExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Income</span>
                  <span className="font-semibold text-green-600">{formatMoney(data.forecast.expectedIncome)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Net Position</span>
                  <span className={`font-semibold ${data.forecast.netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.forecast.netPosition >= 0 ? '+' : ''}{formatMoney(Math.abs(data.forecast.netPosition))}
                  </span>
                </div>
              </div>
            </div>
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <TrendingUp className="w-4 h-4" />
              <AlertDescription>
                <strong>Year-End Projection:</strong> {data.insights.yearEndProjection}
              </AlertDescription>
            </Alert>
            <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950">
              <Sparkles className="w-4 h-4" />
              <AlertDescription>
                <strong>Seasonal Alert:</strong> {data.insights.seasonalAlert}
              </AlertDescription>
            </Alert>
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
              <PiggyBank className="w-4 h-4" />
              <AlertDescription>
                <strong>Emergency Fund:</strong> {data.insights.emergencyFundRecommendation}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.transactionInsights.map((transaction, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-muted-foreground">{transaction.original}</span>
                  <Badge>Decoded</Badge>
                </div>
                <p className="font-medium">{transaction.decoded}</p>
                <p className="text-sm text-muted-foreground">Category: {transaction.category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.anomalies.map((anomaly, index) => {
              const getBorderColor = () => {
                if (anomaly.type === 'error') return 'border-red-200 bg-red-50 dark:bg-red-950'
                if (anomaly.type === 'warning') return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950'
                return 'border-green-200 bg-green-50 dark:bg-green-950'
              }
              const getIcon = () => {
                if (anomaly.type === 'error') return XCircle
                if (anomaly.type === 'warning') return AlertTriangle
                return CheckCircle2
              }
              const Icon = getIcon()
              return (
                <Alert key={index} className={getBorderColor()}>
                  <Icon className="w-4 h-4" />
                  <AlertDescription>{anomaly.message}</AlertDescription>
                </Alert>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Improve Your Financial Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.scoreImprovements.map((improvement, index) => {
              const Icon = improvement.type === 'up' ? ArrowUpRight : ArrowDownRight
              const iconColor = improvement.type === 'up' ? 'text-green-600' : 'text-orange-600'
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    +{improvement.points}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{improvement.title}</p>
                    <p className="text-sm text-muted-foreground">{improvement.description}</p>
                  </div>
                  <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

