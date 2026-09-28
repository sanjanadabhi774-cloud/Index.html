import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Check } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  isEditable: boolean;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isEditable,
  className = '',
  multiline = false,
  placeholder = 'Click to edit text...',
  as = 'span'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentVal !== value) {
      onChange(currentVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentVal(value);
      setIsEditing(false);
    }
  };

  if (!isEditable) {
    const Tag = as;
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1.5 w-full my-1 z-20">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            rows={3}
            className={`w-full p-2 rounded-lg bg-stone-900 text-amber-100 border-2 border-amber-400 focus:outline-none shadow-lg leading-relaxed ${className}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full p-1.5 rounded-lg bg-stone-900 text-amber-100 border-2 border-amber-400 focus:outline-none shadow-lg ${className}`}
          />
        )}
        <button
          onClick={handleSave}
          type="button"
          className="p-1 rounded bg-amber-400 text-amber-950 hover:bg-amber-300 cursor-pointer shrink-0"
          title="Save text"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const Tag = as;
  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`group/edit relative cursor-pointer hover:outline-dashed hover:outline-1 hover:outline-amber-400/80 rounded px-1 transition-all ${className}`}
      title="Click to edit this text"
    >
      <Tag className="inline">{value || placeholder}</Tag>
      <Edit2 className="inline ml-1.5 w-3 h-3 text-amber-400 opacity-60 group-hover/edit:opacity-100 transition-opacity" />
    </span>
  );
};
