import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { AnalysisResult } from "@/lib/schemas";

type TopVendorsProps = {
  data: AnalysisResult;
};

export function TopVendors({ data }: TopVendorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Vendors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.topVendors.map((vendor, index) => (
            <div
              key={vendor.name}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold">{vendor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {vendor.transactions} transactions
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold">
                {formatMoney(vendor.amount, data.currency)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
