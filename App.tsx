
import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import SignInScreen from './components/SignInScreen';
import Navigation from './components/Navigation';
import HomeInterface from './components/HomeInterface';
import ChatInterface from './components/ChatInterface';
import VisionInterface from './components/VisionInterface';
import SavedRecipesInterface from './components/SavedRecipesInterface';
import { isUserLoggedIn } from './services/storageService';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SPLASH);

  const handleSplashComplete = () => {
    // Check if user is already logged in (session persistence)
    if (isUserLoggedIn()) {
      setView(AppView.HOME);
    } else {
      setView(AppView.SIGNIN);
    }
  };

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return <HomeInterface setView={setView} />;
      case AppView.CHAT:
        return <ChatInterface setView={setView} />;
      case AppView.VISION:
        return <VisionInterface setView={setView} />;
      case AppView.SAVED:
        return <SavedRecipesInterface setView={setView} />;
      default:
        return null;
    }
  };

  if (view === AppView.SPLASH) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (view === AppView.SIGNIN) {
    return <SignInScreen onSignIn={() => setView(AppView.HOME)} />;
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation currentView={view} setView={setView} />
    </div>
  );
};

export default App;
