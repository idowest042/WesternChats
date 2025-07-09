import { useAuthStore } from "../Store/UseAuthStore";
import { useState, useRef, useEffect } from "react";
import { Camera, Mail, User, Loader2, Calendar, CheckCircle, Edit } from "lucide-react";
import { motion } from "framer-motion";
import Tooltip from "../components/Tooltip"; // Assuming Tooltip is in components folder

const Profile = () => {
    const { authUser, isUpdatingProfile, updateprofile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const fileInputRef = useRef(null);
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (authUser?.fullname) {
            setTempName(authUser.fullname);
        }
    }, [authUser?.fullname]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();

        reader.onloadstart = () => {
            // Could show a loading state here if needed
        };

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateprofile({ profilePic: base64Image });
        };

        reader.onerror = () => {
            alert('Error reading file. Please try again.');
        };

        reader.readAsDataURL(file);
    };

    const handleNameUpdate = async () => {
        if (tempName.trim() && tempName !== authUser.fullname) {
            await updateProfile({ fullname: tempName });
        }
        setIsEditingName(false);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 pt-20 pb-10 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
            >
                {/* Profile Header */}
                <div className="bg-base-300 rounded-2xl p-6 shadow-lg mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                    <p className="mt-2 text-base-content/80">
                        Manage your personal information and account details
                    </p>
                </div>

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4 mb-10">
                    <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="relative group"
                    >
                        <div className="relative">
                            <img
                                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                                alt="Profile"
                                className="size-36 rounded-full object-cover border-4 border-primary/20 shadow-lg group-hover:border-primary/40 transition-all duration-300"
                            />
                            <button
                                onClick={triggerFileInput}
                                disabled={isUpdatingProfile}
                                className={`
                                    absolute bottom-2 right-2 
                                    bg-primary hover:bg-primary-focus
                                    p-2.5 rounded-full cursor-pointer 
                                    transition-all duration-200 shadow-md
                                    flex items-center justify-center
                                    ${isUpdatingProfile ? "opacity-70 pointer-events-none" : ""}
                                `}
                                aria-label="Change profile picture"
                            >
                                {isUpdatingProfile ? (
                                    <Loader2 className="w-5 h-5 text-base-100 animate-spin" />
                                ) : (
                                    <Camera className="w-5 h-5 text-base-100" />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile}
                            />
                        </div>
                    </motion.div>
                    <p className="text-sm text-base-content/60">
                        {isUpdatingProfile ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading your photo...
                            </span>
                        ) : (
                            "Click the camera icon to update your photo"
                        )}
                    </p>
                </div>

                {/* Personal Information Section */}
                <div className="space-y-6 mb-10">
                    <div className="bg-base-300 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Personal Information
                        </h2>

                        <div className="space-y-5">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-sm text-base-content/70 flex items-center gap-2">
                                    Full Name
                                </label>
                                {isEditingName ? (
                                    <div className="flex gap-2">
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="flex-1 px-4 py-2.5 bg-base-200 rounded-lg border border-base-content/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleNameUpdate}
                                            className="btn btn-primary btn-square"
                                            disabled={isUpdatingProfile}
                                        >
                                            {isUpdatingProfile ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingName(false);
                                                setTempName(authUser.fullname);
                                            }}
                                            className="btn btn-ghost btn-square"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-base-200 rounded-lg border border-base-content/10 group">
                                        <p>{authUser?.fullname}</p>
                                        <Tooltip content="Edit name">
                                            <button
                                                onClick={() => {
                                                    setIsEditingName(true);
                                                    setTimeout(() => nameInputRef.current?.focus(), 0);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-base-content/50 hover:text-primary transition-opacity duration-200 p-1"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm text-base-content/70 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </label>
                                <div className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-content/10">
                                    <p>{authUser?.email}</p>
                                </div>
                                <p className="text-xs text-base-content/50">
                                    Contact support to update your email address
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information Section */}
                <div className="bg-base-300 rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Account Information
                    </h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between py-3 border-b border-base-content/10">
                            <span className="flex items-center gap-2 text-base-content/70">
                                <Calendar className="w-4 h-4" />
                                Member Since
                            </span>
                            <span className="font-medium">
                                {new Date(authUser?.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-base-content/70">Account Status</span>
                            <span className="badge badge-success gap-2">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Additional Actions */}
                <div className="mt-8 flex justify-end gap-4">
                    <button className="btn btn-ghost">Need Help?</button>
                    <button className="btn btn-outline btn-primary">View Activity</button>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;