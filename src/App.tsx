import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ProblemSolution } from './components/ProblemSolution.tsx';
import { Features } from './components/Features.tsx';
import { DevashtraJuniorSection } from './components/DevashtraJuniorSection.tsx';
import { ParentSection } from './components/ParentSection.tsx';
import { WaitlistSection } from './components/WaitlistSection.tsx';
import { Footer } from './components/Footer.tsx';
import { WaitlistAdminModal } from './components/WaitlistAdminModal.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { DashboardLayout } from './components/dashboards/DashboardLayout.tsx';
import { StudentDashboard } from './components/dashboards/StudentDashboard.tsx';
import { ParentDashboard } from './components/dashboards/ParentDashboard.tsx';
import { MentorDashboard } from './components/dashboards/MentorDashboard.tsx';
import { AdminDashboard } from './components/dashboards/AdminDashboard.tsx';
import { CloudLab } from './components/lab/CloudLab.tsx';
import { CyberRoverGame } from './components/game/CyberRoverGame.tsx';
import { DevashtraMultimodalStudio } from './components/studio/DevashtraMultimodalStudio.tsx';
import { Terminal, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  // Navigation view: 'landing' | 'dashboard' | 'lab' | 'game' | 'studio'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'lab' | 'game' | 'studio'>('landing');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Cloud Lab Preview announcement banner
  const [labPreviewTask, setLabPreviewTask] = useState<string | null>(null);

  // Waitlist count
  const [totalWaitlistCount, setTotalWaitlistCount] = useState<number>(0);

  const fetchWaitlistCount = async () => {
    try {
      const res = await fetch('/api/waitlist/stats');
      if (res.ok) {
        const data = await res.json();
        if (typeof data.total === 'number') {
          setTotalWaitlistCount(data.total);
        }
      }
    } catch {
      // Ignore initial stats load error
    }
  };

  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  // When a user logs in, automatically switch to their dashboard view
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, user?.role]);

  const scrollToWaitlist = () => {
    setCurrentView('landing');
    setTimeout(() => {
      const el = document.getElementById('waitlist');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToJunior = () => {
    setCurrentView('landing');
    setTimeout(() => {
      const el = document.getElementById('junior');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLaunchTask = (taskTitle: string) => {
    setLabPreviewTask(taskTitle);
    setCurrentView('lab');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 1. Cloud Lab IDE View */}
      {currentView === 'lab' && (
        <CloudLab
          taskTitle={labPreviewTask || undefined}
          onBack={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
          onOpenGame={() => setCurrentView('game')}
          onOpenStudio={() => setCurrentView('studio')}
        />
      )}

      {/* 2. Three.js 3D Cyber Rover Game View */}
      {currentView === 'game' && (
        <CyberRoverGame
          onBackToApp={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
        />
      )}

      {/* 3. Multimodal AI & Bioscience Studio View */}
      {currentView === 'studio' && (
        <DevashtraMultimodalStudio
          onBackToApp={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
          onOpenGame={() => setCurrentView('game')}
        />
      )}

      {/* 4. Dashboard View */}
      {currentView === 'dashboard' && isAuthenticated && (
        <DashboardLayout
          onBackToLanding={() => setCurrentView('landing')}
          onOpenLab={() => handleLaunchTask('General Python Sandbox')}
          onOpenGame={() => setCurrentView('game')}
          onOpenStudio={() => setCurrentView('studio')}
        >
          {user?.role === 'student' && (
            <StudentDashboard onLaunchTaskInLab={handleLaunchTask} />
          )}
          {user?.role === 'parent' && <ParentDashboard />}
          {user?.role === 'mentor' && <MentorDashboard />}
          {user?.role === 'admin' && <AdminDashboard />}
        </DashboardLayout>
      )}

      {/* 5. Public Landing Page */}
      {currentView === 'landing' && (
        <>
          {/* Top Navigation */}
          <Navbar
            onJoinWaitlistClick={scrollToWaitlist}
            onOpenAdminPreview={() => setIsAdminModalOpen(true)}
            onOpenAuth={openAuth}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            onOpenLab={() => setCurrentView('lab')}
            onOpenGame={() => setCurrentView('game')}
            onOpenStudio={() => setCurrentView('studio')}
            totalWaitlistCount={totalWaitlistCount}
          />

          {/* Main Content Sections */}
          <main className="flex-1">
            {/* Hero Section */}
            <Hero
              onJoinWaitlist={scrollToWaitlist}
              onExploreJunior={scrollToJunior}
            />

            {/* Problem vs. Solution */}
            <ProblemSolution />

            {/* Platform Features Bento Grid */}
            <Features />

            {/* Devashtra Junior (Ages 6-12) */}
            <DevashtraJuniorSection onJoinWaitlist={scrollToWaitlist} />

            {/* Parental Dashboard & Transparency */}
            <ParentSection />

            {/* Waitlist Early Access Form & Live Database integration */}
            <WaitlistSection
              onSuccess={() => fetchWaitlistCount()}
              onRefreshCount={fetchWaitlistCount}
            />
          </main>

          {/* Footer */}
          <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} />
        </>
      )}



      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Database / Waitlist Inspection Modal */}
      <WaitlistAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
