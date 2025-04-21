'use client';

import { useParams } from 'react-router-dom';

import { NotFoundPage } from '../../../shared/pages/not-found-page';
import { UserFollowing } from '../components/user-profile/user-following';

export const UserFollowingPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFoundPage />;
  }

  return <UserFollowing userId={id} />;
};
