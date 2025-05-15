import { useState } from 'react';

interface Business {
  id: string;
  name: string;
  email: string;
  gstNumber?: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2?: string;
  pincode: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AddBusinessFormProps {
  business?: Business;
  onSuccess: () => void;
  onCancel: () => void;
}

// Indian states and their cities
const INDIAN_STATES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Allahabad"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur"]
};

// List of countries
const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Singapore", "UAE"];

const AddBusinessForm: React.FC<AddBusinessFormProps> = ({ onSuccess, onCancel, business }) => {
  const [formData, setFormData] = useState({
    name: business?.name || '',
    gstNumber: business?.gstNumber || '',
    country: business?.country || '',
    state: business?.state || '',
    city: business?.city || '',
    address1: business?.address1 || '',
    address2: business?.address2 || '',
    pincode: business?.pincode || '',
    contactName: business?.contactName || '',
    contactEmail: business?.contactEmail || '',
    contactPhone: business?.contactPhone || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (value.length > 50) return 'Business name cannot exceed 50 characters';
        if (value.length === 0) return 'Business name is required';
        break;
      case 'address1':
      case 'address2':
        if (value.length > 100) return 'Address cannot exceed 100 characters';
        if (field === 'address1' && value.length === 0) return 'Address is required';
        break;
      case 'pincode':
        if (!/^\d{6}$/.test(value)) return 'Pincode must be 6 digits';
        break;
      case 'contactEmail':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        break;
      case 'contactPhone':
        if (value && !/^\d{10}$/.test(value)) return 'Phone number must be 10 digits';
        break;
    }
    return '';
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'country' && { state: '', city: '' }),
      ...(field === 'state' && { city: '' })
    }));

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, field) => ({ ...acc, [field]: true }), {}));
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Add New Business</h2>
        <div className="space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="businessForm"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Save Business
          </button>
        </div>
      </div>

      <form id="businessForm" onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="block font-medium mb-1">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            onBlur={() => handleBlur('name')}
            maxLength={50}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
              errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            GST Number <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.gstNumber}
            onChange={handleChange('gstNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.country}
            onChange={handleChange('country')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Select Country</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.state}
            onChange={handleChange('state')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={!formData.country || formData.country !== 'India'}
          >
            <option value="">Select State</option>
            {formData.country === 'India' && Object.keys(INDIAN_STATES).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.city}
            onChange={handleChange('city')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={!formData.state || !INDIAN_STATES[formData.state as keyof typeof INDIAN_STATES]}
          >
            <option value="">Select City</option>
            {formData.state && INDIAN_STATES[formData.state as keyof typeof INDIAN_STATES]?.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address1}
            onChange={handleChange('address1')}
            onBlur={() => handleBlur('address1')}
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.address1 && touched.address1 ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.address1 && touched.address1 && (
            <p className="text-red-500 text-sm mt-1">{errors.address1}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Address Line 2 <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.address2}
            onChange={handleChange('address2')}
            onBlur={() => handleBlur('address2')}
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.address2 && touched.address2 ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.address2 && touched.address2 && (
            <p className="text-red-500 text-sm mt-1">{errors.address2}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={handleChange('pincode')}
            onBlur={() => handleBlur('pincode')}
            maxLength={6}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.pincode && touched.pincode ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            pattern="[0-9]{6}"
          />
          {errors.pincode && touched.pincode && (
            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.contactName}
            onChange={handleChange('contactName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={handleChange('contactEmail')}
            onBlur={() => handleBlur('contactEmail')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.contactEmail && touched.contactEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.contactEmail && touched.contactEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Contact Phone <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={handleChange('contactPhone')}
            onBlur={() => handleBlur('contactPhone')}
            maxLength={10}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.contactPhone && touched.contactPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            pattern="[0-9]{10}"
          />
          {errors.contactPhone && touched.contactPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddBusinessForm;
