export default function RankingHeader() {
  const categoryClassName = 'px-2 py-2';
  return (
    <thead>
      <tr className="text-left text-sm font-bold border-b border-gray-300">
        <th className={categoryClassName}>POS</th>
        <th className={categoryClassName} colSpan={2}>
          TEAM
        </th>
        <th className={categoryClassName}>W</th>
        <th className={categoryClassName}>D</th>
        <th className={categoryClassName}>L</th>
        <th className={categoryClassName}>+</th>
        <th className={categoryClassName}>-</th>
        <th className={categoryClassName}>+/-</th>
        <th className={categoryClassName}>Pts</th>
      </tr>
    </thead>
  );
}
