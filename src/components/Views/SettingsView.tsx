import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Palette, Globe, Shield, Save, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/hooks/useTheme.tsx';
import { toast } from '@/components/ui/use-toast.ts';

interface SettingsState {
  notifications: {
    mentions: boolean;
    newTasks: boolean;
    deadlines: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showActivity: boolean;
  };
  language: string;
}

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      mentions: true,
      newTasks: false,
      deadlines: true,
    },
    privacy: {
      profilePublic: true,
      showActivity: true,
    },
    language: 'en-US',
  });

  const handleToggle = (category: 'notifications' | 'privacy', key: keyof SettingsState['notifications'] | keyof SettingsState['privacy']) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      },
    }));
  };

  const handleLanguageChange = (value: string) => {
    setSettings(prev => ({ ...prev, language: value }));
  };

  const handleSave = () => {
    toast({
      title: "✅ Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleCancel = () => {
    toast({
      title: "Changes Discarded",
      variant: "destructive",
    });
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <Card className="glass-card p-6">
        <CardContent className="p-0">
          <Accordion type="multiple" defaultValue={['notifications', 'appearance']} className="w-full">
            <AccordionItem value="notifications">
              <AccordionTrigger className="text-lg text-white font-semibold">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-400" />
                  Notifications
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4 text-gray-300">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mentions-switch">Email on @mentions</Label>
                  <Switch id="mentions-switch" checked={settings.notifications.mentions} onCheckedChange={() => handleToggle('notifications', 'mentions')} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-tasks-switch">Push for new tasks</Label>
                  <Switch id="new-tasks-switch" checked={settings.notifications.newTasks} onCheckedChange={() => handleToggle('notifications', 'newTasks')} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="deadlines-switch">Reminders for deadlines</Label>
                  <Switch id="deadlines-switch" checked={settings.notifications.deadlines} onCheckedChange={() => handleToggle('notifications', 'deadlines')} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="appearance">
              <AccordionTrigger className="text-lg text-white font-semibold">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-blue-400" />
                  Appearance
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4 text-gray-300">
                <div className="flex items-center justify-between">
                  <Label>Theme</Label>
                  <div className="flex items-center gap-2">
                    <Button variant={theme === 'light' ? 'secondary' : 'ghost'} onClick={() => setTheme('light')}>Light</Button>
                    <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} onClick={() => setTheme('dark')}>Dark</Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="language">
              <AccordionTrigger className="text-lg text-white font-semibold">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-400" />
                  Language & Region
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4 text-gray-300">
                <div className="flex items-center justify-between">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español (España)</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacy">
              <AccordionTrigger className="text-lg text-white font-semibold">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  Account Privacy
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4 text-gray-300">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-public-switch">Profile is visible to everyone</Label>
                  <Switch id="profile-public-switch" checked={settings.privacy.profilePublic} onCheckedChange={() => handleToggle('privacy', 'profilePublic')} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-activity-switch">Show my activity status</Label>
                  <Switch id="show-activity-switch" checked={settings.privacy.showActivity} onCheckedChange={() => handleToggle('privacy', 'showActivity')} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" onClick={handleCancel} className="text-white border-white/20 hover:bg-white/10 hover:text-white">
              <X className="w-4 h-4 mr-2"/>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}