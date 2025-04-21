
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserProfileDialog from './UserProfileDialog';

interface UserProfileLinkProps {
  userId: string;
  userName: string;
}

const UserProfileLink = ({ userId, userName }: UserProfileLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleOpenProfile = () => {
    // Buscar usuário pelo ID ou email do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === userId || u.email === userId);
    
    if (user) {
      setUserData(user);
      setIsOpen(true);
    } else {
      // Caso não encontre o usuário, cria um objeto simples apenas com o nome
      setUserData({
        id: userId,
        name: userName,
        email: userId
      });
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button 
        variant="link" 
        className="p-0 h-auto font-normal flex items-center gap-1"
        onClick={handleOpenProfile}
      >
        <User className="h-3 w-3" />
        <span>{userName}</span>
      </Button>
      
      <UserProfileDialog 
        user={userData} 
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default UserProfileLink;
