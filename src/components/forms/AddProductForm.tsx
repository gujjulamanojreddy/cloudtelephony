import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toaster';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { supabase } from '../../lib/supabase';

// Define Product type if not already available globally or imported
// This should ideally match the one in Products.tsx or a shared types file
interface Product {
  id: string;
  name: string;
  category: string; // Keep if needed for form logic, even if not displayed in main table
  listPrice: number;
  salePrice: number;
  status: string;
  dateAdded: string;
  stock: number; // Keep if needed for form logic
  imageUrl?: string; // Add imageUrl if it's part of your product data
  gst?: string; // Add if part of your product data
  description?: string; // Add if part of your product data
}

const BUCKET_NAME = 'product-images';

interface AddProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  product?: Product | null; // Add product prop for editing
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess, onCancel, product }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    listPrice: product?.listPrice?.toString() || '',
    salePrice: product?.salePrice?.toString() || '',
    gst: product?.gst || '',
    status: product?.status || '',
    description: product?.description || '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(product?.imageUrl || null);

  // Add bucket creation effect
  useEffect(() => {
    const createBucketIfNotExists = async () => {
      try {
        // Check if bucket exists
        const { data: buckets } = await supabase
          .storage
          .listBuckets();

        const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

        if (!bucketExists) {
          // Create the bucket if it doesn't exist
          const { error: createError } = await supabase
            .storage
            .createBucket(BUCKET_NAME, {
              public: true,
              fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            });

          if (createError) {
            console.error('Error creating bucket:', createError);
          }
        }
      } catch (error) {
        console.error('Error checking/creating bucket:', error);
      }
    };

    createBucketIfNotExists();
  }, []);

  // Effect to reset form when product prop changes (e.g., from editing to adding new)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        listPrice: product.listPrice?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        gst: product.gst || '',
        status: product.status || '',
        description: product.description || '',
      });
      setExistingImageUrl(product.imageUrl || null);
      setImages([]);
    } else {
      // Reset form for adding new product
      setFormData({
        name: '',
        listPrice: '',
        salePrice: '',
        gst: '',
        status: '',
        description: '',
      });
      setExistingImageUrl(null);
      setImages([]);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (files && files[0]) {
      const newImages = [...images];
      newImages[index] = files[0];
      setImages(newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation (ensure all required fields are covered)
      if (!formData.name.trim()) {
        toast('Product name is required', 'error');
        setLoading(false);
        return;
      }
      if (!formData.listPrice || parseFloat(formData.listPrice) <= 0) {
        toast('List price must be a positive number', 'error');
        setLoading(false);
        return;
      }
      if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
        toast('Sale price must be a positive number', 'error');
        setLoading(false);
        return;
      }
      if (parseFloat(formData.salePrice) > parseFloat(formData.listPrice)) {
        toast('Sale price cannot be greater than list price', 'error');
        setLoading(false);
        return;
      }
      if (!formData.status) {
        toast('Product status is required', 'error');
        setLoading(false);
        return;
      }
      // Add other validations as needed (GST, description)

      let imageUrl = existingImageUrl || ''; // Use existing image URL by default if editing

      // Upload new image if selected
      if (images[0]) {
        try {
          const file = images[0];
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
            throw new Error('Image size must be less than 2MB');
          }
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const { data: imageData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
              cacheControl: '3600',
              contentType: file.type,
              upsert: false, // Set to true if you want to overwrite if file with same name exists, though unlikely with unique names
            });

          if (uploadError) throw uploadError;

          if (imageData) {
            const { data: publicUrlData } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(imageData.path);
            if (publicUrlData) {
              imageUrl = publicUrlData.publicUrl;
            } else {
              throw new Error('Failed to get public URL for uploaded image');
            }
          }
        } catch (error: any) {
          toast('Failed to upload image: ' + error.message, 'error');
          setLoading(false);
          return;
        }
      } else if (!product && !images[0]) { // If adding new product and no image is selected
        // toast('Product image is required when adding a new product', 'error');
        // setLoading(false);
        // return; 
        // Making image optional for now, uncomment above if image is mandatory for new products
      }

      const productData = {
        name: formData.name.trim(),
        list_price: parseFloat(formData.listPrice),
        sale_price: parseFloat(formData.salePrice),
        gst: formData.gst,
        status: formData.status,
        description: formData.description.trim(),
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (product) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (updateError) {
          toast('Failed to update product: ' + updateError.message, 'error');
          setLoading(false);
          return;
        }
        toast('Product updated successfully', 'success');
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([{ ...productData, created_at: new Date().toISOString() }]);

        if (insertError) {
          toast('Failed to add product: ' + insertError.message, 'error');
          setLoading(false);
          return;
        }
        toast('Product added successfully', 'success');
      }
      
      // Reset form state only if it was a new product or explicitly told to
      if (!product) {
        setFormData({
          name: '',
          listPrice: '',
          salePrice: '',
          gst: '',
          status: '',
          description: '',
        });
        setImages([]);
        setExistingImageUrl(null);
      }
      
      onSuccess?.();
    } catch (error: any) {
      toast('Operation failed: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={50}
          placeholder="Enter product name (max 50 characters)"
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Input
            label="List Price"
            type="number"
            name="listPrice"
            value={formData.listPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 5) {
                handleChange(e);
              }
            }}
            required
            min="0"
            max="99999"
            placeholder="Enter list price (max 5 digits)"
          />
          <Input
            label="Sale Price"
            type="number"
            name="salePrice"
            value={formData.salePrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 5) {
                handleChange(e);
              }
            }}
            required
            min="0"
            max="99999"
            placeholder="Enter sale price (max 5 digits)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Select
            label="GST"
            name="gst"
            value={formData.gst}
            onChange={(value) => setFormData(prev => ({ ...prev, gst: value }))}
            options={[
              { value: '', label: '---select---' },
              { value: '0', label: '0%' },
              { value: '5', label: '5%' },
              { value: '12', label: '12%' },
              { value: '18', label: '18%' },
              { value: '28', label: '28%' },
            ]}
            required
          />

          <Select
            label="Product Status"
            name="status"
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            options={[
              { value: '', label: '---select---' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'out_of_stock', label: 'Out of Stock' },
            ]}
            required
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={4}
            maxLength={250}
            placeholder="Enter product description (max 250 characters)"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/250 characters
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image {product ? '(Optional if not changing)' : ''}
          </label>
          {existingImageUrl && (
            <div className="mb-2">
              <img src={existingImageUrl} alt="Current product" className="h-20 w-20 object-cover rounded" />
              <p className="text-xs text-gray-500 mt-1">Current image. Upload a new one to replace it.</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 0)}
            // Remove 'required' if image is optional for new products or when editing
            // required={!product} // Example: required only if adding a new product
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;