import { useChatStore } from "../Store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../Store/UseAuthStore";
import { formatMessageTime, formatMessageDate } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Image as ImageIcon, Loader2, MoreVertical } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isSendingMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [scrolledUp, setScrolledUp] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = message.createdAt ? new Date(message.createdAt).toDateString() : 'Unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Auto-scroll to bottom unless user has scrolled up
  useEffect(() => {
    if (!scrolledUp && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, scrolledUp]);

  // Track scroll position
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setScrolledUp(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setScrolledUp(false);
    }
  };

  const handleMessageClick = (message, e) => {
    // Don't trigger if clicking on a link or image
    if (e.target.tagName === 'A' || e.target.tagName === 'IMG') return;
    
    setSelectedMessage(selectedMessage?._id === message._id ? null : message);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-base-200/30">
        <ChatHeader />
        <div className="flex-1 overflow-auto p-4">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-200/30">
      <ChatHeader />

      {/* Main chat area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-auto p-4 space-y-6 relative"
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="text-xs text-base-content/50 bg-base-200 px-3 py-1 rounded-full">
                {formatMessageDate(date)}
              </div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message) => (
              <motion.div
                key={message._id || message.createdAt || Math.random()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {message.senderId !== authUser._id && (
                  <div className="flex-shrink-0">
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      alt={selectedUser.fullName}
                      className="size-10 rounded-full border-2 border-base-300 object-cover"
                    />
                  </div>
                )}

                <div 
                  className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${message.senderId === authUser._id ? 'items-end' : 'items-start'}`}
                  onClick={(e) => handleMessageClick(message, e)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {message.senderId === authUser._id ? 'You' : selectedUser.fullName}
                    </span>
                    <span className="text-xs text-base-content/50">
                      {message.createdAt ? formatMessageTime(message.createdAt) : 'Just now'}
                    </span>
                  </div>

                  <div className={`relative rounded-2xl p-3 ${message.senderId === authUser._id ? 'bg-primary text-primary-content' : 'bg-base-100 border border-base-300'}`}>
                    {message.image && (
                      <div className="mb-2 relative group">
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-full rounded-lg border border-base-300 cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute bottom-2 right-2 bg-base-100/80 rounded-full p-1.5 text-base-content/70 group-hover:opacity-100 opacity-0 transition-opacity">
                          <ImageIcon size={16} />
                        </div>
                      </div>
                    )}
                    {message.text && (
                      <p className="whitespace-pre-wrap">
                        {message.text.split(' ').map((word, i) => 
                          word.startsWith('http') ? (
                            <a 
                              key={i} 
                              href={word} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {word}{' '}
                            </a>
                          ) : (
                            word + ' '
                          )
                        )}
                      </p>
                    )}

                    {selectedMessage?._id === message._id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-2 top-2 bg-black/20 rounded-full p-1 backdrop-blur-sm"
                      >
                        <MoreVertical size={16} />
                      </motion.div>
                    )}
                  </div>

                {message.senderId === authUser._id && (
  <div className="flex items-center gap-1 mt-1">
    <span className="text-xs">
      {message.status === 'read' ? (
        <CheckCheck size={14} className="text-primary" />
      ) : message.status === 'delivered' ? (
        <CheckCheck size={14} className="text-base-content/50" />
      ) : message.status === 'sent' ? (
        <Check size={14} className="text-base-content/50" />
      ) : message.status === 'sending' ? (
        <Loader2 size={14} className="text-base-content/50 animate-spin" />
      ) : null}
    </span>
  </div>
)}
                </div>
              </motion.div>
            ))}
          </div>
        ))}

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {scrolledUp && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToBottom}
              className="fixed right-8 bottom-24 bg-primary text-primary-content p-2 rounded-full shadow-lg hover:bg-primary-focus transition-colors z-10"
              aria-label="Scroll to bottom"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;