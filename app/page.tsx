import TokenList from "@/app/components/TokenList";
import TokenPieChart from "./components/TokenPieChart";

export default function TokenBalancesPage() {
  return (
    <main className="max-w-3xl mx-auto mt-8">
      <TokenPieChart />
      {/* <TokenList /> */}
    </main>
  );
}
