import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  colorClass?: string;
  formatLabel?: (value: string) => string;
}

export function FilterDropdown({ 
  label, 
  options, 
  selectedValues, 
  onChange,
  colorClass = 'bg-secondary text-secondary-foreground',
  formatLabel,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus management when dropdown opens
  useEffect(() => {
    if (isOpen && options.length > 0) {
      setFocusedIndex(0);
      optionRefs.current[0]?.focus();
    }
  }, [isOpen, options.length]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => {
          const next = prev < options.length - 1 ? prev + 1 : 0;
          optionRefs.current[next]?.focus();
          return next;
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => {
          const next = prev > 0 ? prev - 1 : options.length - 1;
          optionRefs.current[next]?.focus();
          return next;
        });
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        optionRefs.current[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(options.length - 1);
        optionRefs.current[options.length - 1]?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  }, [isOpen, options.length]);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const hasSelections = selectedValues.length > 0;
  const dropdownId = `filter-dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-1">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`filter-pill ${hasSelections ? 'filter-pill-active' : 'filter-pill-inactive'} focus-ring`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={dropdownId}
          aria-label={`Filter by ${label}${hasSelections ? `, ${selectedValues.length} selected` : ''}`}
          id={`${dropdownId}-button`}
        >
          <span className="font-semibold">{label}</span>
          {hasSelections && (
            <span 
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-foreground/20 text-xs"
              aria-hidden="true"
            >
              {selectedValues.length}
            </span>
          )}
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            aria-hidden="true"
          />
        </button>
        {hasSelections && (
          <button
            onClick={clearAll}
            className="p-1.5 rounded-full hover:bg-muted transition-colors focus-ring"
            aria-label={`Clear all ${label} filters`}
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
          </button>
        )}
      </div>

      {isOpen && (
        <div 
          id={dropdownId}
          className="absolute z-50 mt-2 w-64 max-h-72 overflow-auto rounded-xl bg-card border border-border shadow-card animate-fade-in"
          role="listbox"
          aria-multiselectable="true"
          aria-label={`${label} options`}
          aria-labelledby={`${dropdownId}-button`}
        >
          <div className="p-2">
            {options.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground" role="status">No options available</p>
            ) : (
              options.map((option, index) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <button
                    key={option}
                    ref={el => optionRefs.current[index] = el}
                    onClick={() => toggleOption(option)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors focus-ring ${
                      isSelected 
                        ? `${colorClass}` 
                        : 'hover:bg-muted'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={focusedIndex === index ? 0 : -1}
                  >
                    <span 
                      className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                        isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground/30'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </span>
                    <span className="flex-1 truncate capitalize">{formatLabel ? formatLabel(option) : (option || '(No value)')}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
