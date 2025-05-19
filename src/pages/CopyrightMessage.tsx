import React, { useState, useEffect } from 'react';
import { updateSettings, getSettings } from '../lib/storage';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

interface CopyrightData {
  copyrightMessage: string;
}

const CopyrightMessage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [copyrightData, setCopyrightData] = useState<CopyrightData>({
    copyrightMessage: ''
  });

  useEffect(() => {
    const fetchCopyrightMessage = async () => {
      try {
        const settings = await getSettings();
        if (settings) {
          setCopyrightData({
            copyrightMessage: settings.copyrightMessage || ''
          });
        }
      } catch (error) {
        console.error('Error fetching copyright message:', error);
        toast.error('Failed to load copyright message');
      }
    };

    fetchCopyrightMessage();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCopyrightData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSettings(copyrightData);
      toast.success('Copyright message saved successfully');
    } catch (error) {
      console.error('Error saving copyright message:', error);
      toast.error('Failed to save copyright message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Copyright Message</h2>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="copyrightMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Copyright Message
            </label>
            <input
              type="text"
              id="copyrightMessage"
              name="copyrightMessage"
              value={copyrightData.copyrightMessage}
              onChange={handleInputChange}
              placeholder="© 2023 Your Company Name. All rights reserved."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="mt-6">
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-green-500 text-white hover:bg-green-600"
              leftIcon={<Save size={16} />}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CopyrightMessage;
