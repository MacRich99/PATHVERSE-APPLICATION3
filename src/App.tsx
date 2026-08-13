import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DashboardScreen } from './components/DashboardScreen';
import { DiscoveryScreen } from './components/DiscoveryScreen';
import { LifeGpsScreen } from './components/LifeGpsScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { ContactsScreen } from './components/ContactsScreen';
import { PaywallModal } from './components/PaywallModal';
import { RevenueReportModal } from './components/RevenueReportModal';
import { ProfileModal } from './components/ProfileModal';
import { AchievementToast } from './components/AchievementToast';
import { GeminiMentorDrawer } from './components/GeminiMentorDrawer';
import { YearBadgeModal } from './components/YearBadgeModal';
import { ResourceMonitoringModal } from './components/ResourceMonitoringModal';
import { VerificationAssessmentModal } from './components/VerificationAssessmentModal';
import { ProgressNotificationsDrawer } from './components/ProgressNotificationsDrawer';
import { ArticleModal } from './components/ArticleModal';
import { AiDiagnosticQuiz } from './components/AiDiagnosticQuiz';
import { UserProfile, DiscoveryResult, DiscoveredPath, PathJourney, RecommendedProject, UserStageLevel, StepResource, LifeGpsStep, PathverseNotification } from './types';
import { discoverPaths, generateLifeGps } from './services/geminiService';
import { ALL_ACHIEVEMENTS } from './data/achievements';
import { generateResourcesForStep } from './data/stepResources';
import { WifiOff, Wifi } from 'lucide-react';

