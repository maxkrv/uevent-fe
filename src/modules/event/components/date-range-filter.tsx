import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';

import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';

import { DateInput } from '../../../shared/components/form/input/date-input';
import { Button } from '../../../shared/components/ui/button';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

type QuickDateOption = 'today' | 'tomorrow' | 'thisWeek' | 'thisWeekend' | 'nextMonth' | null;

const QUICK_OPTIONS: { label: string; value: QuickDateOption; getRange: (base: dayjs.Dayjs) => DateRange }[] = [
  {
    label: 'Today',
    value: 'today',
    getRange: (base) => ({ from: base.toDate(), to: base.toDate() })
  },
  {
    label: 'Tomorrow',
    value: 'tomorrow',
    getRange: (base) => {
      const d = base.add(1, 'day');
      return { from: d.toDate(), to: d.toDate() };
    }
  },
  {
    label: 'This Week',
    value: 'thisWeek',
    getRange: (base) => ({ from: base.toDate(), to: base.add(7, 'day').toDate() })
  },
  {
    label: 'This Weekend',
    value: 'thisWeekend',
    getRange: (base) => {
      const friday = base.day() <= 5 ? base.day(5) : base.day(12);
      return { from: friday.toDate(), to: friday.add(2, 'day').toDate() };
    }
  },
  {
    label: 'Next Month',
    value: 'nextMonth',
    getRange: (base) => ({ from: base.toDate(), to: base.add(1, 'month').toDate() })
  }
];

export const DateRangeFilter = ({ dateRange, onDateRangeChange, className }: DateRangeFilterProps) => {
  const [quickDateFilter, setQuickDateFilter] = useState<QuickDateOption>(null);
  const today = useMemo(() => dayjs().startOf('day'), []);

  const handleQuickDateSelect = (option: QuickDateOption) => {
    if (option === quickDateFilter) {
      setQuickDateFilter(null);
      onDateRangeChange({ from: undefined, to: undefined });
      return;
    }

    setQuickDateFilter(option);
    const selected = QUICK_OPTIONS.find((o) => o.value === option);
    if (selected) {
      onDateRangeChange(selected.getRange(today));
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center mb-3">
        <FiCalendar className="mr-2 text-primary" />
        <h3 className="font-semibold">Date Range</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_OPTIONS.map(({ label, value }) => (
          <Button
            key={value}
            variant={quickDateFilter === value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleQuickDateSelect(value)}>
            {label}
          </Button>
        ))}
      </div>

      <div className="flex gap-4 flex-wrap w-full *:grow">
        <div>
          <Label htmlFor="date-from" className="text-sm mb-1 block">
            From
          </Label>
          <DateInput
            id="date-from"
            value={dateRange.from}
            onSelect={(date) => {
              onDateRangeChange({ ...dateRange, from: date });
              setQuickDateFilter(null);
            }}
          />
        </div>

        <div>
          <Label htmlFor="date-to" className="text-sm mb-1 block">
            To
          </Label>
          <DateInput
            id="date-to"
            value={dateRange.to}
            minDate={dateRange.from}
            onSelect={(date) => {
              onDateRangeChange({ ...dateRange, to: date });
              setQuickDateFilter(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};
