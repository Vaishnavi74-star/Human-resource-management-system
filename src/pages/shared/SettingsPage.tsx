import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { User, Shield, Sliders, Smartphone, Check, Loader2 } from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'preferences';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
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
    theme: 'system',
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
    }, 800);
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
    }, 1000);
  };

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    setTimeout(() => {
      setIsSavingPrefs(false);
      success('Preferences Saved', 'Your app settings have been updated.');
    }, 600);
  };

  const renderProfileTab = () => (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Public Profile</h2>
      <p className="text-sm text-slate-500 mb-6">Update how you appear to others on DAYFLOW.</p>
      
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
      <h2 className="text-lg font-bold text-slate-900 mb-1">Security & Authentication</h2>
      <p className="text-sm text-slate-500 mb-6">Manage your password and multi-factor authentication.</p>
      
      <form onSubmit={handleSecuritySave} className="space-y-4 max-w-xl border-b border-slate-200 pb-8 mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Change Password</h3>
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
        <h3 className="text-sm font-bold text-slate-900 mb-2">Two-Factor Authentication (2FA)</h3>
        <p className="text-xs text-slate-500 mb-4">Add an extra layer of security to your account by requiring a code from your mobile device.</p>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${is2FAEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Authenticator App</p>
              <p className="text-xs text-slate-500">{is2FAEnabled ? 'Configured and active.' : 'Not configured.'}</p>
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
      <h2 className="text-lg font-bold text-slate-900 mb-1">App Preferences</h2>
      <p className="text-sm text-slate-500 mb-6">Customize your experience and notification settings.</p>
      
      <form onSubmit={handlePreferencesSave} className="max-w-xl">
        <div className="space-y-8">
          {/* Theme */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Interface Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferencesData({...preferencesData, theme: t})}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    preferencesData.theme === t ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="capitalize text-sm font-semibold text-slate-700">{t}</span>
                  {preferencesData.theme === t && <Check className="w-4 h-4 text-indigo-600 mt-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Language & Region</h3>
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
            <h3 className="text-sm font-bold text-slate-900 mb-3">Notification Channels</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferencesData.notifyEmail}
                  onChange={(e) => setPreferencesData({...preferencesData, notifyEmail: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-slate-700">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferencesData.notifyPush}
                  onChange={(e) => setPreferencesData({...preferencesData, notifyPush: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-slate-700">In-App Push Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferencesData.notifySMS}
                  onChange={(e) => setPreferencesData({...preferencesData, notifySMS: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-slate-700">SMS Alerts (Critical Only)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 mt-8">
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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account configurations and preferences.
        </p>
      </div>

      <Card className="flex flex-col md:flex-row min-h-[600px] overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold ${
              activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold ${
              activeTab === 'security' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="hidden sm:inline">Security</span>
          </button>

          <button 
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold ${
              activeTab === 'preferences' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="hidden sm:inline">Preferences</span>
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
