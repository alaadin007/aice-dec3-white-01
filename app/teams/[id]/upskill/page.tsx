import { getTeams } from '@/lib/storage';
import { UpskillPageClient } from './upskill-page-client';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const teams = getTeams();
  return teams.map(team => ({
    id: team.id
  }));
}

export default function UpskillPage({ params }: { params: { id: string } }) {
  return <UpskillPageClient params={params} />;
}