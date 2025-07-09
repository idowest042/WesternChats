import { X, Maximize2 } from "lucide-react";
import { useAuthStore } from "../Store/UseAuthStore";
import { useChatStore } from "../Store/useChatStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    if (selectedUser?.lastSeen) {
      setLastSeen(new Date(selectedUser.lastSeen));
    }
  }, [selectedUser]);

  if (!selectedUser) return null;

  const formatLastSeen = () => {
    if (!lastSeen) return "Recently";
    return `Last seen ${formatDistanceToNow(lastSeen)} ago at ${format(lastSeen, 'h:mm a')}`;
  };

  const formatDetailedLastSeen = () => {
    if (!lastSeen) return "Recently";
    return `${format(lastSeen, 'MMMM d, yyyy')} at ${format(lastSeen, 'h:mm a')}`;
  };

  return (
    <>
      <div className="p-3 border-b border-base-300 bg-base-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Clickable Avatar */}
            <div 
              className="relative cursor-pointer group"
              onClick={() => setShowProfilePic(true)}
            >
              <div className="size-10 rounded-full overflow-hidden border-2 border-base-300">
                <img 
                  src={selectedUser.profilePic || "/avatar.png"} 
                  alt={selectedUser.fullname} 
                  className="w-full h-full object-cover"
                />
              </div>
              {onlineUsers.includes(selectedUser._id) ? (
                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-base-100"></div>
              ) : (
                <div className="absolute bottom-0 right-0 size-3 bg-gray-400 rounded-full border-2 border-base-100"></div>
              )}
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">
                {selectedUser.fullname}
              </h3>
              <p className="text-sm text-base-content/70 flex items-center gap-1">
                {onlineUsers.includes(selectedUser._id) ? (
                  <>
                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Online now</span>
                  </>
                ) : (
                  <span>{formatLastSeen()}</span>
                )}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="p-1.5 rounded-full hover:bg-base-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Profile Picture Modal */}
      <AnimatePresence>
        {showProfilePic && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-base-100 rounded-lg max-w-md w-full p-6"
            >
              <button
                onClick={() => setShowProfilePic(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-base-200 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center gap-4">
                <div className="size-40 rounded-full overflow-hidden border-4 border-base-200">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt={selectedUser.fullname}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{selectedUser.fullName}</h3>
                  <p className="text-base-content/70 mt-2">
                    {onlineUsers.includes(selectedUser._id) ? (
                      <span className="text-green-500 flex items-center justify-center gap-2">
                        <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online now
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        <span>Last active:</span>
                        <span className="font-medium">
                          {formatDetailedLastSeen()}
                        </span>
                      </div>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatHeader;