import { getShareableLinks } from '@/lib/storage';
import { SharedDashboardClient } from './shared-dashboard-client';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const links = getShareableLinks();
  return links.map(link => ({
    id: link.id
  }));
}

export default function SharedPage({ params }: { params: { id: string } }) {
  return <SharedDashboardClient params={params} />;
}