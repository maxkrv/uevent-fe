import React, { ElementType } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { HashLink } from 'react-router-hash-link';

import { cn } from '../../lib/utils';
import { buttonVariants } from '../ui/button';

const remToPixels = (rem: number | string): number => {
  let value: number;

  if (typeof rem === 'string') {
    value = parseFloat(rem.replace(/rem/g, ''));
  } else {
    value = rem;
  }
  if (isNaN(value)) {
    return 0;
  }
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return value * fontSize;
};

interface ConditionalLinkProps extends Omit<React.ComponentProps<typeof HashLink>, 'to'> {
  to?: string;
  as?: ElementType;
}

export const ConditionalLink: React.FC<ConditionalLinkProps> = ({ to, as = 'div', ...rest }) => {
  const Wrapper = to ? Link : as;

  return <Wrapper {...rest} to={to} />;
};

interface LinkProps extends React.ComponentProps<typeof HashLink> {
  withArrow?: boolean;
}

export const Link = ({ onClick, withArrow, ...props }: LinkProps) => {
  const getTopOffset = () => {
    const rem = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    return remToPixels(rem);
  };

  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({ top: yCoordinate - getTopOffset(), behavior: 'smooth' });
  };

  return (
    <HashLink
      scroll={(el) => scrollWithOffset(el)}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (props.to !== window.location.pathname && !props.to.toString().includes('#')) window.scrollTo(0, 0);
      }}
      className={cn(buttonVariants({ variant: 'link' }), withArrow && 'flex items-center group', props.className)}>
      {props.children}
      {withArrow && (
        <FiArrowRight className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300 stroke-3" />
      )}
    </HashLink>
  );
};
