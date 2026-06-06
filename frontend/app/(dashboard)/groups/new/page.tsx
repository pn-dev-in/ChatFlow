'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { groupService } from '@/services/group.service';
import { chatService } from '@/services/chat.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewGroupPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: users = [] } = useQuery({
    queryKey: ['users', search],
    queryFn: () => chatService.searchUsers(search),
    enabled: search.length >= 2,
  });

  const handleCreate = async () => {
    if (!name || selectedMembers.length === 0) return;
    setLoading(true);
    try {
      const group = await groupService.createGroup({
        name,
        description,
        memberIds: selectedMembers,
      });
      router.push(`/chat/${group.conversationId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Group</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Group Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Chat" />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className="space-y-2">
          <Label>Add Members</Label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {users.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMembers([...selectedMembers, user.id]);
                    } else {
                      setSelectedMembers(selectedMembers.filter((id) => id !== user.id));
                    }
                  }}
                />
                <span>{user.profile?.displayName || user.username}</span>
              </label>
            ))}
          </div>
        </div>

        <Button onClick={handleCreate} disabled={!name || selectedMembers.length === 0 || loading} className="w-full">
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
      </div>
    </div>
  );
}
