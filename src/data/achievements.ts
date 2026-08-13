import { Achievement, UserProfile, DiscoveryResult, PathJourney } from '../types';

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'pioneer_explorer',
    title: 'Pioneer Explorer',
    description: 'Completed onboarding profile & defined your career interests.',
    icon: 'Compass',
    category: 'onboarding',
  },
  {
    id: 'path_finder',
    title: 'Path Finder',
    description: 'Discovered your first personalized AI-generated career paths.',
    icon: 'Sparkles',
    category: 'discovery',
  },
  {
    id: 'action_builder',
    title: 'Action Builder',
    description: 'Started your first hands-on recommended micro project.',
    icon: 'Rocket',
    category: 'project',
  },
  {
    id: 'route_navigator',
    title: 'Route Navigator',
    description: 'Completed a milestone step on your Life GPS route.',
    icon: 'CheckCircle2',
    category: 'navigation',
  },
  {
    id: 'global_supporter',
    title: 'Global Peer Supporter',
    description: 'Sent encouragement or kudos to a fellow young learner.',
    icon: 'Globe',
    category: 'community',
  },
  {
    id: 'global_visionary',
    title: 'Global Visionary',
    description: 'Explored how AI provides free career mentorship to youth worldwide.',
    icon: 'Award',
    category: 'onboarding',
  },
];

/**
 * Computes list of achievements with updated `unlocked` status
 */
export function getComputedAchievements(
  user: UserProfile | null,
  discoveryResult: DiscoveryResult | null,
  activeJourney: PathJourney | null
): Achievement[] {
  if (!user) {
    return ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false }));
  }

  const userUnlockedIds = new Set(user.unlockedAchievementIds || []);

  return ALL_ACHIEVEMENTS.map((a) => {
    let unlocked = userUnlockedIds.has(a.id);

    // Auto-evaluation rules
    if (!unlocked) {
      if (a.id === 'pioneer_explorer' && user.hasCompletedOnboarding) {
        unlocked = true;
      } else if (a.id === 'path_finder' && discoveryResult && discoveryResult.paths && discoveryResult.paths.length > 0) {
        unlocked = true;
      } else if (a.id === 'action_builder' && activeJourney?.recommendedProject?.isStarted) {
        unlocked = true;
      } else if (a.id === 'route_navigator' && activeJourney?.steps?.some((s) => s.status === 'completed')) {
        unlocked = true;
      }
    }

    return {
      ...a,
      unlocked,
    };
  });
}
