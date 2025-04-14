import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { App } from './app';
import { AuthLayout } from './modules/auth/layout/auth-layout';
import { ActivateAccountPage } from './modules/auth/pages/activate-account-page';
import { ForgotPasswordPage } from './modules/auth/pages/forgot-password-page';
import { LoginPage } from './modules/auth/pages/login-page';
import { ResetPasswordPage } from './modules/auth/pages/reset-password-page';
import { SignUpPage } from './modules/auth/pages/sign-up-page';
import { EventPage } from './modules/event/pages/event-page';
import { EventsPage } from './modules/event/pages/events-page';
import { HomePage } from './modules/home/pages/home.page';
import { UserPage } from './modules/user/pages/user.page';
import { NotFoundPage } from './shared/pages/not-found-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/auth/login" replace />
          },
          {
            path: 'activate/:token',
            element: <ActivateAccountPage />
          },
          {
            path: 'login',
            element: <LoginPage />
          },
          {
            path: 'sign-up',
            element: <SignUpPage />
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />
          },
          {
            path: 'reset-password/:token',
            element: <ResetPasswordPage />
          }
        ]
      },
      {
        path: 'user',
        element: <UserPage />
      },
      { path: 'events', element: <EventsPage /> },
      {
        path: 'events/:id',
        element: <EventPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
