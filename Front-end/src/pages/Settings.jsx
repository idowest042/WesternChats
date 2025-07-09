import { THEMES } from "../constants";
import { useThemeStore } from "../Store/useThemeStore.js";
import { Send, Palette, Eye, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false, time: "12:00 PM" },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true, time: "12:02 PM" },
  { id: 3, content: "That sounds exciting! What kind of features?", isSent: false, time: "12:05 PM" },
  { id: 4, content: "A complete theme system for our chat app!", isSent: true, time: "12:06 PM" },
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("appearance");
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);

  // Apply theme change with animation
  const handleThemeChange = (newTheme) => {
    if (isAnimating) return;
    
    setSelectedTheme(newTheme);
    setIsAnimating(true);
    
    setTimeout(() => {
      setTheme(newTheme);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="btn btn-ghost btn-circle">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-200 p-1 rounded-xl mb-8">
          <button
            className={`tab flex-1 gap-2 ${activeTab === "appearance" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <Palette size={16} />
            Appearance
          </button>
          <button
            className={`tab flex-1 gap-2 ${activeTab === "preview" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {activeTab === "appearance" ? (
              <>
                {/* Theme Selection */}
                <div className="bg-base-300 rounded-2xl p-6 shadow-lg">
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Palette className="text-primary" size={20} />
                      Theme Preferences
                    </h2>
                    <p className="text-sm text-base-content/70">
                      Choose a theme that matches your style
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {THEMES.map((t) => (
                      <motion.button
                        key={t}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          group flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                          ${selectedTheme === t ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-base-200/50"}
                          ${isAnimating && selectedTheme === t ? "animate-pulse" : ""}
                        `}
                        onClick={() => handleThemeChange(t)}
                      >
                        <div className="relative h-10 w-full rounded-lg overflow-hidden" data-theme={t}>
                          <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                            <div className="rounded bg-primary"></div>
                            <div className="rounded bg-secondary"></div>
                            <div className="rounded bg-accent"></div>
                            <div className="rounded bg-neutral"></div>
                          </div>
                          {selectedTheme === t && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <Check className="text-primary" size={18} />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium truncate w-full text-center">
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Preview Prompt */}
                <div 
                  className="bg-base-300 rounded-2xl p-6 shadow-lg cursor-pointer hover:bg-base-300/80 transition-colors"
                  onClick={() => setActiveTab("preview")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Eye size={18} />
                        See Live Preview
                      </h3>
                      <p className="text-sm text-base-content/70 mt-1">
                        Preview how your selected theme looks in a chat interface
                      </p>
                    </div>
                    <button className="btn btn-ghost btn-sm">View →</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Preview Section */}
                <div className="bg-base-300 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Eye className="text-primary" size={20} />
                        Theme Preview
                      </h2>
                      <p className="text-sm text-base-content/70 mt-1">
                        Current theme: {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
                      </p>
                    </div>
                    <button 
                      className="btn btn-ghost"
                      onClick={() => setActiveTab("appearance")}
                    >
                      Change Theme
                    </button>
                  </div>

                  <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
                    <div className="p-4 bg-base-200">
                      <div className="max-w-lg mx-auto">
                        {/* Mock Chat UI */}
                        <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                          {/* Chat Header */}
                          <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                                J
                              </div>
                              <div>
                                <h3 className="font-medium text-sm">Idowu Joseph</h3>
                                <p className="text-xs text-base-content/70">Online</p>
                              </div>
                            </div>
                            <div className="badge badge-primary badge-sm">New Message</div>
                          </div>

                          {/* Chat Messages */}
                          <div className="p-4 space-y-4 min-h-[250px] max-h-[250px] overflow-y-auto bg-base-100">
                            {PREVIEW_MESSAGES.map((message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`
                                    max-w-[80%] rounded-xl p-3 shadow-sm
                                    ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                                    transition-all duration-200
                                  `}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p
                                    className={`
                                      text-[10px] mt-1.5 flex items-center gap-1
                                      ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                                    `}
                                  >
                                    {message.time}
                                    {message.isSent && <Check size={10} className="inline" />}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Chat Input */}
                          <div className="p-4 border-t border-base-300 bg-base-100">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                className="input input-bordered flex-1 text-sm h-10"
                                placeholder="Type a message..."
                                value="This is a preview of your selected theme"
                                readOnly
                              />
                              <button className="btn btn-primary h-10 min-h-0">
                                <Send size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;