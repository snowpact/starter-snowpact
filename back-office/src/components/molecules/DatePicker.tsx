import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { cn } from '@/utils/common';

interface DatePickerProps {
  date?: Date;
  onChange?: (date?: Date) => void;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ date, onChange, className, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal relative group',
            !date && 'text-muted-foreground',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </div>
          {date && !disabled && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 opacity-70 hover:opacity-100"
              onClick={e => {
                e.stopPropagation();
                onChange?.(undefined);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={selectedDate => {
            onChange?.(selectedDate);
          }}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
