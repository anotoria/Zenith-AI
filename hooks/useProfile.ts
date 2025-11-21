import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import type { ProfileWithPermissions } from '@/lib/types';

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          permissions:user_permissions(*),
          roles:user_roles(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as any;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: any) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const hasRole = (role: string): boolean => {
    return profile?.roles?.some((r: any) => r.role === role) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile?.permissions) return false;
    return (profile.permissions as any)[permission] ?? false;
  };

  return {
    profile,
    isLoading,
    updateProfile: updateProfile.mutate,
    hasRole,
    hasPermission,
  };
};
