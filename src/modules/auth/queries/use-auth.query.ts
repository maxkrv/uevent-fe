'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { TimeUtils } from '../../../shared/utils/time.utils';
import { UserService } from '../../user/services/user.service';

export function userGroupOptions() {
  return queryOptions({
    queryKey: [QueryKeys.USERS, 'me'],
    queryFn: UserService.me,
    retryDelay: TimeUtils.ONE_MINUTE
  });
}

export function useAuth() {
  const user = useQuery(userGroupOptions());

  return {
    data: user.data,
    isLoading: user.isLoading,
    isError: user.isError,
    error: user.error,
    isLoggedIn: !!user.data
  };
}
