import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Send,
  Loader,
  X,
  Maximize2,
  Minimize2,
  MessageCircle,
} from "lucide-react";

const MAX_TOKENS = 2048; // Token limit for responses

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Custom Input Component
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Custom Button Component
const Button = ({ children, className = "", disabled = false, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// Custom ScrollArea Component
const ScrollArea = ({ children, className = "" }) => (
  <div
    className={`overflow-auto ${className}`}
    style={{ scrollbarWidth: "thin" }}
  >
    {children}
  </div>
);

const GeminiChatbot = ({ apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-01-21",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: MAX_TOKENS,
    responseMimeType: "text/plain",
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: messages.map(({ role, content }) => ({
          role: role === "user" ? "user" : "model",
          parts: [{ text: content }],
        })),
      });
      const result = await chatSession.sendMessage(message);
      const maxOutputLength = 300;

      const botMessage = {
        role: "bot",
        content: result.response.text().slice(0, maxOutputLength) + "...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!isLoading) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-full shadow-lg text-white hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed ${
            isExpanded
              ? "bottom-0 right-0 w-full h-[600px] md:w-[500px] md:h-[600px] md:bottom-4 md:right-4"
              : "bottom-16 right-4 w-[350px] h-[500px]"
          } bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-8 fade-in-0 border border-blue-200`}
        >
          <Card className="h-full border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="text-lg font-semibold text-blue-800">
                Trade Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-blue-200 rounded-md transition-colors text-blue-700"
                >
                  {isExpanded ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-200 rounded-md transition-colors text-blue-700"
                >
                  <X size={18} />
                </button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4 p-0 h-[calc(100%-4rem)] bg-gradient-to-b from-blue-50 to-white">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-blue-400 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">
                        Start a conversation about trading!
                      </p>
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      } animate-in slide-in-from-bottom-2 fade-in-0`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md"
                            : "bg-white text-gray-800 border border-blue-200 shadow-sm"
                        } ${
                          msg.role === "user"
                            ? "rounded-tr-sm"
                            : "rounded-tl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content}
                        </p>
                        <span
                          className={`text-xs mt-2 block ${
                            msg.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in-0">
                      <div className="bg-white text-gray-800 border border-blue-200 shadow-sm rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {error && (
                <div className="px-4 py-2 text-red-600 text-sm bg-red-50 mx-4 rounded border border-red-200 animate-in slide-in-from-top-2 fade-in-0">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-blue-200 bg-white">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Ask anything about trading..."
                    disabled={isLoading}
                    className="flex-1 rounded-full bg-blue-50 border-blue-200 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !inputMessage.trim()}
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GeminiChatbot;
