import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Save, PersonAdd } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addMember } from '@/store/slices/membersSlice';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.string().transform(val => parseInt(val)).refine(val => val >= 16 && val <= 100, 'Age must be between 16 and 100'),
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactRelationship: z.string().min(2, 'Relationship is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  planType: z.enum(['monthly', 'quarterly', 'yearly']),
  notes: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

export const AddMember: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const plans = useAppSelector((state) => state.plans.plans);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  const selectedPlanType = watch('planType');
  const selectedPlan = plans.find(p => p.type === selectedPlanType);

  const onSubmit = async (data: MemberFormData) => {
    try {
      const plan = plans.find(p => p.type === data.planType);
      if (!plan) {
        toast({
          title: 'Error',
          description: 'Selected plan not found',
          variant: 'destructive',
        });
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration);

      const newMember = {
        id: `member-${Date.now()}`,
        name: data.name,
        age: data.age,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship,
        },
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        plan: {
          type: data.planType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          price: plan.price,
        },
        joiningDate: startDate.toISOString(),
        status: 'active' as const,
        notes: data.notes,
      };

      dispatch(addMember(newMember));

      toast({
        title: 'Success!',
        description: `${data.name} has been successfully added as a member.`,
      });

      navigate('/members');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add member. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fitness-card p-6 text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center neon-glow">
            <PersonAdd className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Add New Member</h1>
        </div>
        <p className="text-muted-foreground">
          Fill in the details below to register a new gym member
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fitness-card p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-2 h-2 bg-neon-green rounded-full mr-3"></span>
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={cn(errors.name && 'border-destructive')}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground font-medium">Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age')}
                  className={cn(errors.age && 'border-destructive')}
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground font-medium">Gender</Label>
                <Select onValueChange={(value) => setValue('gender', value as any)}>
                  <SelectTrigger className={cn(errors.gender && 'border-destructive')}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={cn(errors.email && 'border-destructive')}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  className={cn(errors.phone && 'border-destructive')}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-2 h-2 bg-neon-orange rounded-full mr-3"></span>
              Emergency Contact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-foreground font-medium">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  {...register('emergencyContactName')}
                  className={cn(errors.emergencyContactName && 'border-destructive')}
                  placeholder="Enter contact name"
                />
                {errors.emergencyContactName && (
                  <p className="text-sm text-destructive">{errors.emergencyContactName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone" className="text-foreground font-medium">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  {...register('emergencyContactPhone')}
                  className={cn(errors.emergencyContactPhone && 'border-destructive')}
                  placeholder="Enter contact phone"
                />
                {errors.emergencyContactPhone && (
                  <p className="text-sm text-destructive">{errors.emergencyContactPhone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship" className="text-foreground font-medium">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  {...register('emergencyContactRelationship')}
                  className={cn(errors.emergencyContactRelationship && 'border-destructive')}
                  placeholder="e.g., Spouse, Parent"
                />
                {errors.emergencyContactRelationship && (
                  <p className="text-sm text-destructive">{errors.emergencyContactRelationship.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-2 h-2 bg-neon-red rounded-full mr-3"></span>
              Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street" className="text-foreground font-medium">Street Address</Label>
                <Input
                  id="street"
                  {...register('street')}
                  className={cn(errors.street && 'border-destructive')}
                  placeholder="Enter street address"
                />
                {errors.street && (
                  <p className="text-sm text-destructive">{errors.street.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground font-medium">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  className={cn(errors.city && 'border-destructive')}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-foreground font-medium">State</Label>
                <Input
                  id="state"
                  {...register('state')}
                  className={cn(errors.state && 'border-destructive')}
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-foreground font-medium">ZIP Code</Label>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  className={cn(errors.zipCode && 'border-destructive')}
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && (
                  <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-2 h-2 bg-neon-green rounded-full mr-3"></span>
              Membership Plan
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planType" className="text-foreground font-medium">Select Plan</Label>
                <Select onValueChange={(value) => setValue('planType', value as any)}>
                  <SelectTrigger className={cn(errors.planType && 'border-destructive')}>
                    <SelectValue placeholder="Choose a membership plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.filter(p => p.isActive).map((plan) => (
                      <SelectItem key={plan.id} value={plan.type}>
                        {plan.name} - ${plan.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.planType && (
                  <p className="text-sm text-destructive">{errors.planType.message}</p>
                )}
              </div>

              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <h4 className="font-semibold text-foreground mb-2">{selectedPlan.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{selectedPlan.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <span className="ml-2 font-semibold text-neon-green">${selectedPlan.price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-2 font-semibold text-foreground">{selectedPlan.duration} months</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Features:</span>
                    <ul className="mt-1 space-y-1">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-foreground flex items-center">
                          <span className="w-1 h-1 bg-neon-green rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Additional Notes
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground font-medium">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional information about the member..."
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/members')}
              className="px-6"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-glow px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Adding Member...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};