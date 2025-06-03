# ChatGPT-like Chat Interface Requirements

## Project Setup ✅
- Preact project initialized with Vite ✅
- TypeScript support configured ✅
- ESLint with Preact configuration ✅
- Development environment ready ✅

## Core Features
- Implement chat interface using Preact functional components ✅
  - Basic message component ✅
  - Input handling ✅
  - Message list with auto-scroll ✅
- Utilize Preact's built-in state management (hooks) ✅
  - Message state management ✅
  - Input state management ✅
- Design to resemble ChatGPT's interface ✅
  - Basic layout structure ✅
  - Dark/light theme support ✅
  - Responsive design ✅
  - UI polish and refinements ✅
- Support for Markdown and code syntax highlighting ✅
  - Install markdown library ✅
  - Add code block support ✅
  - Style markdown elements ✅
- Support for sending/receiving files ✅
  - Basic file upload component ✅
  - File preview ✅
  - File type validation ✅
  - UI polish and refinements ✅
- Loading indicators ✅
  - Typing animation ✅
  - Input disabled state ✅
  - Loading state management ✅
- Media recording support ✅
  - Audio recording ✅
    - Recording UI with waveform visualization ✅
    - Timer display ✅
    - Cancel/Confirm controls ✅
    - Theme-consistent colors ✅
    - Fluid animation with smooth transitions ✅
    - Proper resource cleanup on browser ✅
  - Media preview ✅
    - Proper audio player in messages ✅
    - Type-specific rendering ✅
- Simple welcome message replacing introduction panel ✅

## UI Refinements ✅
- Repositioned audio recording button next to send button ✅
- Hidden video recording (moved to future milestone) ✅
- Cleaned up input controls layout ✅
- Unified styling of controls with circular buttons ✅
- Made send button change icon based on input state ✅
- Optimized input area icon sizes for better proportions ✅
- Improved placeholder vs input text distinction ✅
- Enhanced theme color consistency across controls ✅
- Fixed audio recording visualization with proper animation ✅
- Implemented functional real-time audio visualization ✅

## UI Components
- Create reusable Preact components:
  - ChatContainer (main wrapper component) ✅
  - MessageList (virtualized list for performance) ✅
  - Message (individual message component) ✅
  - InputArea (composition of input components) ✅
  - FileUpload component ✅
  - LoadingIndicator component ✅
  - MediaControls component ✅
  - LazyMedia component ✅
  - Lightbox component ✅
  - FileMenu component ✅
  - AudioRecordingUI component with visualization ✅
  - CameraModal component ✅
  - SkeletonLoader component for async loading ✅

## Performance Requirements
- Bundle size optimization:
  - Code splitting for route-based components ✅
  - Dynamic imports for heavy features ✅
  - Tree-shaking friendly imports ✅
  - Minimal external dependencies ✅
- Runtime performance:
  - Efficient re-rendering with memo usage ✅
  - Virtualized lists for message history ✅
  - Lazy loading for images and media ✅
  - Debounced event handlers ✅
  - Optimized asset delivery ✅
  - Efficient canvas rendering for audio visualization ✅
- Build optimization:
  - Minification and compression ✅
  - Modern bundle output targeting ✅
  - Asset optimization pipeline ✅
  - Critical CSS extraction ✅
  - Bundle analysis with visualizer ✅

## Recent Improvements (Latest Updates)
- Added Blawby Chat branding ✅
  - Updated page title and metadata ✅
  - Created custom favicon with theme support ✅
  - Added OpenGraph and social sharing metadata ✅
- Implemented dynamic imports with lazy loading ✅
  - Added skeleton loading components ✅
  - Lazy-loaded heavy components (MediaControls, FileMenu, etc.) ✅
  - Created utility for easy component lazy loading ✅
- Optimized build for production ✅
  - Implemented Gzip and Brotli compression ✅
  - Set up proper code splitting and chunking ✅
  - Added critical CSS extraction for faster rendering ✅
  - Configured PWA support for offline capabilities ✅
  - Optimized asset delivery with proper organization ✅
  - Fixed compression error messages with custom plugin ✅
- Removed test/placeholder responses ✅
  - Prepared for real API integration ✅
  - Cleaned up mock data and test messages ✅
- Added feature flags system ✅
  - Created configuration for toggling features ✅
  - Disabled voice recording via feature flag ✅
  - Implemented conditional UI rendering ✅
- Added comprehensive scheduling functionality ✅
  - Implemented date selection with 3x3 grid UI ✅
  - Created time-of-day and time slot selectors ✅
  - Added scheduling confirmation cards with timezone support ✅
  - Enabled user-initiated scheduling via Schedule button ✅
  - Added AI-initiated scheduling with intent detection ✅
  - Created utilities for managing scheduling conversation flows ✅

## Next Immediate Tasks (Priority Order)
1. Integration with ai.blawby.com ✅
   - Add teamId extraction from URL parameters ✅
   - Update API endpoints to use teamId from URL ✅
   - Implement business details fetching from API ✅
   - Set up postMessage communication with parent frame ✅
   - Add state change notifications (open/closed status) ✅
   - Ensure proper iframe embedding behavior ✅

2. Add scheduling functionality
   - Add "Schedule" button with icon next to the plus button ✅
   - Implement date selection workflow with 3x3 grid (9 days) UI ✅
   - Add "Show More Dates" button to extend selection beyond initial 9 days ✅
   - Create time selection with morning/afternoon quick options ✅
   - Implement 30-minute increment time slots after time-of-day selection ✅
   - Add calendar icons next to scheduled dates in message history ✅
   - Create visual confirmation card with date, time, and timezone information ✅
   - Ensure all selections are sent as text messages in chat ✅
   - Implement automatic timezone detection and display ✅
   - Style components to match existing UI theme ✅
   - Support AI-initiated scheduling flows ✅
     - Add scheduling intent detection from user messages ✅
     - Create utility for generating scheduling responses ✅
     - Enable AI to proactively suggest scheduling ✅
     - Integrate with conversation flow seamlessly ✅


2.5 intro question request selector and prioritu selector

3. Accessibility improvements
   - Add keyboard navigation support
   - Improve screen reader compatibility
   - Add ARIA attributes to interactive elements
   - Implement focus management

4. Testing and QA
   - Test iframe embedding scenarios
   - Verify API connectivity with team contexts
   - Test cross-origin communication
   - Verify proper light/dark theme behavior in iframe context

## Future Tasks
- Speech-to-text integration
- Text-to-speech integration
- Service worker for offline support (initial implementation done)
- Video recording capabilities
- Message search functionality
- Keyboard shortcuts and accessibility improvements
- Internationalization (i18n) support

## Horizon Milestones
- Video conferencing capabilities
  - WebRTC integration
  - Video chat UI components
  - Screen sharing support
  - Video recording and playback
- Advanced collaboration features
  - Real-time cursors
  - Shared whiteboard
  - Document collaboration

Legend:
✅ - Completed
🔄 - In Progress/Planned
❌ - Blocked/Issues 