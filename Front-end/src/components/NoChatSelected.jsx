import { MessageSquare, Search, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useChatStore } from "../Store/useChatStore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../Store/UseAuthStore";

const NoChatSelected = () => {
  const { users, getUsers, setSelectedUser, createGroup, groups } = useChatStore();
  const { authUser } = useAuthStore();
  const [showUserList, setShowUserList] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [activeTab, setActiveTab] = useState("findPeople"); // 'findPeople' or 'createGroup'

  useEffect(() => {
    if (showUserList && users.length === 0) {
      getUsers();
    }
  }, [showUserList]);

  const handleFindPeople = async () => {
    try {
      await getUsers();
      setShowUserList(true);
      setActiveTab("findPeople");
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleInitiateGroup = () => {
    setShowUserList(true);
    setActiveTab("createGroup");
    setSelectedUsers([]);
    setGroupName("");
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      toast.error("Please enter a group name");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error("Please select at least 2 members");
      return;
    }

    setIsCreatingGroup(true);
    try {
      await createGroup({
        name: groupName,
        members: selectedUsers
      });
      toast.success(`Group "${groupName}" created successfully!`);
      setGroupName("");
      setSelectedUsers([]);
      setShowUserList(false);
    } catch (error) {
      toast.error("Failed to create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user => user._id !== authUser._id);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-base-100/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Animated Icon */}
        <motion.div 
          className="flex justify-center"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 bg-secondary text-white rounded-full p-1"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Plus size={16} />
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Welcome to Western Chats!
          </h2>
          <p className="text-base-content/70 text-lg">
            Start connecting with your team
          </p>
        </div>

        {/* Action Suggestions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <motion.button 
            whileHover={{ y: -4 }}
            className="p-4 bg-base-200 rounded-lg flex flex-col items-center gap-2 cursor-pointer"
            onClick={handleFindPeople}
          >
            <div className="p-3 bg-primary/10 rounded-full">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <span>Find people</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ y: -4 }}
            className="p-4 bg-base-200 rounded-lg flex flex-col items-center gap-2 cursor-pointer"
            onClick={handleInitiateGroup}
          >
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span>Create group</span>
          </motion.button>
        </div>

        {/* User List Modal */}
        {showUserList && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-base-100 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {activeTab === "createGroup" ? "Create New Group" : "Find People"}
                </h3>
                <button 
                  onClick={() => setShowUserList(false)}
                  className="text-base-content/50 hover:text-base-content"
                >
                  ✕
                </button>
              </div>

              {activeTab === "createGroup" && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="input input-bordered w-full mb-4"
                  />
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedUsers.map(userId => {
                        const user = users.find(u => u._id === userId);
                        return user ? (
                          <div key={userId} className="badge badge-primary gap-2">
                            {user.fullname}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUserSelection(userId);
                              }}
                              className="text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div 
                      key={user._id} 
                      className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${
                        selectedUsers.includes(user._id) 
                          ? "bg-primary/10 border border-primary/20" 
                          : "hover:bg-base-200"
                      }`}
                      onClick={() => {
                        if (activeTab === "createGroup") {
                          toggleUserSelection(user._id);
                        } else {
                          setSelectedUser(user);
                          setShowUserList(false);
                        }
                      }}
                    >
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={user.profilePic || "/avatar.png"} alt={user.fullname} />
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{user.fullname}</p>
                        <p className="text-sm text-base-content/60">
                          {user.email}
                        </p>
                      </div>
                      {activeTab === "createGroup" && selectedUsers.includes(user._id) && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-base-content/50">
                    No users found
                  </div>
                )}
              </div>

              {activeTab === "createGroup" && (
                <button
                  onClick={handleCreateGroup}
                  disabled={isCreatingGroup}
                  className="btn btn-primary w-full mt-4"
                >
                  {isCreatingGroup ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    `Create Group ${selectedUsers.length > 0 ? `(${selectedUsers.length + 1} members)` : ''}`
                  )}
                </button>
              )}
            </motion.div>
          </div>
        )}

        {/* Subtle Animation */}
        <motion.div 
          className="mt-8 text-sm text-base-content/40"
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        >
          Select a conversation or start a new one
          <h2 className="text-2xl text-primary">V2</h2>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;