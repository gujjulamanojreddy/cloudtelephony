import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { useToast } from '../ui/Toaster';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AddAgentFormProps {
  onSubmit: (data: { name: string; email: string; business_name: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: { name: string; email: string };
  isEditing?: boolean;
}

export default function AddAgentForm({ onSubmit, onCancel, initialData, isEditing = false }: AddAgentFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    business_name: 'Cloud Telephony'
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast('Agent name is required', 'error');
      return false;
    }
    if (!formData.email.trim()) {
      toast('Email is required', 'error');
      return false;
    }
    if (!formData.email.includes('@')) {
      toast('Please enter a valid email address', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        business_name: formData.business_name
      });
      
      // If we get here, it means the submit was successful
      // Let the toast be handled by the parent component

      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          name: '',
          email: '',
          business_name: 'Cloud Telephony'
        });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Just pass through the error message without wrapping
      toast(error?.message || 'Failed to process request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase() : value
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">{isEditing ? 'Edit Agent' : 'Add New Agent'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Agent Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Enter agent name"
            />            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Enter agent email"
            />

            <Input
              label="Business Name"
              name="business_name"
              value={formData.business_name}
              disabled={true}
              placeholder="Cloud Telephony"
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
              >
                {isEditing ? 'Update Agent' : 'Add Agent'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
