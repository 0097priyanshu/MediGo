import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Search,
  Clock,
  MapPin,
  Pill,
  Heart,
  Headphones,
  ShoppingCart,
  Send,
  X,
  MessageSquare,
  Bot,
  Loader2
} from "lucide-react";

/**
 * Premium instant-commerce landing page (inspired by Blinkit & Flipkart Minutes).
 * Features quick-commerce category shortcuts and a floating Gemini AI symptom checker.
 */
const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI Chatbot state
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your MediGo AI Assistant. Ask me about medicine usages, symptom suggestions, or delivery questions."
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showChat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/pharmacies");
    }
  };

  const handleSendChatMessage = async (textToSend) => {
    const msg = textToSend || chatInput;
    if (!msg.trim()) return;

    // Append user message
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    if (!textToSend) setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        throw new Error(data.error || "Chat failed");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I am having trouble connecting right now. Please try again." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const chatChips = [
    "Acidity help",
    "Fever medicines",
    "How to track order?",
    "Volini spray price"
  ];

  const categories = [
    { name: "Cough & Fever", icon: Pill, color: "bg-blue-50 text-blue-700 border-blue-100" },
    { name: "Pain Relief", icon: Heart, color: "bg-red-50 text-red-700 border-red-100" },
    { name: "Stomach Care", icon: Sparkles, color: "bg-green-50 text-green-700 border-green-100" },
    { name: "Wellness & Vitamins", icon: Heart, color: "bg-purple-50 text-purple-700 border-purple-100" },
    { name: "First Aid & Care", icon: Headphones, color: "bg-amber-50 text-amber-700 border-amber-100" }
  ];

  return (
    <Layout>
      <div className="bg-slate-50 min-h-[calc(100vh-140px)] pb-12">
        {/* Blinkit Promo Top Bar */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-400 py-2.5 px-4 text-center text-xs font-black text-slate-800 tracking-wide uppercase flex justify-center items-center gap-2">
          <Clock className="h-4 w-4 animate-bounce" />
          Flat 15% discount on first health order • Delivery in 9 Mins!
        </div>

        {/* Hero Section */}
        <div className="bg-teal-800 text-white py-16 px-4 relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-700 rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-700 rounded-full filter blur-3xl opacity-20 -ml-20 -mb-20" />

          <div className="container mx-auto max-w-4xl text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-1 bg-teal-700/60 border border-teal-600 px-3.5 py-1 rounded-full text-xs font-semibold text-cyan-200">
              <MapPin className="h-3.5 w-3.5" />
              Noida Sector 62
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              Medicines & Essentials <br />
              <span className="text-yellow-400">Delivered in 9 Minutes</span>
            </h1>
            <p className="text-sm sm:text-base text-teal-100 max-w-xl mx-auto">
              Get rapid 10-minute medicine drops from authorized local drug stores and pharmacies near you.
            </p>

            {/* Instant Search input */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-4">
              <Search className="absolute left-4 top-7 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search 'paracetamol 650mg', 'eno' or 'volini'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-28 text-slate-900 shadow-lg outline-none text-sm placeholder:text-slate-400 focus:ring-4 focus:ring-teal-300"
              />
              <Button
                type="submit"
                className="absolute right-2 top-5.5 bg-teal-750 hover:bg-teal-800 text-white rounded-xl px-5 text-xs font-bold uppercase tracking-wider py-2"
              >
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Quick Categories shortcut grid */}
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Shop by Category</h2>
            <Link to="/pharmacies" className="text-xs font-bold text-teal-700 hover:underline flex items-center">
              View All Pharmacies <Clock className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to="/pharmacies"
                  className="group"
                >
                  <Card className="border-slate-150 bg-white hover:border-teal-400 hover:shadow transition-all duration-300 overflow-hidden h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-bold text-slate-700 text-xs sm:text-sm block leading-tight">
                        {cat.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Why MediGo Quick-commerce */}
        <div className="bg-white border-y py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-teal-50 text-teal-750 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">9-Min Drops</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ultra-fast dispatch coordinates that assign dispatches to local riders instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-teal-50 text-teal-750 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100">
                  <Pill className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">100% Genuine</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Medicines sourced directly from licensed pharmacies with verified drug codes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-teal-50 text-teal-750 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">AI Medical Guide</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Instantly clarify symptoms and usage constraints using our Gemini AI chatbot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING GEMINI AI CHAT DIALOG */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Window Panel */}
        {showChat && (
          <Card className="w-80 sm:w-96 h-[480px] border-teal-100 shadow-2xl bg-white rounded-2xl mb-4 overflow-hidden flex flex-col justify-between animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-700 to-cyan-700 px-4 py-3 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/20">
                  <Bot className="h-4.5 w-4.5 text-cyan-100" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">MediGo Assistant</h3>
                  <span className="text-[10px] text-cyan-200">Gemini Powered</span>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 rounded-full hover:bg-white/10 text-cyan-200 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-teal-700 text-white rounded-br-none"
                        : "bg-white text-slate-800 border rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-2 text-xs text-slate-500 shadow-sm flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-700" />
                    AI is writing...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Chips Selection */}
            <div className="bg-white border-t p-2 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {chatChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChatMessage(chip)}
                    className="bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 px-2.5 py-1 rounded-lg hover:border-teal-500 hover:text-teal-750 transition-all shrink-0 whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Footer */}
            <div className="bg-white border-t p-3 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Ask about symptoms, medicines..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !chatLoading) handleSendChatMessage();
                }}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-700"
                disabled={chatLoading}
              />
              <Button
                onClick={() => handleSendChatMessage()}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-teal-700 hover:bg-teal-800 text-white rounded-xl p-2.5 h-9 shrink-0 flex justify-center items-center shadow"
              >
                <Send className="h-4.5 w-4.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* Pulsing Toggle Floating Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 bg-gradient-to-r from-teal-750 to-cyan-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/80 animate-pulse relative"
          title="AI health assistant"
        >
          {showChat ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          {/* Glowing Gemini sparkle indicator */}
          <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 rounded-full p-1 border border-white text-slate-800 animate-bounce">
            <Sparkles className="h-3 w-3 fill-current" />
          </span>
        </button>
      </div>
    </Layout>
  );
};

export default Home;
export { Home };
