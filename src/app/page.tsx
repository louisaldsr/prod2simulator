import Simulator from '@/app/components/Simulator';
import Title from '@/app/components/Title';
import { PageProps } from '../../.next/types/app/page';

export default async function Home(props: PageProps) {
  const params = await props.searchParams;
  const selectedDay = params?.day ? Number(params.day) : 1;

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
