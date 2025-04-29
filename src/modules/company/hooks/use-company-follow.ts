import { toast } from 'sonner';

import { useCompanyFollowMutation } from './use-company-follow-mutation';
import { useCompanyUnfollowMutation } from './use-company-unfollow-mutation';
import { useUserCompanyFollowing } from './use-user-company-following';

export const useCompanyFollow = (companyId: string) => {
  const following = useUserCompanyFollowing();
  const follow = useCompanyFollowMutation();
  const unfollow = useCompanyUnfollowMutation();
  const isFollowing = following.isFollowing(companyId);

  return {
    isFollowing,
    follow: () => {
      if (isFollowing) return;
      follow.mutate(companyId);
    },
    unfollow: () => {
      if (!isFollowing) return;
      unfollow.mutate(companyId);
    },
    toggle: () => {
      if (isFollowing) {
        unfollow.mutate(companyId);
        toast.success('Unsubscribed from company');
        return;
      }
      follow.mutate(companyId);
      toast.success('Subscribed to company');
    },
    isLoading: follow.isPending || unfollow.isPending || following.isLoading,
    isError: follow.isError || unfollow.isError || following.isError
  };
};