export default function App() {
  // Offline network status tracking
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Navigation & User State
  const [viewState, setViewState] = useState<'welcome' | 'auth' | 'onboarding' | 'quiz' | 'app'>(() => {
    const savedView = localStorage.getItem('pathverse_viewstate');
    if (savedView && ['welcome', 'auth', 'onboarding', 'quiz', 'app'].includes(savedView)) {
      return savedView as any;
    }
    return 'welcome';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'discovery' | 'lifeGps' | 'community' | 'contacts'>(() => {
    const savedTab = localStorage.getItem('pathverse_activetab');
    if (savedTab && ['home', 'discovery', 'lifeGps', 'community', 'contacts'].includes(savedTab)) {
      return savedTab as any;
    }
    return 'home';
  });

  // Achievement Toast State
  const [toastAchievement, setToastAchievement] = useState<{ title: string; description: string } | null>(null);

  // Gemini AI Mentor Drawer
  const [isMentorOpen, setIsMentorOpen] = useState(false);

  // User Profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pathverse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return null;
  });

  // Discovery Results State
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResult | null>(() => {
    const saved = localStorage.getItem('pathverse_discovery');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [isDiscovering, setIsDiscovering] = useState(false);

  // Active Journey / Life GPS State
  const [selectedPath, setSelectedPath] = useState<DiscoveredPath | null>(null);
  const [activeJourney, setActiveJourney] = useState<PathJourney | null>(() => {
    const saved = localStorage.getItem('pathverse_journey');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [isJourneyLoading, setIsJourneyLoading] = useState(false);

  // Modals State
  const [paywallPath, setPaywallPath] = useState<DiscoveredPath | null>(null);
  const [isRevenueReportOpen, setIsRevenueReportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);

  // Progress Loop Modals State
  const [activeResourceForModal, setActiveResourceForModal] = useState<StepResource | null>(null);
  const [articleResourceForModal, setArticleResourceForModal] = useState<StepResource | null>(null);
  const [assessmentStepForModal, setAssessmentStepForModal] = useState<LifeGpsStep | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Notifications List
  const [notificationsList, setNotificationsList] = useState<PathverseNotification[]>([
    {
      id: 'notif-1',
      title: 'Morning Mission Ready',
      message: 'Your today task is active. Review your step resources and complete your verification assessment.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'morning',
    },
  ]);

  // Handlers for Resource Monitoring & Verification Loop
  const handleOpenResource = (res: StepResource) => {
    if (res.type === 'article') {
      setArticleResourceForModal(res);
    } else {
      setActiveResourceForModal(res);
    }
  };

  const handleStartAssessment = (step: LifeGpsStep) => {
    setAssessmentStepForModal(step);
  };

  const handleConfirmUserCompletion = (resourceId: string) => {
    if (!user) return;
    const completedRes = user.completedResourceIds || [];
    if (!completedRes.includes(resourceId)) {
      const updatedUser: UserProfile = {
        ...user,
        completedResourceIds: [...completedRes, resourceId],
      };
      setUser(updatedUser);
      localStorage.setItem('pathverse_user', JSON.stringify(updatedUser));

      // Add Notification
      const newNotif: PathverseNotification = {
        id: `notif-${Date.now()}`,
        title: 'Resource Completion Logged',
        message: 'Marked resource as completed (User-reported). Take a verification assessment to unlock verified status!',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'completion',
      };
      setNotificationsList((prev) => [newNotif, ...prev]);
    }
  };

  const handlePassAssessment = (stepId: string, score: number) => {
    if (!user || !activeJourney) return;

    // Toggle step completion in journey
    const currentCompleted = activeJourney.completedStepIds || [];
    let newCompletedSteps = currentCompleted;
    if (!currentCompleted.includes(stepId)) {
      newCompletedSteps = [...currentCompleted, stepId];
      const updatedJourney: PathJourney = {
        ...activeJourney,
        completedStepIds: newCompletedSteps,
      };
      setActiveJourney(updatedJourney);
      localStorage.setItem('pathverse_journey', JSON.stringify(updatedJourney));
    }

    // Mark step verified in user profile
    const verifiedIds = user.verifiedStepIds || [];
    const masteredIds = user.masteredStepIds || [];
    const newVerified = verifiedIds.includes(stepId) ? verifiedIds : [...verifiedIds, stepId];
    const newMastered = score >= 85 && !masteredIds.includes(stepId) ? [...masteredIds, stepId] : masteredIds;

    const updatedUser: UserProfile = {
      ...user,
      verifiedStepIds: newVerified,
      masteredStepIds: newMastered,
      learningStreakDays: (user.learningStreakDays || 1) + 1,
    };

    setUser(updatedUser);
    localStorage.setItem('pathverse_user', JSON.stringify(updatedUser));

    // Show achievement toast
    setToastAchievement({
      title: score >= 85 ? '👑 Step Mastered!' : '🛡️ Step Verified!',
      description: `Passed verification assessment with ${score}% score! Next milestone unlocked.`,
    });

    // Add Notification
    const newNotif: PathverseNotification = {
      id: `notif-${Date.now()}`,
      title: score >= 85 ? 'Step Mastery Earned!' : 'Step Verified!',
      message: `Passed assessment for step with ${score}%. Life GPS route adapted for your next milestone.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'milestone',
    };
    setNotificationsList((prev) => [newNotif, ...prev]);
  };

  const handleJoinYearBadge = (yearBadge: string, fieldOfStudy: string) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      yearBadge,
      fieldOfStudy,
    };
    setUser(updatedUser);
    localStorage.setItem('pathverse_user', JSON.stringify(updatedUser));

    fetch('/api/community/join-year-badge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, yearBadge, fieldOfStudy }),
    }).catch((err) => console.error('Error joining year badge:', err));

    unlockAchievement('cohort_builder');
  };

  // Sync state to viewState on init if no explicit saved view
  useEffect(() => {
    const savedView = localStorage.getItem('pathverse_viewstate');
    if (!savedView) {
      if (user) {
        if (!user.hasCompletedOnboarding) {
          setViewState('onboarding');
        } else {
          setViewState('app');
        }
      } else {
        setViewState('welcome');
      }
    }
  }, []);

  // Save viewState & activeTab to LocalStorage for offline restoration
  useEffect(() => {
    localStorage.setItem('pathverse_viewstate', viewState);
  }, [viewState]);

  useEffect(() => {
    localStorage.setItem('pathverse_activetab', activeTab);
  }, [activeTab]);

  // Save User to LocalStorage whenever it updates
  useEffect(() => {
    if (user) {
      localStorage.setItem('pathverse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pathverse_user');
      localStorage.removeItem('pathverse_viewstate');
    }
  }, [user]);

  // Save Discovery to LocalStorage
  useEffect(() => {
    if (discoveryResult) {
      localStorage.setItem('pathverse_discovery', JSON.stringify(discoveryResult));
    }
  }, [discoveryResult]);

  // Save Journey to LocalStorage
  useEffect(() => {
    if (activeJourney) {
      localStorage.setItem('pathverse_journey', JSON.stringify(activeJourney));
    }
  }, [activeJourney]);

  // Server Activity Persistence Sync (Saves progress so users & admins can continue where they stopped)
  useEffect(() => {
    if (user && user.email && !isOffline) {
      const syncTimer = setTimeout(() => {
        fetch('/api/user/sync-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user,
            activeTab,
            discoveryResult,
            activeJourney,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              console.warn('Sync state response status:', res.status);
            }
          })
          .catch((err) => {
            console.warn('Sync user state notice:', err?.message || err);
          });
      }, 500);

      return () => clearTimeout(syncTimer);
    }
  }, [user, activeTab, discoveryResult, activeJourney, isOffline]);

  // Handle Avatar Image Upload
  const handleUpdateAvatar = async (avatarUrl: string) => {
    if (!user) return;
    const updatedUser = { ...user, avatarUrl };
    setUser(updatedUser);
    localStorage.setItem('pathverse_user', JSON.stringify(updatedUser));

    try {
      await fetch('/api/user/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, avatarUrl }),
      });
    } catch (err) {
      console.error('Error uploading avatar:', err);
    }
  };

  // Handle Authentication (Restores saved server state if available)
  const handleAuthenticate = async (userPayload: Partial<UserProfile>, isNewUser: boolean) => {
    const email = userPayload.email || 'user@pathverse.app';
    const calculatedRole = userPayload.role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');

    // Attempt to fetch existing saved state from server
    try {
      const res = await fetch(`/api/user/state/${encodeURIComponent(email)}`);
      const stateData = await res.json();

      if (stateData.found && stateData.user) {
        setUser(stateData.user);
        if (stateData.activeTab) setActiveTab(stateData.activeTab as any);
        if (stateData.discoveryResult) setDiscoveryResult(stateData.discoveryResult);
        if (stateData.activeJourney) setActiveJourney(stateData.activeJourney);
        setViewState('app');
        return;
      }
    } catch (e) {
      console.error('Failed to restore server state on auth:', e);
    }

    // Default profile creation if no prior state found
    const newUserProfile: UserProfile = {
      id: userPayload.id || `user_${Date.now()}`,
      email,
      name: userPayload.name || (calculatedRole === 'admin' ? 'Admin' : 'Alex'),
      role: calculatedRole,
      age: userPayload.age || (calculatedRole === 'admin' ? 28 : 18),
      country: userPayload.country || 'United States',
      stage: userPayload.stage || (calculatedRole === 'admin' ? 'Working' : 'Exploring'),
      interests: userPayload.interests || ['Technology', 'Design'],
      enjoyText: userPayload.enjoyText || 'I enjoy building apps and learning new tech tools.',
      futureGoals: userPayload.futureGoals || 'I want financial stability and meaningful projects.',
      hasCompletedOnboarding: calculatedRole === 'admin' || (!isNewUser && userPayload.hasCompletedOnboarding !== false),
      stageLevel: userPayload.stageLevel || (calculatedRole === 'admin' ? 'Master' : 'Explorer'),
      unlockedPathIds: userPayload.unlockedPathIds || (calculatedRole === 'admin' ? ['path-ai-dev', 'path-ux-design', 'path-mobile-dev'] : []),
      yearBadge: userPayload.yearBadge || 'League of 2026',
      fieldOfStudy: userPayload.fieldOfStudy || (calculatedRole === 'admin' ? 'System & Operations' : 'Tech & AI'),
      createdAt: userPayload.createdAt || new Date().toISOString(),
    };

    setUser(newUserProfile);

    if (calculatedRole === 'admin' || !isNewUser || newUserProfile.hasCompletedOnboarding) {
      setViewState('app');
      setActiveTab('home');
    } else {
      setViewState('onboarding');
    }
  };

  // Handle Quick Demo Login
  const handleQuickDemo = () => {
    const demoUser: UserProfile = {
      id: 'user_alex_demo',
      email: 'alex.m@pathverse.app',
      name: 'Alex Chen',
      age: 16,
      country: 'United States',
      stage: 'High School',
      interests: ['Technology', 'Design', 'Entrepreneurship'],
      enjoyText: 'Building small python scripts, drawing UI prototypes, and gaming with friends.',
      futureGoals: 'Build innovative tech products and achieve creative independence.',
      hasCompletedOnboarding: true,
      stageLevel: 'Explorer',
      unlockedPathIds: ['path-ai-dev'],
      createdAt: new Date().toISOString(),
    };

    setUser(demoUser);
    setViewState('app');
    setActiveTab('home');
  };

  // Unlock Achievement & Trigger Toast
  const unlockAchievement = (badgeId: string) => {
    if (!user) return;
    const currentUnlocked = user.unlockedAchievementIds || [];
    if (currentUnlocked.includes(badgeId)) return;

    const badge = ALL_ACHIEVEMENTS.find((a) => a.id === badgeId);
    const updatedUser = {
      ...user,
      unlockedAchievementIds: [...currentUnlocked, badgeId],
    };

    setUser(updatedUser);

    if (badge) {
      setToastAchievement({
        title: badge.title,
        description: badge.description,
      });
    }
  };

  // Complete Onboarding
  const handleCompleteOnboarding = (updatedProfile: UserProfile) => {
    const updatedWithBadge = {
      ...updatedProfile,
      unlockedAchievementIds: Array.from(
        new Set([...(updatedProfile.unlockedAchievementIds || []), 'pioneer_explorer'])
      ),
    };

    setUser(updatedWithBadge);
    localStorage.setItem('pathverse_user', JSON.stringify(updatedWithBadge));

    const badge = ALL_ACHIEVEMENTS.find((a) => a.id === 'pioneer_explorer');
    if (badge) {
      setToastAchievement({
        title: badge.title,
        description: badge.description,
      });
    }

    if (!updatedWithBadge.hasCompletedQuiz) {
      setViewState('quiz');
    } else {
      setViewState('app');
      setActiveTab('home');
    }
  };

  // Handle AI Diagnostic Quiz Completion
  const handleQuizComplete = async (quizData: {
    scores: Record<string, number>;
    strengths: string[];
    primaryInterest: string;
  }) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      hasCompletedQuiz: true,
      diagnosticScores: quizData.scores,
      diagnosticStrengths: quizData.strengths,
      interests: Array.from(new Set([...(user.interests || []), quizData.primaryInterest])),
    };

    setUser(updatedUser);
    localStorage.setItem('pathverse_user', JSON.stringify(updatedUser));
    setViewState('app');
    setActiveTab('discovery');

    // Automatically trigger AI Discovery with updated quiz profile
    handleRunDiscovery(updatedUser);
  };

  // Run AI Discovery
  const handleRunDiscovery = async (overrideProfile?: UserProfile) => {
    const targetProfile = overrideProfile || user;
    if (!targetProfile) return;
    setIsDiscovering(true);

    try {
      const data = await discoverPaths(targetProfile);
      setDiscoveryResult(data);
      localStorage.setItem('pathverse_discovery', JSON.stringify(data));
      setActiveTab('discovery');

      // Award "Path Finder" Achievement
      unlockAchievement('path_finder');
    } catch (err) {
      console.error('Failed to run AI discovery:', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Explore a Path (Paywall Check)
  const handleExplorePath = (path: DiscoveredPath) => {
    if (!user) return;

    // Check if path is unlocked
    const isUnlocked = user.unlockedPathIds?.includes(path.id);

    if (isUnlocked) {
      // Already unlocked, fetch Life GPS
      fetchLifeGpsRoute(path);
    } else {
      // Show Paywall Modal ($4.99)
      setPaywallPath(path);
    }
  };

  // Fetch Life GPS Route & Project
  const fetchLifeGpsRoute = async (pathItem: DiscoveredPath) => {
    if (!user) return;
    setSelectedPath(pathItem);
    setIsJourneyLoading(true);
    setActiveTab('lifeGps');

    try {
      const data = await generateLifeGps(pathItem.title, pathItem.reason, user);
      setActiveJourney({
        pathId: pathItem.id,
        pathTitle: pathItem.title,
        steps: data.steps || [],
        recommendedProject: data.recommendedProject,
      });

      // Update user active path
      setUser({
        ...user,
        activePathId: pathItem.id,
      });
    } catch (err) {
      console.error('Failed to fetch Life GPS route:', err);
    } finally {
      setIsJourneyLoading(false);
    }
  };

  // Handle Successful Payment Unlock
  const handleUnlockSuccess = (pathId: string) => {
    if (!user || !paywallPath) return;

    const updatedUnlocked = [...(user.unlockedPathIds || []), pathId];
    const updatedUser = {
      ...user,
      unlockedPathIds: updatedUnlocked,
    };

    setUser(updatedUser);

    const targetPath = paywallPath;
    setPaywallPath(null);

    // Immediately fetch and display route
    fetchLifeGpsRoute(targetPath);
  };

  // Handle Start Project -> Advances Stage (Explorer -> Builder)
  const handleStartProject = (project: RecommendedProject) => {
    if (!activeJourney || !user) return;

    const updatedJourney = {
      ...activeJourney,
      recommendedProject: {
        ...activeJourney.recommendedProject,
        isStarted: true,
        startedAt: new Date().toISOString(),
      },
    };

    setActiveJourney(updatedJourney);

    // Promote Stage from Explorer -> Builder (Prompt 6)
    const stageLadder: UserStageLevel[] = [
      'Explorer',
      'Learner',
      'Builder',
      'Specialist',
      'Professional',
      'Master',
      'Mentor',
    ];

    let nextStage: UserStageLevel = user.stageLevel;
    if (user.stageLevel === 'Explorer') {
      nextStage = 'Builder';
    } else {
      const currentIdx = stageLadder.indexOf(user.stageLevel);
      if (currentIdx < stageLadder.length - 1) {
        nextStage = stageLadder[currentIdx + 1];
      }
    }

    setUser({
      ...user,
      stageLevel: nextStage,
    });

    // Award "Action Builder" Achievement
    unlockAchievement('action_builder');
  };

  // Toggle Life GPS Step Completion
  const handleToggleStepComplete = (stepId: string) => {
    if (!activeJourney) return;

    let newlyCompleted = false;
    const updatedSteps = (activeJourney.steps || []).map((step) => {
      if (step.id === stepId) {
        const nextStatus = step.status === 'completed' ? ('upcoming' as const) : ('completed' as const);
        if (nextStatus === 'completed') newlyCompleted = true;
        return {
          ...step,
          status: nextStatus,
        };
      }
      return step;
    });

    setActiveJourney({
      ...activeJourney,
      steps: updatedSteps,
    });

    if (newlyCompleted) {
      unlockAchievement('route_navigator');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setDiscoveryResult(null);
    setActiveJourney(null);
    localStorage.removeItem('pathverse_user');
    localStorage.removeItem('pathverse_discovery');
    localStorage.removeItem('pathverse_journey');
    setViewState('welcome');
    setIsProfileOpen(false);
  };

  // Compute Today's Mission Step & Resource for Daily Navigator
  const uncompletedStep = activeJourney?.steps?.find((s) => s.status !== 'completed') || activeJourney?.steps?.[0] || null;
  const todayResourcesList = uncompletedStep && activeJourney
    ? generateResourcesForStep(uncompletedStep.id, uncompletedStep.title, activeJourney.pathTitle)
    : [];
  const todayResourceItem = todayResourcesList[0] || null;

  return (
    <div className="min-h-screen bg-[#0B0D17] text-white font-sans selection:bg-[#F2AF29] selection:text-[#0B0D17] flex flex-col relative overflow-x-hidden">
      {/* Offline Mode Indicator Banner */}
      {isOffline && (
        <div className="w-full bg-[#1C1F37] border-b border-[#F2AF29]/40 px-4 py-2 text-center text-[#F2AF29] text-xs font-bold flex items-center justify-center gap-2 z-50 shadow-lg">
          <WifiOff className="w-4 h-4 text-[#F2AF29] shrink-0" />
          <span>⚡ OFFLINE MODE ACTIVE — Essential user profile, discovery, and Life GPS data are cached locally</span>
          <span className="px-2 py-0.5 rounded bg-[#F2AF29] text-[#0B0D17] text-[10px] font-black uppercase tracking-wider">
            ServiceWorker Ready
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col sm:flex-row min-w-0 relative">
        {/* Left-Hand Side Dashboard Navigation Sidebar */}
        {viewState === 'app' && user && (
        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'discovery' && !discoveryResult && !isDiscovering) {
              handleRunDiscovery();
            }
          }}
          onOpenRevenueReport={() => setIsRevenueReportOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenMentor={() => setIsMentorOpen(true)}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          user={user}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'discovery' && !discoveryResult && !isDiscovering) {
              handleRunDiscovery();
            }
          }}
          onOpenRevenueReport={() => setIsRevenueReportOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenMentor={() => setIsMentorOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationCount={notificationsList.filter((n) => !n.read).length}
          onSignOut={handleSignOut}
        />

        {/* Main Content Area */}
        <main className="flex-1 pb-24 md:pb-12">
        {/* VIEW 1: Welcome Screen */}
        {viewState === 'welcome' && (
          <WelcomeScreen
            onGetStarted={() => setViewState('auth')}
            onQuickDemoLogin={handleQuickDemo}
          />
        )}

        {/* VIEW 2: Authentication Screen */}
        {viewState === 'auth' && (
          <AuthScreen
            onAuthenticate={handleAuthenticate}
            onBackToWelcome={() => setViewState('welcome')}
          />
        )}

        {/* VIEW 3: Onboarding Flow */}
        {viewState === 'onboarding' && user && (
          <OnboardingFlow
            user={user}
            onComplete={handleCompleteOnboarding}
          />
        )}

        {/* VIEW 3.5: Systematic AI Interest & Strength Diagnostic Quiz */}
        {viewState === 'quiz' && user && (
          <AiDiagnosticQuiz
            user={user}
            onQuizComplete={handleQuizComplete}
            onSkipQuiz={() => {
              setViewState('app');
              setActiveTab('discovery');
              if (!discoveryResult) {
                handleRunDiscovery();
              }
            }}
          />
        )}

        {/* VIEW 4: Main Application */}
        {viewState === 'app' && user && (
          <>
            {activeTab === 'home' && (
              <DashboardScreen
                user={user}
                discoveryResult={discoveryResult}
                activeJourney={activeJourney}
                todayStep={uncompletedStep}
                todayResource={todayResourceItem}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'discovery' && !discoveryResult && !isDiscovering) {
                    handleRunDiscovery();
                  }
                }}
                onOpenProject={() => setActiveTab('lifeGps')}
                onContinueStep={() => setActiveTab('lifeGps')}
                onOpenProfileBadges={() => setIsProfileOpen(true)}
                onOpenMentor={() => setIsMentorOpen(true)}
                onOpenResource={handleOpenResource}
                onStartAssessment={handleStartAssessment}
              />
            )}

            {activeTab === 'discovery' && (
              <DiscoveryScreen
                user={user}
                discoveryResult={discoveryResult}
                isLoading={isDiscovering}
                onRunDiscovery={() => handleRunDiscovery()}
                onExplorePath={handleExplorePath}
                onRetakeQuiz={() => setViewState('quiz')}
              />
            )}

            {activeTab === 'lifeGps' && (
              <LifeGpsScreen
                journey={activeJourney}
                user={user}
                isLoading={isJourneyLoading}
                onBackToDiscovery={() => setActiveTab('discovery')}
                onStartProject={handleStartProject}
                onToggleStepComplete={handleToggleStepComplete}
                onOpenMentor={() => setIsMentorOpen(true)}
                onOpenResource={handleOpenResource}
                onStartAssessment={handleStartAssessment}
              />
            )}

            {activeTab === 'community' && (
              <CommunityScreen
                user={user}
                onSendKudos={() => unlockAchievement('global_supporter')}
                onJoinYearBadge={handleJoinYearBadge}
              />
            )}

            {activeTab === 'contacts' && (
              <ContactsScreen user={user} />
            )}
          </>
        )}
      </main>

      {/* Elegant Dark Floating Bottom Navigation Bar for Mobile */}
      {viewState === 'app' && user && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
          <div className="bg-[#1C1F37] border border-white/10 rounded-full px-5 py-3 shadow-2xl flex items-center gap-4 sm:gap-6 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#F2AF29] border-b-2 border-[#F2AF29] pb-0.5'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('discovery');
                if (!discoveryResult && !isDiscovering) handleRunDiscovery();
              }}
              className={`text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeTab === 'discovery'
                  ? 'text-[#F2AF29] border-b-2 border-[#F2AF29] pb-0.5'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Discovery
            </button>
            <button
              onClick={() => setActiveTab('lifeGps')}
              className={`text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeTab === 'lifeGps'
                  ? 'text-[#F2AF29] border-b-2 border-[#F2AF29] pb-0.5'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Life GPS
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeTab === 'community'
                  ? 'text-[#F2AF29] border-b-2 border-[#F2AF29] pb-0.5'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeTab === 'contacts'
                  ? 'text-[#F2AF29] border-b-2 border-[#F2AF29] pb-0.5'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Contacts
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Paywall Unlock Modal */}
      {paywallPath && user && (
        <PaywallModal
          path={paywallPath}
          user={user}
          isOpen={!!paywallPath}
          onClose={() => setPaywallPath(null)}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}

      {/* Revenue Evidence Report Modal */}
      <RevenueReportModal
        isOpen={isRevenueReportOpen}
        onClose={() => setIsRevenueReportOpen(false)}
      />

      {/* Profile Modal */}
      {user && (
        <ProfileModal
          user={user}
          discoveryResult={discoveryResult}
          activeJourney={activeJourney}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onRedoOnboarding={() => {
            setIsProfileOpen(false);
            setViewState('onboarding');
          }}
          onSignOut={handleSignOut}
          onUnlockAchievement={unlockAchievement}
          onOpenYearModal={() => {
            setIsProfileOpen(false);
            setIsYearModalOpen(true);
          }}
          onUpdateAvatar={handleUpdateAvatar}
        />
      )}
      </div>

      {/* Year Badge Modal */}
      {user && (
        <YearBadgeModal
          user={user}
          isOpen={isYearModalOpen}
          onClose={() => setIsYearModalOpen(false)}
          onJoinYearBadge={handleJoinYearBadge}
        />
      )}

      {/* Toast Notification */}
      {toastAchievement && (
        <AchievementToast
          title={toastAchievement.title}
          description={toastAchievement.description}
          onClose={() => setToastAchievement(null)}
        />
      )}

      {/* Gemini AI Mentor Drawer */}
      <GeminiMentorDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        user={user}
        currentPathTitle={activeJourney?.pathTitle}
      />

      {/* Resource Progress Monitoring Modal */}
      <ResourceMonitoringModal
        isOpen={!!activeResourceForModal}
        resource={activeResourceForModal}
        onClose={() => setActiveResourceForModal(null)}
        onConfirmUserCompletion={handleConfirmUserCompletion}
        onStartVerificationAssessment={(resId) => {
          if (uncompletedStep) {
            setAssessmentStepForModal(uncompletedStep);
          }
        }}
        onOpenMentorHelp={(topic) => {
          setIsMentorOpen(true);
        }}
      />

      {/* Learning Verification Assessment Modal */}
      <VerificationAssessmentModal
        isOpen={!!assessmentStepForModal}
        step={assessmentStepForModal}
        pathTitle={activeJourney?.pathTitle || 'Career Path'}
        onClose={() => setAssessmentStepForModal(null)}
        onPassAssessment={handlePassAssessment}
      />

      {/* Article Reader Modal */}
      <ArticleModal
        isOpen={!!articleResourceForModal}
        resource={articleResourceForModal}
        onClose={() => setArticleResourceForModal(null)}
        onMarkCompleted={handleConfirmUserCompletion}
      />

      {/* Progress Notifications Drawer */}
      <ProgressNotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
        notifications={notificationsList}
        onMarkRead={(id) => {
          setNotificationsList((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
      />
    </div>
  );
}
