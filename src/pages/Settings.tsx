import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Save,
  Refresh,
  Download,
  Upload,
  Delete
} from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { toast } from '@/hooks/use-toast';

export const Settings: React.FC = () => {
  const members = useAppSelector((state) => state.members.members);
  const plans = useAppSelector((state) => state.plans.plans);

  const [gymSettings, setGymSettings] = React.useState({
    gymName: 'FitGym Pro',
    address: '123 Fitness Street, Workout City',
    phone: '+1 (555) 123-4567',
    email: 'info@fitgympro.com',
    website: 'www.fitgympro.com',
    description: 'Premium fitness center dedicated to helping you achieve your health and wellness goals.',
    notifications: {
      emailReminders: true,
      smsReminders: false,
      membershipExpiry: true,
      paymentDue: true,
    },
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: 'Settings Saved',
      description: 'Your gym settings have been updated successfully.',
    });
  };

  const handleExportData = () => {
    const data = {
      members,
      plans,
      settings: gymSettings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitgym-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data Exported',
      description: 'Your gym data has been exported successfully.',
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fitness-card p-6"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center neon-glow">
            <SettingsIcon className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Configure your gym management preferences
            </p>
          </div>
        </div>
      </motion.div>

      {/* Gym Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="fitness-card p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
          <span className="w-2 h-2 bg-neon-green rounded-full mr-3"></span>
          Gym Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="gymName" className="text-foreground font-medium">Gym Name</Label>
            <Input
              id="gymName"
              value={gymSettings.gymName}
              onChange={(e) => setGymSettings({...gymSettings, gymName: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium">Phone</Label>
            <Input
              id="phone"
              value={gymSettings.phone}
              onChange={(e) => setGymSettings({...gymSettings, phone: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={gymSettings.email}
              onChange={(e) => setGymSettings({...gymSettings, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-foreground font-medium">Website</Label>
            <Input
              id="website"
              value={gymSettings.website}
              onChange={(e) => setGymSettings({...gymSettings, website: e.target.value})}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="text-foreground font-medium">Address</Label>
            <Input
              id="address"
              value={gymSettings.address}
              onChange={(e) => setGymSettings({...gymSettings, address: e.target.value})}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
            <Textarea
              id="description"
              value={gymSettings.description}
              onChange={(e) => setGymSettings({...gymSettings, description: e.target.value})}
              rows={3}
            />
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fitness-card p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
          <span className="w-2 h-2 bg-neon-orange rounded-full mr-3"></span>
          Notification Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">Email Reminders</h4>
              <p className="text-sm text-muted-foreground">Send email notifications to members</p>
            </div>
            <Switch
              checked={gymSettings.notifications.emailReminders}
              onCheckedChange={(checked) => 
                setGymSettings({
                  ...gymSettings,
                  notifications: { ...gymSettings.notifications, emailReminders: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">SMS Reminders</h4>
              <p className="text-sm text-muted-foreground">Send SMS notifications to members</p>
            </div>
            <Switch
              checked={gymSettings.notifications.smsReminders}
              onCheckedChange={(checked) => 
                setGymSettings({
                  ...gymSettings,
                  notifications: { ...gymSettings.notifications, smsReminders: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">Membership Expiry Alerts</h4>
              <p className="text-sm text-muted-foreground">Alert when memberships are expiring</p>
            </div>
            <Switch
              checked={gymSettings.notifications.membershipExpiry}
              onCheckedChange={(checked) => 
                setGymSettings({
                  ...gymSettings,
                  notifications: { ...gymSettings.notifications, membershipExpiry: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">Payment Due Notifications</h4>
              <p className="text-sm text-muted-foreground">Notify when payments are due</p>
            </div>
            <Switch
              checked={gymSettings.notifications.paymentDue}
              onCheckedChange={(checked) => 
                setGymSettings({
                  ...gymSettings,
                  notifications: { ...gymSettings.notifications, paymentDue: checked }
                })
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fitness-card p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
          <span className="w-2 h-2 bg-neon-red rounded-full mr-3"></span>
          Data Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleExportData}
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
          >
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
          >
            <Refresh className="w-4 h-4" />
            <span>Reset Settings</span>
          </Button>

          <Button
            onClick={handleClearData}
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Delete className="w-4 h-4" />
            <span>Clear All Data</span>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Storage Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Members:</span>
              <span className="ml-2 font-semibold text-foreground">{members.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Available Plans:</span>
              <span className="ml-2 font-semibold text-foreground">{plans.length}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleSaveSettings}
          className="btn-primary-glow px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
};