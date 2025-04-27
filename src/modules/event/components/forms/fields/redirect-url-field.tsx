'use client';

import { Link2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import type { Optional } from '@/shared/types/interfaces';

interface RedirectUrlFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
}

export const RedirectUrlField = ({
  label = 'Redirect URL After Purchase (Optional)',
  description = 'Where to send attendees after they purchase a ticket',
  placeholder = 'https://example.com/thank-you',
  className = 'pl-10 h-12'
}: RedirectUrlFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'redirectUrl'}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base">{label}</FormLabel>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <FormControl>
              <Input
                className={className}
                placeholder={placeholder}
                type="url"
                minLength={0}
                value={field.value ?? ''}
                onChange={(e) => {
                  field.onChange(e.target.value ?? null);
                }}
              />
            </FormControl>
          </div>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
