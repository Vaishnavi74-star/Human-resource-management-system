import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { User, Shield, Sliders, Smartphone, Check, Loader2, Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '../../utils/cn';

type SettingsTab = 'profile' | 'security' | 'preferences';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success, error } = useToast();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('preferences');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 000-0000',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Preferences State
  const [preferencesData, setPreferencesData] = useState({
    language: 'en',
    notifyEmail: true,
    notifyPush: true,
    notifySMS: false,
  });
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      success('Profile Updated', 'Your personal information has been saved successfully.');
    }, 600);
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      error('Validation Error', 'New passwords do not match.');
      return;
    }
    if (securityData.newPassword.length < 8) {
      error('Validation Error', 'Password must be at least 8 characters.');
      return;
    }
    setIsSavingSecurity(true);
    setTimeout(() => {
      setIsSavingSecurity(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      success('Password Changed', 'Your security credentials have been updated.');
    }, 800);
  };

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    setTimeout(() => {
      setIsSavingPrefs(false);
      success('Preferences Saved', 'Your app settings have been updated.');
    }, 500);
  };

  const renderProfileTab = () => (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Public Profile</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update how you appear to others on DAYFLOW.</p>
      
      <form onSubmit={handleProfileSave} className="space-y-4 max-w-xl">
        <Input 
          label="Full Name" 
          value={profileData.name}
          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
          required
        />
        <Input 
          label="Email Address" 
          type="email"
          value={profileData.email}
          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
          required
        />
        <Input 
          label="Phone Number" 
          type="tel"
          value={profileData.phone}
          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
        />
        <div className="pt-4">
          <Button type="submit" disabled={isSavingProfile}>
            {isSavingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Security & Authentication</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your password and multi-factor authentication.</p>
      
      <form onSubmit={handleSecuritySave} className="space-y-4 max-w-xl border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Change Password</h3>
        <Input 
          label="Current Password" 
          type="password"
          value={securityData.currentPassword}
          onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
          required
        />
        <Input 
          label="New Password" 
          type="password"
          value={securityData.newPassword}
          onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
          required
        />
        <Input 
          label="Confirm New Password" 
          type="password"
          value={securityData.confirmPassword}
          onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
          required
        />
        <div className="pt-2">
          <Button type="submit" disabled={isSavingSecurity}>
            {isSavingSecurity && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Password
          </Button>
        </div>
      </form>

      <div className="max-w-xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Two-Factor Authentication (2FA)</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Add an extra layer of security to your account by requiring a code from your mobile device.</p>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${is2FAEnabled ? 'bg-indigo-100 text-indigo-600 dark:bg-cyan-950 dark:text-cyan-400' : 'bg-slate-200 text-slate-500'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Authenticator App</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{is2FAEnabled ? 'Configured and active.' : 'Not configured.'}</p>
            </div>
          </div>
          <Button 
            variant={is2FAEnabled ? 'outline' : 'primary'} 
            onClick={() => {
              setIs2FAEnabled(!is2FAEnabled);
              success('2FA Updated', is2FAEnabled ? 'Two-factor authentication disabled.' : 'Two-factor authentication enabled.');
            }}
          >
            {is2FAEnabled ? 'Disable' : 'Set Up'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">App Preferences</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize your display appearance, light/dark themes, and notification channels.</p>
      
      <form onSubmit={handlePreferencesSave} className="max-w-xl">
        <div className="space-y-8">
          {/* Theme Selector */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Interface Appearance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Choose between clean high-contrast Light mode, sleek Dark mode, or automatic System mode.</p>
            
            <div className="grid grid-cols-3 gap-3.5">
              {/* Light Mode */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer text-center relative',
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-100 dark:border-cyan-400 dark:bg-cyan-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
                  <Sun className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Clean & Crisp</span>
                {theme === 'light' && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>

              {/* Dark Mode */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer text-center relative',
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-100 dark:border-cyan-400 dark:bg-cyan-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mb-2">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Luminous Cyber</span>
                {theme === 'dark' && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 dark:bg-cyan-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>

              {/* System Mode */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer text-center relative',
                  theme === 'system'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-100 dark:border-cyan-400 dark:bg-cyan-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-2">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">System Auto</span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Follow OS</span>
                {theme === 'system' && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 dark:bg-cyan-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Language & Region</h3>
            <Select 
              value={preferencesData.language}
              onChange={(e) => setPreferencesData({...preferencesData, language: e.target.value})}
              options={[
                { value: 'en', label: 'English (US)' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' }
              ]}
            />
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Notification Channels</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferencesData.notifyEmail}
                  onChange={(e) => setPreferencesData({...preferencesData, notifyEmail: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferencesData.notifyPush}
                  onChange={(e) => setPreferencesData({...preferencesData, notifyPush: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">In-App Push Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferencesData.notifySMS}
                  onChange={(e) => setPreferencesData({...preferencesData, notifySMS: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">SMS Alerts (Critical Only)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
          <Button type="submit" disabled={isSavingPrefs}>
            {isSavingPrefs && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account configurations, theme modes, and notification channels.
        </p>
      </div>

      <Card className="flex flex-col md:flex-row min-h-[600px] overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('preferences')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold cursor-pointer',
              activeTab === 'preferences'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-cyan-950 dark:text-cyan-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900'
            )}
          >
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <span>Preferences & Theme</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold cursor-pointer',
              activeTab === 'profile'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-cyan-950 dark:text-cyan-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900'
            )}
          >
            <User className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <span>Public Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold cursor-pointer',
              activeTab === 'security'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-cyan-950 dark:text-cyan-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900'
            )}
          >
            <Shield className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <span>Security</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </div>
      </Card>
    </div>
  );
};
