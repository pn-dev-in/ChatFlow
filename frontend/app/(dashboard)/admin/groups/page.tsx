'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export default function AdminGroupsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: () => adminService.getGroups(),
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Group Management</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-2">
          {data?.groups.map((group) => (
            <div key={group.id} className="glass rounded-lg p-4">
              <p className="font-medium">{group.name}</p>
              <p className="text-sm text-muted-foreground">{group.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {group.isPrivate ? 'Private' : 'Public'} · {group.members?.length || 0} members
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
