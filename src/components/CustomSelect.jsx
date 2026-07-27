import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select option...', 
  className = '',
  icon: Icon,
  compact = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val, e) => {
    if (e) e.stopPropagation();
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div 
      className={`custom-select-container ${compact ? 'compact' : ''} ${isOpen ? 'active-z' : ''} ${className}`} 
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`custom-select-trigger ${compact ? 'compact-trigger' : ''} ${isOpen ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-left">
          {Icon && <Icon size={compact ? 13 : 16} className="select-lead-icon" />}
          {selectedOption?.badge && (
            <span className={`option-badge ${selectedOption.badgeColor || ''}`}>
              {selectedOption.badge}
            </span>
          )}
          <span className={`trigger-label ${!selectedOption ? 'placeholder' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={compact ? 13 : 16} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="custom-select-menu glass-panel" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`select-option-item ${isSelected ? 'selected' : ''}`}
                onClick={(e) => handleSelect(opt.value, e)}
                role="option"
                aria-selected={isSelected}
              >
                <div className="option-label-group">
                  {opt.badge && <span className={`option-badge ${opt.badgeColor || ''}`}>{opt.badge}</span>}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={14} className="check-icon" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
