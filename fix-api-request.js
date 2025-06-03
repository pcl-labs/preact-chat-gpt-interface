/*
This is a fix for your API request format.
Replace the fetch call in your sendMessageToAPI function with this code.
*/

// Inside your sendMessageToAPI function, replace the fetch call:

try {
  console.log('Sending request to:', apiEndpoint);
  
  // Try with a more permissive CORS configuration for embedded scenarios
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    // Change the body format to match the API's requirements
    body: JSON.stringify({
      // Use 'text' property instead of 'messages'
      text: message, 
      
      // If the API needs context, you can include it as:
      // context: messageHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      
      // Add teamId in the body as well (redundant but might help)
      teamId: teamId
    }),
    mode: 'cors',
    credentials: 'same-origin'
  });
  
  // Rest of your code remains the same...
