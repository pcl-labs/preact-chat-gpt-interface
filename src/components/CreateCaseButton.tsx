import { FunctionalComponent } from 'preact';
import { useState, useCallback } from 'preact/hooks';

interface CreateCaseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/**
 * Create Support Case button component with folder/support icon
 * Matches the style of ScheduleButton
 */
const CreateCaseButton: FunctionalComponent<CreateCaseButtonProps> = ({ 
  onClick, 
  disabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      class="schedule-button" // Use the same class as ScheduleButton
      aria-label="Create Support Case"
      title="Create Support Case"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CaseIcon isHovered={isHovered} />
      <span class="schedule-button-text">Create Support Case</span>
    </button>
  );
};

interface IconProps {
  isHovered: boolean;
}

/**
 * Folder/support icon SVG component
 */
const CaseIcon: FunctionalComponent<IconProps> = ({ isHovered }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="calendar-icon" // Use the same class as ScheduleButton's icon
    >
      <rect x="3" y="7" width="18" height="13" rx="2" ry="2"></rect>
      <path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"></path>
    </svg>
  );
};

export default CreateCaseButton; 