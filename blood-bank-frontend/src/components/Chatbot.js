import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // Stores chat history: [{ role: 'user', text: '...' }, { role: 'model', text: '...' }]
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // IMPORTANT: Gemini API Key. For client-side calls, it's exposed.
  // For production, you'd typically proxy this through your own backend.
  // For this resume project, we'll use it directly.
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ''; // Ensure you set this in your frontend .env file!

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageToGemini = async (userMessage) => {
    setIsSending(true);
    const newMessages = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(newMessages);
    setInput(''); // Clear input immediately

    try {
      const payload = {
        contents: newMessages, // Send the entire chat history
        // You can add generationConfig for structured responses if needed
        // generationConfig: {
        //     responseMimeType: "application/json",
        //     responseSchema: { type: "STRING" }
        // }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const modelResponseText = result.candidates[0].content.parts[0].text;
        setMessages(prevMessages => [...prevMessages, { role: 'model', parts: [{ text: modelResponseText }] }]);
      } else {
        console.error('Gemini API response structure unexpected:', result);
        setMessages(prevMessages => [...prevMessages, { role: 'model', parts: [{ text: 'Sorry, I could not get a response. Please try again.' }] }]);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'model', parts: [{ text: 'There was an error connecting to the chatbot. Please try again later.' }] }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && !isSending) {
      sendMessageToGemini(input.trim());
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-110 z-50"
        aria-label="Open Chatbot"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          )}
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 animate-fade-in-up-chat">
          <div className="bg-red-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">BloodLink Chatbot</h3>
            <button onClick={() => setIsOpen(false)} className="text-white text-xl leading-none">&times;</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                Type a question about blood donation, eligibility, or procedures!
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-800 self-end ml-auto'
                    : 'bg-gray-100 text-gray-800 self-start mr-auto'
                }`}
                style={{ maxWidth: '80%' }}
              >
                {msg.parts.map((part, pIdx) => (
                  <span key={pIdx}>{part.text}</span>
                ))}
              </div>
            ))}
            {isSending && (
              <div className="p-2 rounded-lg text-sm bg-gray-100 text-gray-800 self-start mr-auto">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll anchor */}
          </div>
          <form onSubmit={handleSend} className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isSending}
            />
            <button
              type="submit"
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              disabled={isSending}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;