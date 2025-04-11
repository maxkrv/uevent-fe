import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

import { EventAnimation } from '../components/common/event-animation';

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid min-h-screen-no-header lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:flex lg:items-center lg:justify-center">
        {/* <Logo /> */}
        <img
          src="/placeholder.svg"
          alt="Calendar App Dashboard"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 animate-pulse-slow blur-xs"
        />
        <EventAnimation />
      </div>
    </div>
  );
};
