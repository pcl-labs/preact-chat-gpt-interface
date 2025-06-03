// Complete fixed version of the sendMessageToAPI function
// Copy this entire function and replace your current implementation

const sendMessageToAPI = async (message, attachments = []) => {
    setIsLoading(true);
    
    try {
        // Create user message
        const userMessage = {
            content: message,
            isUser: true,
            files: attachments
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setPreviewFiles([]);
        
        // Add a placeholder AI message immediately that will be updated
        const placeholderId = Date.now().toString();
        const placeholderMessage = {
            content: '',
            isUser: false,
            id: placeholderId
        };
        
        setMessages(prev => [...prev, placeholderMessage]);
        
        // Check if this is a scheduled message
        const hasSchedulingIntent = detectSchedulingIntent(message);
        
        // This simulates the AI detecting scheduling intent and responding
        if (hasSchedulingIntent) {
            // Start typing after a short delay
            setTimeout(() => {
                setIsLoading(false);
                
                // Create a scheduling response using our utility
                const aiResponse = createSchedulingResponse('initial');
                
                // Replace the placeholder message with the actual response
                setMessages(prev => prev.map(msg => 
                    msg.id === placeholderId ? { ...aiResponse, id: placeholderId } : msg
                ));
            }, 1000);
            
            return;
        }
        
        // Use configurable API endpoint
        console.log('API Configuration:', { apiUrl, teamId });
        const apiEndpoint = `${apiUrl}?teamId=${encodeURIComponent(teamId)}`;
        
        // Set loading to false as we'll start receiving the response
        setIsLoading(false);
        
        try {
            console.log('Sending request to:', apiEndpoint);
            
            // Try with a more permissive CORS configuration for embedded scenarios
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/event-stream'
                },
                // Updated format based on the API error message
                body: JSON.stringify({
                    // Use 'text' property instead of 'messages' array
                    text: message,
                    teamId: teamId
                }),
                mode: 'cors',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`API response error: ${response.status} ${response.statusText}`);
            }
            
            // Check if the response supports streaming
            if (response.body) {
                const reader = response.body.getReader();
                let aiResponseText = '';
                
                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) {
                        break;
                    }
                    
                    // Decode and append new text
                    const text = new TextDecoder().decode(value);
                    aiResponseText += text;
                    
                    // Update the placeholder message with the current text
                    setMessages(prev => prev.map(msg => 
                        msg.id === placeholderId ? { 
                            ...msg, 
                            content: aiResponseText 
                        } : msg
                    ));
                }
            } else {
                // Fallback for non-streaming responses
                const data = await response.json();
                const aiResponseText = data.message || data.content || data.response || '';
                
                // Update the placeholder message with the response
                setMessages(prev => prev.map(msg => 
                    msg.id === placeholderId ? { 
                        ...msg, 
                        content: aiResponseText 
                    } : msg
                ));
            }
        } catch (error) {
            console.error('Error fetching from AI API:', error);
            
            // Get more detailed error information
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            // Notify parent frame about the error for better debugging
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'chat_api_error',
                    error: errorMessage,
                    apiEndpoint,
                    teamId
                }, '*');
            }
            
            // Update placeholder with more detailed error message
            setMessages(prev => prev.map(msg => 
                msg.id === placeholderId ? { 
                    ...msg, 
                    content: `Sorry, there was an error connecting to our AI service: ${errorMessage}. Please try again later.` 
                } : msg
            ));
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        setIsLoading(false);
        
        // Add error message
        const errorMessage = {
            content: "Sorry, there was an error processing your request. Please try again.",
            isUser: false
        };
        
        setMessages(prev => [...prev, errorMessage]);
    }
};
