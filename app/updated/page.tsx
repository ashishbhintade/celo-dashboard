import TokenList from "@/app/components/TokenList";
import TokenPieChartUpdated from "../components/TokenPieChartUpdated";

export default function TokenBalancesPage() {
  return (
    <main className="max-w-3xl mx-auto mt-8">
      <TokenPieChartUpdated />
      {/* <TokenList /> */}
      {/* <GetBalancesButton /> */}
    </main>
  );
}
