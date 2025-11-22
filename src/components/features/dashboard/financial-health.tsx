import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMoney } from "@/lib/utils";
import { AnalysisResult } from "@/lib/schemas";

type FinancialHealthProps = {
  data: AnalysisResult;
};

export function FinancialHealth({ data }: FinancialHealthProps) {
  const netBalance = data.totalIncome - data.totalExpenses;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-2">
              Financial Health Score
            </h2>
            <p className="text-muted-foreground">
              Based on your income, expenses, and spending patterns
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary">
              {data.financialScore}
            </div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
        </div>
        <Progress value={data.financialScore} className="mt-6 h-3" />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="text-2xl font-semibold text-green-600">
              {formatMoney(data.totalIncome, data.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-2xl font-semibold text-red-600">
              {formatMoney(data.totalExpenses, data.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p
              className={`text-2xl font-semibold ${
                netBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatMoney(netBalance, data.currency)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
