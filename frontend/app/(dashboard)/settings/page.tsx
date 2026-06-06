'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { darkMode, setDarkMode } = useUiStore();
  const [form, setForm] = useState({
    displayName: user?.profile?.displayName || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await api.patch<{ data: User }>('/users/me', data);
      return res.data.data;
    },
    onSuccess: (updatedUser) => setUser(updatedUser),
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Display Name</Label>
          <Input
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Input
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us about yourself"
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Dark Mode</Label>
          <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <Button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
          className="w-full"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
