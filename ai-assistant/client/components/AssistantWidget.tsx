import React, { useEffect, useState } from 'react';

interface AssistantWidgetProps {
  tenantId: string;
  messages: ChatMessage[];
  config: any;
}
interface Theme {
  mainColor: string;
}
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AssistantWidget: React.FC<AssistantWidgetProps> = ({ apiUrl, tenantId, config }) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the theme from the API, using apiUrl from localStorage
    const fetchTheme = async () => {
      setLoading(true);
      try {
        // Get the apiUrl from localStorage, if not found use a default value
        const savedApiUrl = localStorage.getItem('apiUrl') || '';

        // Make a GET request to the /get-theme route
        const response = await fetch(`${savedApiUrl}/get-theme`, {
          method: 'GET',
          headers: {
            'X-API-Key': tenantId, // Assuming tenantId is used as the API key
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTheme(data);
        } else {
          console.error('Failed to fetch theme');
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [tenantId]); // Only re-run if tenantId changes

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);
  const [input, setInput] = useState('');

  // Function to handle sending a message
  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Add the user's message to the chat messages
    setChatMessages([...chatMessages, { role: 'user', content: input }]);
    setInput(''); // Clear the input field

    try {
      // Get the apiUrl from localStorage, if not found use a default value
      const savedApiUrl = localStorage.getItem('apiUrl') || '';

      // Make a POST request to the /chat endpoint with the user's message
      const response = await fetch(`${savedApiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': tenantId,
        },
        body: JSON.stringify({ message: input }),
      });
      if (response.ok) {
        const data = await response.json();
          // Add the assistant's response to the chat messages
          setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
      } else {
        // Handle errors by adding an error message to the chat
        const errorData = await response.json();
        setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: `Error: ${errorData.error || 'Failed to send message'}` }]);
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: `Error: ${error.message || 'An unexpected error occurred'}` }]);
    }
  };

   return (
     <div
       style={{
         backgroundColor: theme?.mainColor || "white",
         padding: "20px",
         borderRadius: "10px",
       }}
     >
       {loading ? (
         "Loading theme..."
       ) : (
         <>
           <div style={{ marginBottom: "10px" }}>
             {messages.map((message, index) => (
               <div // Display each message with appropriate styling
                 key={index}
                 style={{
                   textAlign: message.role === "user" ? "right" : "left",
                   marginBottom: "5px",
                 }}
               >
                 <strong>{message.role === "user" ? "You: " : "Assistant: "}</strong>
                 {message.content}
               </div>
             ))}
           </div>
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Type your message..."
             style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
           />
           <button
             onClick={sendMessage}
             style={{ padding: "5px 10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px" }}
           >
             Send
           </button>
         </>
       )}
     </div>
   );
};
export default AssistantWidget;