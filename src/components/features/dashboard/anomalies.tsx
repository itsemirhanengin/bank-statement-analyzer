import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnalysisResult } from "@/lib/schemas";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type AnomaliesProps = {
  data: AnalysisResult;
};

export function Anomalies({ data }: AnomaliesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Detection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.anomalies.map((anomaly, index) => {
            const getBorderColor = () => {
              if (anomaly.type === "error")
                return "border-red-200 bg-red-50 dark:bg-red-950";
              if (anomaly.type === "warning")
                return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950";
              return "border-green-200 bg-green-50 dark:bg-green-950";
            };
            const getIcon = () => {
              if (anomaly.type === "error") return XCircle;
              if (anomaly.type === "warning") return AlertTriangle;
              return CheckCircle2;
            };
            const Icon = getIcon();
            return (
              <Alert key={index} className={getBorderColor()}>
                <Icon className="w-4 h-4" />
                <AlertDescription>{anomaly.message}</AlertDescription>
              </Alert>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
