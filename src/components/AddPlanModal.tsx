
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/hooks/redux';
import { addPlan, Plan } from '@/store/slices/plansSlice';
import { toast } from '@/hooks/use-toast';
import { Plus, X } from '@mui/icons-material';

interface AddPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPlanModal: React.FC<AddPlanModalProps> = ({ open, onOpenChange }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    duration: 1,
    price: 0,
    description: '',
    features: ['']
  });

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleTypeChange = (type: 'monthly' | 'quarterly' | 'yearly') => {
    const duration = type === 'monthly' ? 1 : type === 'quarterly' ? 3 : 12;
    setFormData(prev => ({
      ...prev,
      type,
      duration
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      duration: formData.duration,
      price: formData.price,
      features: formData.features.filter(f => f.trim() !== ''),
      isActive: true,
      description: formData.description
    };

    dispatch(addPlan(newPlan));
    
    toast({
      title: 'Plan Added',
      description: `${newPlan.name} has been added successfully.`,
    });

    // Reset form
    setFormData({
      name: '',
      type: 'monthly',
      duration: 1,
      price: 0,
      description: '',
      features: ['']
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Plan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planType">Plan Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
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
              <Label htmlFor="planPrice">Price ($)</Label>
              <Input
                id="planPrice"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({...prev, price: parseFloat(e.target.value) || 0}))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planDuration">Duration (months)</Label>
              <Input
                id="planDuration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({...prev, duration: parseInt(e.target.value) || 1}))}
                required
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planDescription">Description</Label>
            <Textarea
              id="planDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Enter feature"
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddFeature}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary-glow">
              Add Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
