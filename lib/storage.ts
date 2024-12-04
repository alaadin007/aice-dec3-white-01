import { AssessmentResult, Team, TeamInvite, ShareableLink } from './types';
import { mockAssessments, mockTeams } from './mock-data';

const STORAGE_KEY = 'aice_assessments';
const TEAMS_KEY = 'aice_teams';
const INVITES_KEY = 'aice_invites';
const SHAREABLE_LINKS_KEY = 'aice_shareable_links';

export function saveAssessment(assessment: AssessmentResult): void {
  try {
    const assessments = getAssessments();
    assessments.unshift(assessment);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
    }
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
}

export function getAssessments(): AssessmentResult[] {
  if (typeof window === 'undefined') return mockAssessments;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : mockAssessments;
  } catch (error) {
    console.error('Error reading assessments:', error);
    return mockAssessments;
  }
}

export function saveTeam(team: Team): void {
  try {
    const teams = getTeams();
    teams.push(team);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    }
  } catch (error) {
    console.error('Error saving team:', error);
    throw error;
  }
}

export function getTeams(): Team[] {
  if (typeof window === 'undefined') return mockTeams;

  try {
    const data = localStorage.getItem(TEAMS_KEY);
    return data ? JSON.parse(data) : mockTeams;
  } catch (error) {
    console.error('Error reading teams:', error);
    return mockTeams;
  }
}

export function saveInvite(invite: TeamInvite): void {
  try {
    const invites = getInvites();
    invites.push(invite);
    if (typeof window !== 'undefined') {
      localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
    }
  } catch (error) {
    console.error('Error saving invite:', error);
    throw error;
  }
}

export function getInvites(): TeamInvite[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(INVITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading invites:', error);
    return [];
  }
}

export function createShareableLink(userId: string, password: string): ShareableLink {
  const link: ShareableLink = {
    id: `share_${Date.now()}`,
    userId,
    password,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    createdAt: new Date().toISOString(),
  };

  try {
    const links = getShareableLinks();
    links.push(link);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SHAREABLE_LINKS_KEY, JSON.stringify(links));
    }
    return link;
  } catch (error) {
    console.error('Error creating shareable link:', error);
    throw error;
  }
}

export function getShareableLinks(): ShareableLink[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(SHAREABLE_LINKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading shareable links:', error);
    return [];
  }
}