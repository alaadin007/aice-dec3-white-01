import { getTeams } from '@/lib/storage';
import { TeamPageClient } from './team-page-client';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const teams = getTeams();
  return teams.map(team => ({
    id: team.id
  }));
}

export default function TeamPage({ params }: { params: { id: string } }) {
  return <TeamPageClient params={params} />;
}