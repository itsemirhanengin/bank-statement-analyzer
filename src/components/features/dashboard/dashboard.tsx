import { AnalysisResult } from "@/lib/schemas";
import { FinancialHealth } from "./financial-health";
import { ExpenseChart } from "./expense-chart";
import { SubscriptionList } from "./subscription-list";
import { SpendingTrends } from "./spending-trends";
import { OptimizationOpportunities } from "./optimization-opportunities";
import { CashFlowChart } from "./cash-flow-chart";
import { TopVendors } from "./top-vendors";
import { TransactionInsights } from "./transaction-insights";
import { Anomalies } from "./anomalies";
import { ScoreImprovement } from "./score-improvement";
import { FinancialRecommendations } from "./financial-recommendations";
import { Button } from "@/components/ui/button";

type DashboardProps = {
  data: AnalysisResult;
  onReset: () => void;
};

export function Dashboard({ data, onReset }: DashboardProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <Button variant="outline" onClick={onReset}>
          Analyze Another Statement
        </Button>
      </div>

      <FinancialHealth data={data} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ExpenseChart data={data} />
        <SubscriptionList data={data} />
      </div>

      <SpendingTrends data={data} />

      <OptimizationOpportunities data={data} />

      <CashFlowChart data={data} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TopVendors data={data} />
        <FinancialRecommendations data={data} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TransactionInsights data={data} />
        <Anomalies data={data} />
      </div>

      <ScoreImprovement data={data} />
    </div>
  );
}
