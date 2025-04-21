
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import UserAvatar from './UserAvatar';
import { FileIcon, ImageIcon, VideoIcon, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  timestamp: Date;
  isAdmin?: boolean;
  status?: 'confirmed' | 'rescheduled' | 'pending';
  fileMetadata?: {
    name: string;
    type: 'image' | 'video' | 'file';
    url: string;
    size: number;
  };
}

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  index: number;
}

const ChatMessage = ({ message, isCurrentUser, index }: ChatMessageProps) => {
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
        <div className="flex-shrink-0">
          <UserAvatar
            name={message.senderName}
            imageUrl={message.senderImage}
            size="sm"
            showAnimation={false}
          />
        </div>
        
        <div className={`rounded-2xl px-4 py-3 ${
          isCurrentUser 
            ? 'bg-beauty-purple text-white rounded-br-none' 
            : 'bg-white shadow-sm border border-gray-100 rounded-bl-none dark:bg-gray-800 dark:border-gray-700 dark:text-white'
        }`}>
          {/* Display file content if exists */}
          {message.fileMetadata && (
            <div className="mb-2 max-w-xs">
              {message.fileMetadata.type === 'image' && (
                <div 
                  className="mb-2 cursor-pointer"
                  onClick={() => setMediaOpen(true)}
                >
                  <img 
                    src={message.fileMetadata.url} 
                    alt="Image" 
                    className="w-full h-auto rounded-lg max-h-[200px] object-cover" 
                  />
                </div>
              )}
              
              {message.fileMetadata.type === 'video' && (
                <div 
                  className="mb-2 cursor-pointer"
                  onClick={() => setMediaOpen(true)}
                >
                  <video 
                    src={message.fileMetadata.url} 
                    controls 
                    className="w-full h-auto rounded-lg max-h-[200px]"
                  />
                </div>
              )}
              
              {message.fileMetadata.type !== 'image' && message.fileMetadata.type !== 'video' && (
                <div className={`flex items-center gap-2 p-2 rounded-lg ${isCurrentUser ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <FileIcon className="h-10 w-10" />
                </div>
              )}
            </div>
          )}
          
          {/* Media Dialog for full screen view */}
          <Dialog open={mediaOpen} onOpenChange={setMediaOpen}>
            <DialogContent className="max-w-[90vw] p-0 bg-transparent border-none">
              <DialogClose className="absolute right-2 top-2 rounded-full p-2 bg-black/60 text-white z-10">
                <X className="h-5 w-5" />
              </DialogClose>
              {message.fileMetadata?.type === 'image' && (
                <img 
                  src={message.fileMetadata.url} 
                  alt="Image" 
                  className="w-full h-auto max-h-[90vh] object-contain" 
                />
              )}
              {message.fileMetadata?.type === 'video' && (
                <video 
                  src={message.fileMetadata.url} 
                  controls 
                  className="w-full h-auto max-h-[90vh]"
                  autoPlay
                />
              )}
            </DialogContent>
          </Dialog>
          
          <p className="text-sm">{message.content}</p>
          
          {message.status && (
            <div className={`mt-1 text-xs ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
              Status: <span className={`font-semibold ${
                message.status === 'confirmed' ? 'text-green-500' : 
                message.status === 'rescheduled' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {message.status === 'confirmed' ? 'Confirmado' : 
                 message.status === 'rescheduled' ? 'Remarcado' : 'Pendente'}
              </span>
            </div>
          )}
          
          <div className={`mt-1 text-xs ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
            {format(message.timestamp, 'HH:mm')}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;