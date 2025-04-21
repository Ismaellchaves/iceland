
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import UserProfileLink from './UserProfileLink';
import MessageDialog from './MessageDialog';

interface UserListDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserListDialog = ({ open, onClose }: UserListDialogProps) => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  React.useEffect(() => {
    if (open) {
      // Carregar usuários do localStorage quando o diálogo for aberto
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        // Filtra apenas usuários que não são administradores
        const citizenUsers = parsedUsers.filter((user: any) => !user.isAdmin);
        setUsers(citizenUsers);
      }
    }
  }, [open]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Cidadãos Ativos
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <UserProfileLink userId={user.id} userName={user.name} />
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.city || 'Não informado'}</TableCell>
                      <TableCell>{user.state || 'Não informado'}</TableCell>
                      <TableCell>{user.createdAt ? formatDate(user.createdAt) : 'Não informado'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Nenhum cidadão cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      
      {selectedUser && (
        <MessageDialog
          open={messageDialogOpen}
          onClose={() => setMessageDialogOpen(false)}
          recipientId={selectedUser.id}
          recipientName={selectedUser.name}
        />
      )}
    </>
  );
};

export default UserListDialog;
