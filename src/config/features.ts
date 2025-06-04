/**
 * Feature flags configuration
 * 
 * This file contains feature flags that can be toggled to enable/disable
 * specific features in the application without code changes.
 */

interface FeatureFlags {
    /**
     * Enable audio recording feature
     * When false, the audio recording button will be hidden from the UI
     */
    enableAudioRecording: boolean;

    /**
     * Enable video recording feature (future)
     * Not currently implemented in the UI
     */
    enableVideoRecording: boolean;

    /**
     * Enable file attachments
     * When false, file upload functionality will be hidden
     */
    enableFileAttachments: boolean;

    /**
     * Enable consultation feature (scheduling, consultation quick action)
     */
    enableConsultation: boolean;

    /**
     * Enable 'Learn about our services' quick action
     */
    enableServicesQuickAction: boolean;
}

const features: FeatureFlags = {
    enableAudioRecording: false, // Set to false to hide voice recording
    enableVideoRecording: false, // Not implemented yet
    enableFileAttachments: true, // File attachments are enabled
    enableConsultation: false, // Consultation feature is disabled by default
    enableServicesQuickAction: false, // Services quick action is disabled by default
};

// For development environment, you can override settings
if (import.meta.env.DEV) {
    // Enable all features in development if needed
    // features.enableAudioRecording = true; 
}

export default features; 