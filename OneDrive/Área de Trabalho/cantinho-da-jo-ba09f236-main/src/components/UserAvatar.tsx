
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from 'framer-motion';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  showAnimation?: boolean;
  className?: string;
}

const UserAvatar = ({ 
  name, 
  imageUrl, 
  size = "md", 
  showAnimation = true,
  className = ""
}: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSize = () => {
    switch (size) {
      case "sm": return "h-8 w-8";
      case "md": return "h-12 w-12";
      case "lg": return "h-16 w-16";
      case "xl": return "h-24 w-24";
      case "xxl": return "h-32 w-32";
      default: return "h-12 w-12";
    }
  };

  const AvatarComponent = () => (
    <Avatar className={`${getSize()} border-2 border-beauty-light-purple/20 ${className}`}>
      <AvatarImage src={imageUrl} alt={name} />
      <AvatarFallback className="bg-beauty-purple text-white">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );

  return showAnimation ? (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <AvatarComponent />
    </motion.div>
  ) : <AvatarComponent />;
};

export default UserAvatar;
