import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Save, ArrowBack } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { updateMember } from '@/store/slices/membersSlice';
import { toast } from '@/hooks/use-toast';
import { Member } from '@/store/slices/membersSlice';

export const EditMember: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const member = useAppSelector((state) => 
    state.members.members.find(m => m.id === id)
  );

  const [formData, setFormData] = React.useState<Member | null>(null);

  React.useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      navigate('/members');
    }
  }, [member, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    dispatch(updateMember(formData));
    toast({
      title: 'Member Updated',
      description: `${formData.name}'s information has been updated successfully.`,
    });
    navigate('/members');
  };

  const updateFormData = (updates: Partial<Member>) => {
    if (formData) {
      setFormData({ ...formData, ...updates });
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fitness-card p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center neon-glow">
              <Edit className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Member</h1>
              <p className="text-muted-foreground">
                Update {formData.name}'s information
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/members')}
            variant="outline"
          >
            <ArrowBack className="w-4 h-4 mr-2" />
            Back to Members
          </Button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="fitness-card p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-green rounded-full mr-3"></span>
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-foreground font-medium">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => updateFormData({ age: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-foreground font-medium">Gender</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => updateFormData({ gender: value as 'male' | 'female' | 'other' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Plan Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fitness-card p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-orange rounded-full mr-3"></span>
            Membership Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="planType" className="text-foreground font-medium">Plan Type</Label>
              <Select 
                value={formData.plan.type} 
                onValueChange={(value) => updateFormData({ 
                  plan: { ...formData.plan, type: value as 'monthly' | 'quarterly' | 'yearly' }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground font-medium">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.plan.price}
                onChange={(e) => updateFormData({ 
                  plan: { ...formData.plan, price: parseFloat(e.target.value) }
                })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground font-medium">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.plan.startDate}
                onChange={(e) => updateFormData({ 
                  plan: { ...formData.plan, startDate: e.target.value }
                })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-foreground font-medium">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.plan.endDate}
                onChange={(e) => updateFormData({ 
                  plan: { ...formData.plan, endDate: e.target.value }
                })}
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fitness-card p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-red rounded-full mr-3"></span>
            Additional Notes
          </h2>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground font-medium">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              rows={4}
              placeholder="Add any additional notes about this member..."
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end space-x-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/members')}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            className="btn-primary-glow px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Update Member
          </Button>
        </motion.div>
      </form>
    </div>
  );
};