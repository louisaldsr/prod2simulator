import RankingTable from "./RankingTable";

export default function RankingPanel() {
  return (
    <section className="bg-white col-span-4 rounded-xl shadow p-6 h-fit">
      <h2>Ranking</h2>
      <RankingTable />
    </section>
  );
}
