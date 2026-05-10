import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Send, Loader, X, Maximize2, Minimize2 } from "lucide-react";
import { MdLocalHospital } from "react-icons/md";

const GeminiChatbot = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const ai = new GoogleGenerativeAI(apiKey);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Add placeholder for bot response
    const botMessagePlaceholder = {
      role: "bot",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessagePlaceholder]);
    
    let botText = "";

    try {
      // Prepare history
      const history = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const result = await ai.getGenerativeModel({ 
        model: "gemini-3-flash-preview" 
      }).generateContentStream({
        contents: [
          ...history,
          {
            role: "user",
            parts: [{ text: `You are the MHope Medical Assistant. Be helpful, professional, and empathetic. Provide concise health-related information but always include a disclaimer to consult a professional for serious concerns. Answer this: ${message}\n\nPlease summarize in 3-4 lines maximum.` }],
          },
        ],
      });

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          botText += chunkText;
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex].role === "bot") {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: botText
              };
            }
            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // Remove placeholder if failed
      setMessages((prev) => {
         const last = prev[prev.length - 1];
         if (last.role === "bot" && last.content === "") {
             return prev.slice(0, -1);
         }
         return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 rounded-full shadow-lg text-white hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-white/20"
        >
          <MdLocalHospital className="w-7 h-7" />
        </motion.button>
      )}

      {isOpen && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          className={`fixed ${
            isExpanded
              ? "bottom-0 right-0 w-full h-[600px] md:w-[500px] md:h-[600px] md:bottom-4 md:right-4"
              : "bottom-16 right-4 w-[350px] h-[500px]"
          } bg-white shadow-2xl rounded-2xl border border-blue-100 overflow-hidden flex flex-col transition-all duration-300`}
        >
          <Card className="h-full border-0 bg-transparent flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-sky-600 border-b border-blue-200 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <MdLocalHospital className="text-white text-xl" />
                </div>
                <CardTitle className="text-lg font-bold text-white tracking-tight">
                  MHope Assistant
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                  {isExpanded ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-0 p-0 overflow-hidden bg-slate-50">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8 px-4">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdLocalHospital className="text-blue-600 text-3xl" />
                      </div>
                      <h3 className="text-gray-800 font-semibold mb-1">Welcome to MHope!</h3>
                      <p className="text-gray-500 text-sm">How can I assist you with your health today?</p>
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 border border-blue-100"
                        } ${
                          msg.role === "user"
                            ? "rounded-tr-sm"
                            : "rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content === "" && msg.role === "bot" ? (
                            <div className="flex gap-1 h-6 items-center px-1">
                              <motion.div
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                              />
                              <motion.div
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                              />
                              <motion.div
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                              />
                            </div>
                          ) : (
                            msg.content
                          )}
                        </p>
                        <span className={`text-[10px] mt-1 block w-full text-right ${
                          msg.role === "user" ? "text-blue-100" : "text-gray-400"
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {error && (
                <div className="px-4 py-2 text-red-600 text-xs bg-red-50 mx-4 mb-2 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="p-4 bg-white border-t border-blue-50">
                <form
                  onSubmit={handleSubmit}
                  className="flex gap-2"
                >
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about appointments, reports..."
                      disabled={isLoading}
                      className="w-full rounded-full bg-slate-50 border-blue-100 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400 pr-10"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95"
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </Button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                  Powered by MHope Health AI
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default GeminiChatbot;
