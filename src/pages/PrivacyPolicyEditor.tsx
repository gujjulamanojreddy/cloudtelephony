import React, { memo, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Editor } from '@tinymce/tinymce-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const initialContent = `Privacy Policy

1. Information We Collect
- Personal information (name, email, shipping address)
- Payment information (processed securely through payment gateways)
- Order details and preferences
- Website usage data
- Customer service communications

2. How We Use Your Information
- Process and fulfill orders
- Communicate about orders and services
- Improve our products and services
- Send promotional materials (with consent)
- Comply with legal obligations

3. Information Security
- We implement appropriate security measures
- Data is encrypted during transmission
- Access to personal information is restricted
- Regular security assessments are conducted

4. Information Sharing
We do not sell your personal information. We share information only with:
- Shipping partners for delivery
- Payment processors for transactions
- Legal authorities when required by law

5. Your Rights
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications
- File complaints with relevant authorities`;

function PrivacyPolicyEditor() {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedContent, setSavedContent] = useState(initialContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('content')
          .eq('id', 'privacy-policy')
          .maybeSingle();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data?.content) {
          setSavedContent(data.content);
        }
      } catch (error: any) {
        console.error('Error fetching privacy policy:', error);
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    try {
      const content = editorRef.current.getContent();

      const { data: existingData, error: checkError } = await supabase
        .from('content')
        .select('id')
        .eq('id', 'privacy-policy')
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing content:', checkError);
        throw checkError;
      }

      let error;
      
      if (existingData) {
        const { error: updateError } = await supabase
          .from('content')
          .update({ 
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'privacy-policy');
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('content')
          .insert({ 
            id: 'privacy-policy',
            content: content,
            updated_at: new Date().toISOString()
          });
        error = insertError;
      }

      if (error) {
        console.error('Save operation failed:', error);
        throw error;
      }

      toast.success('Privacy policy saved successfully');
      setSavedContent(content);
      navigate('/settings');
    } catch (error: any) {
      console.error('Error saving privacy policy:', error);
      toast.error(
        error.message 
          ? `Failed to save: ${error.message}` 
          : 'Failed to save privacy policy. Please try again.'
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={handleSave}
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Save'}
        </Button>
        <Button
          onClick={() => navigate('/settings')}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          disabled={isLoading}
        >
          Back
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Privacy Policy</h2>
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Loading editor...</p>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <label className="text-sm text-gray-600">Body</label>
              </div>
              <Editor
                apiKey="kw7kx2lt3nplhyg9nl328rrwc1qblygubse4aqewi5q17i11"                onInit={(_evt, editor) => {
                  editorRef.current = editor;
                  try {
                    const container = editor.getContainer() as HTMLElement;
                    if (container) {
                      container.style.border = '1px solid #e5e7eb';
                      container.style.borderRadius = '0.375rem';
                      
                      const toolbar = container.querySelector('.tox-toolbar-overlord') as HTMLElement;
                      if (toolbar) {
                        toolbar.style.backgroundColor = '#f9fafb';
                        toolbar.style.borderBottom = '1px solid #e5e7eb';
                      }

                      const editor_container = container.querySelector('.tox-edit-area__iframe') as HTMLElement;
                      if (editor_container) {
                        editor_container.style.backgroundColor = '#ffffff';
                      }
                    }
                  } catch (error) {
                    console.error('Editor initialization error:', error);
                  }
                }}
                initialValue={savedContent}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: ['lists'],
                  disabled: false,
                  toolbar: [
                    { name: 'styles', items: ['formatselect'] },
                    { name: 'fontfamily', items: ['fontselect'] },
                    { name: 'fontsize', items: ['fontsizeselect'] },
                    { name: 'formatting', items: ['bold', 'italic', 'underline'] },
                    { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright'] },
                    { name: 'lists', items: ['bullist', 'numlist'] },
                    { name: 'indentation', items: ['outdent', 'indent'] },
                    { name: 'script', items: ['superscript', 'subscript'] }
                  ],
                  content_style: `
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      padding: 1rem;
                      color: #374151;
                    }
                  `,
                  font_formats: 'Normal=sans-serif',
                  fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt',
                  block_formats: 'Normal=p',
                  formats: {
                    bold: { inline: 'strong' },
                    italic: { inline: 'em' },
                    underline: { inline: 'span', styles: { 'text-decoration': 'underline' } },
                  },
                  statusbar: false,
                  branding: false,
                  promotion: false,
                  toolbar_sticky: true,
                  resize: false,
                  skin: 'oxide',
                  toolbar_mode: 'wrap'
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PrivacyPolicyEditor);