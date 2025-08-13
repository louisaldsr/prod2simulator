import Simulator from '@/components/Simulator';
import Title from '@/components/Title';

export default async function Home({
  searchParams,
}: {
  searchParams: { day?: string };
}) {
  const params = await searchParams;
  const selectedDay = Number(params.day) ?? 1;
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <Title />
        </header>
        <main>
          <Simulator selectedDay={selectedDay} />
        </main>
      </div>
    </div>
  );
}
