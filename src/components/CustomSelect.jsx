import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const menuHeight = 240;
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpwards = spaceBelow < menuHeight + 20;

    setMenuStyle({
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${Math.max(rect.width, 180)}px`,
      zIndex: 999999,
      ...(openUpwards
        ? { bottom: `${viewportHeight - rect.top + 4}px`, top: 'auto' }
        : { top: `${rect.bottom + 4}px`, bottom: 'auto' })
    });
  };

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isOpen]);

  const handleSelect = (val, e) => {
    if (e) e.stopPropagation();
    onChange(val);
    setIsOpen(false);
  };

  const menu = isOpen ? createPortal(
    <div
      ref={menuRef}
      className="custom-select-menu glass-panel portal-menu"
      style={menuStyle}
      role="listbox"
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <div
            key={opt.value}
            className={`select-option-item ${isSelected ? 'selected' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); handleSelect(opt.value, e); }}
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
    </div>,
    document.body
  ) : null;

  return (
    <div className={`custom-select-container ${compact ? 'compact' : ''} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`custom-select-trigger ${compact ? 'compact-trigger' : ''} ${isOpen ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
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
      {menu}
    </div>
  );
}
