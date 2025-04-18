'use client';

import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

import { ImagePlaceholder } from './image-placeholder';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  blurAmount?: string;
  loadingClassName?: string;
  loadingComponent?: React.ReactNode;
  noImageComponent?: React.ReactNode;
  wrapperClassName?: string;
  showLoader?: boolean;
  showNoImage?: boolean;
}

// Default loading component
const DefaultLoader = () => (
  <div className="bg-background/80 rounded-full p-1 shadow-sm aspect-square max-w-1/6 max-h-1/6">
    <Loader2 className="size-full animate-spin text-primary aspect-square" />
  </div>
);

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      fallbackSrc,
      alt,
      className,
      blurAmount = '0.5rem',
      loadingComponent = <DefaultLoader />,
      noImageComponent = <ImagePlaceholder />,
      wrapperClassName,
      showNoImage = true,
      style,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    // Check if src is provided
    const isSrcProvided = Boolean(src && src !== '');

    // Determine the actual source to use
    const actualSrc = error && fallbackSrc ? fallbackSrc : src;

    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      props.onLoad?.(event);
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      if (fallbackSrc && src !== fallbackSrc) {
        setError(true);
      }
      props.onError?.(event);
    };

    const imageStyle = {
      ...style,
      filter: isLoading ? `blur(${blurAmount})` : 'none',
      transition: 'filter 0.3s ease-in-out'
    };

    // Wrap everything in a div for positioning
    return (
      <div className={cn('relative w-full h-full', wrapperClassName)}>
        <img
          ref={ref}
          src={actualSrc || fallbackSrc}
          loading="lazy"
          alt={alt}
          style={imageStyle}
          className={cn(className, !isSrcProvided && showNoImage && 'hidden')}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
        {!isSrcProvided && showNoImage && (
          <div className="absolute inset-0 flex items-center justify-center">{noImageComponent}</div>
        )}
        {isLoading && isSrcProvided && (
          <div className="absolute inset-0  flex items-center justify-center">{loadingComponent}</div>
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';
