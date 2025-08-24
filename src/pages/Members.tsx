import React from 'react';
import { motion } from 'framer-motion';
import { 
  People,
  Search,
  FilterList,
  Edit,
  Delete,
  Visibility,
  PersonAdd
} from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setSearchTerm, setFilterStatus, deleteMember } from '@/store/slices/membersSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const Members: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { members, searchTerm, filterStatus } = useAppSelector((state) => state.members);

  // Filter and search members
  const filteredMembers = React.useMemo(() => {
    let filtered = members;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      );
    }

    return filtered;
  }, [members, searchTerm, filterStatus]);

  const handleDelete = (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to delete ${memberName}?`)) {
      dispatch(deleteMember(memberId));
      toast({
        title: 'Member Deleted',
        description: `${memberName} has been removed from the system.`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-neon-green border-green-500/30';
      case 'expiring-soon':
        return 'bg-orange-500/20 text-neon-orange border-orange-500/30';
      case 'expired':
        return 'bg-red-500/20 text-neon-red border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fitness-card p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center neon-glow">
              <People className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Members</h1>
              <p className="text-muted-foreground">
                Manage your gym members ({filteredMembers.length} of {members.length})
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/add-member')}
            className="btn-primary-glow"
          >
            <PersonAdd className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="fitness-card p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search members by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <FilterList className="text-muted-foreground w-4 h-4" />
            <Select
              value={filterStatus}
              onValueChange={(value) => dispatch(setFilterStatus(value as any))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="fitness-card p-6 group hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Member Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center neon-glow">
                    <span className="text-primary-foreground font-bold text-lg">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium border',
                  getStatusColor(member.status)
                )}>
                  {member.status.replace('-', ' ')}
                </div>
              </div>

              {/* Member Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="text-foreground">{member.phone}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="text-foreground font-medium">
                    {member.plan.type.charAt(0).toUpperCase() + member.plan.type.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="text-foreground">
                    {new Date(member.joiningDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className={cn(
                    'font-medium',
                    member.status === 'expired' ? 'text-neon-red' :
                    member.status === 'expiring-soon' ? 'text-neon-orange' :
                    'text-neon-green'
                  )}>
                    {new Date(member.plan.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-muted"
                    title="View Details"
                  >
                    <Visibility className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-muted"
                    title="Edit Member"
                    onClick={() => navigate(`/members/edit/${member.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-destructive/20 hover:text-destructive"
                    title="Delete Member"
                    onClick={() => handleDelete(member.id, member.name)}
                  >
                    <Delete className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-neon-green">
                    ${member.plan.price}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.plan.type}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fitness-card p-12 text-center"
        >
          <People className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {members.length === 0 ? 'No members yet' : 'No members found'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {members.length === 0 
              ? 'Start building your gym community by adding your first member!'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {members.length === 0 && (
            <Button
              onClick={() => navigate('/add-member')}
              className="btn-primary-glow"
            >
              <PersonAdd className="w-4 h-4 mr-2" />
              Add Your First Member
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};