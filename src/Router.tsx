import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './app';
import { ActivateAccountPage } from './modules/auth/pages/activate-account-page';
import { ForgotPasswordPage } from './modules/auth/pages/forgot-password-page';
import { LoginPage } from './modules/auth/pages/login-page';
import { ResetPasswordPage } from './modules/auth/pages/reset-password-page';
import { SignUpPage } from './modules/auth/pages/sign-up-page';
import { HomePage } from './modules/home/home-page';
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
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/sign-up',
        element: <SignUpPage />
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: '/auth/reset-password/:token',
        element: <ResetPasswordPage />
      },
      {
        path: '/auth/activate/:token',
        element: <ActivateAccountPage />
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
