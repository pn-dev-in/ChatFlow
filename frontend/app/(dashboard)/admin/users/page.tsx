'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getUsers(),
  });

  const toggleMutation = useMutation({
    mutationFn: adminService.toggleUserActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-2">
          {data?.users.map((user) => (
            <div key={user.id} className="flex items-center justify-between glass rounded-lg p-4">
              <div>
                <p className="font-medium">{user.profile?.displayName || user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">{user.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${user.isActive ? 'text-green-500' : 'text-red-500'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMutation.mutate(user.id)}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
