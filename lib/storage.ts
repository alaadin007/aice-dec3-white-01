import { AssessmentResult, Team, TeamInvite, ShareableLink } from './types';

const STORAGE_KEY = 'aice_assessments';
const TEAMS_KEY = 'aice_teams';
const INVITES_KEY = 'aice_invites';
const SHAREABLE_LINKS_KEY = 'aice_shareable_links';

export function saveAssessment(assessment: AssessmentResult): void {
  try {
    const assessments = getAssessments();
    assessments.unshift(assessment); // Add to beginning of array
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
}

export function getAssessments(): AssessmentResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading assessments:', error);
    return [];
  }
}

export function saveTeam(team: Team): void {
  try {
    const teams = getTeams();
    teams.push(team);
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  } catch (error) {
    console.error('Error saving team:', error);
    throw error;
  }
}

export function getTeams(): Team[] {
  try {
    const data = localStorage.getItem(TEAMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading teams:', error);
    return [];
  }
}

export function getTeamById(id: string): Team | null {
  try {
    const teams = getTeams();
    return teams.find(team => team.id === id) || null;
  } catch (error) {
    console.error('Error finding team:', error);
    return null;
  }
}

export function saveInvite(invite: TeamInvite): void {
  try {
    const invites = getInvites();
    invites.push(invite);
    localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
  } catch (error) {
    console.error('Error saving invite:', error);
    throw error;
  }
}

export function getInvites(): TeamInvite[] {
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
    id: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    password,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    createdAt: new Date().toISOString(),
  };

  try {
    const existingLinks = getShareableLinks();
    existingLinks.push(link);
    localStorage.setItem(SHAREABLE_LINKS_KEY, JSON.stringify(existingLinks));
    return link;
  } catch (error) {
    console.error('Error creating shareable link:', error);
    throw error;
  }
}

export function getShareableLinks(): ShareableLink[] {
  try {
    const data = localStorage.getItem(SHAREABLE_LINKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading shareable links:', error);
    return [];
  }
}

export function validateShareableLink(linkId: string, password: string): boolean {
  const links = getShareableLinks();
  const link = links.find(l => l.id === linkId);

  if (!link) return false;
  if (new Date(link.expiresAt) < new Date()) return false;
  return link.password === password;
}

export function getUserAssessments(userId: string): AssessmentResult[] {
  const allAssessments = getAssessments();
  return allAssessments.filter(assessment => 
    assessment.userInfo.email === userId
  );
}

export function updateTeam(team: Team): void {
  try {
    const teams = getTeams();
    const index = teams.findIndex(t => t.id === team.id);
    if (index !== -1) {
      teams[index] = team;
      localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    }
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
}

export function updateInvite(invite: TeamInvite): void {
  try {
    const invites = getInvites();
    const index = invites.findIndex(i => i.id === invite.id);
    if (index !== -1) {
      invites[index] = invite;
      localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
    }
  } catch (error) {
    console.error('Error updating invite:', error);
    throw error;
  }
}