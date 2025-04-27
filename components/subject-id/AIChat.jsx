import React, { useState } from "react";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";

const AIChat = ({
  expanded,
  messages,
  subjectName,
  onToggleExpanded,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div
      className={`fixed top-4 left-4 h-[calc(100vh-2rem)] z-10 transition-all duration-300 ease-in-out 
      ${expanded ? "w-80" : "w-16"} 
      shadow-xl rounded-lg bg-white flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleExpanded}
        className="absolute -right-3 top-8 bg-white rounded-full w-6 h-6 shadow-md flex items-center justify-center text-blue-500 hover:text-blue-700"
      >
        {expanded ? (
          <IoChevronBackOutline className="w-4 h-4" />
        ) : (
          <IoChevronForwardOutline className="w-4 h-4" />
        )}
      </button>
      {/* Chat Header */}
      <div
        className={`p-3 border-b flex items-center ${
          !expanded && "justify-center"
        }`}
      >
        {expanded ? (
          <h2 className="font-semibold">עוזר הלמידה החכם</h2>
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
            AI
          </div>
        )}
      </div>
      {/* Chat Body - Only visible when expanded */}
      {expanded && (
        <>
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-center p-4">
                <p>שאל שאלה על הנושא {subjectName}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] p-3 rounded-lg text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t p-2">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="הקלד שאלה..."
                className="flex-1 border rounded-r-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-2 py-1 rounded-l-lg hover:bg-blue-600 transition-colors text-sm"
              >
                שלח
              </button>
            </div>
          </div>
        </>
      )}
      {/* Collapsed mode prompt */}
      {!expanded && (
        <div className="flex-1 flex items-center justify-center p-1">
          <span
            className="text-blue-500 font-semibold vertical-text transform rotate-180"
            style={{ writingMode: "vertical-rl" }}
          >
            שאל את העוזר
          </span>
        </div>
      )}
    </div>
  );
};

export default AIChat;
