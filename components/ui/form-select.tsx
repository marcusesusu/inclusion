'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2, ChevronDown, Search, X } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export const FormSelect = React.forwardRef<HTMLDivElement, FormSelectProps>(
  ({ name, label, options, placeholder = 'Select an option', description, className = '', disabled }, ref) => {
    const {
      setValue,
      watch,
      clearErrors,
      formState: { errors, touchedFields },
    } = useFormContext();

    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedValue = watch(name);
    const errorMessage = errors[name]?.message as string | undefined;
    const isTouched = touchedFields[name];
    const isValid = isTouched && !errorMessage && selectedValue !== undefined && selectedValue !== '';

    const selectedOption = options.find((opt) => String(opt.value) === String(selectedValue));

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    // Close popover when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      setValue(name, option.value, { shouldValidate: true, shouldTouch: true });
      clearErrors(name);
      setIsOpen(false);
      setSearchQuery('');
    };

    return (
      <div ref={containerRef} className="w-full space-y-1.5 relative">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
          {isValid && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Selected
            </span>
          )}
        </div>

        {/* Trigger Button */}
        <div className="relative" ref={ref}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between rounded-lg border bg-muted/40 hover:bg-muted/70 px-3.5 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
              errorMessage
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            } ${className}`}
          >
            <span className={selectedOption ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Searchable Options Popover */}
          {isOpen && (
            <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95">
              {/* Search Box Header */}
              <div className="p-2 border-b border-border bg-muted/30">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search options..."
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 text-muted-foreground hover:text-foreground p-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Option List */}
              <div className="max-h-56 overflow-y-auto p-1 space-y-0.5 scrollbar-thin">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No matching options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = String(option.value) === String(selectedValue);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={option.disabled}
                        onClick={() => handleSelect(option)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-foreground hover:bg-muted/80'
                        } ${option.disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {description && !errorMessage && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
