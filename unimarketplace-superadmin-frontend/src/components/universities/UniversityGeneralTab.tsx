import { Button, Form, FormInstance, Input, Upload } from 'antd';
import { en } from '../../locales/en';
import { CloudUpload, Image as ImageIcon } from 'lucide-react';

const { TextArea } = Input;

interface UniversityGeneralTabProps {
  setActiveTab: (tab: string) => void;
  form: FormInstance;
}

const GENERAL_FIELDS = [
  'universityName',
  'facilityName',
  'description',
  'logo',
  'banner',
  'website',
];

export const UniversityGeneralTab = ({
  setActiveTab,
  form,
}: UniversityGeneralTabProps) => {
  const handleNext = async () => {
    await form.validateFields(GENERAL_FIELDS);
    setActiveTab('2');
  };

  return (
    <div className='pt-6'>
      <Form.Item
        name='universityName'
        label={en.addUniversity.general.universityName}
        rules={[
          {
            required: true,
            message: en.addUniversity.general.validation.universityName,
          },
        ]}
      >
        <Input
          placeholder={en.addUniversity.general.placeholders.universityName}
        />
      </Form.Item>

      <Form.Item
        name='facilityName'
        label={en.addUniversity.general.labName}
        rules={[
          {
            required: true,
            message: en.addUniversity.general.validation.labName,
          },
        ]}
      >
        <Input placeholder={en.addUniversity.general.placeholders.labName} />
      </Form.Item>

      <Form.Item
        name='description'
        label={en.addUniversity.general.description}
      >
        <TextArea
          rows={4}
          placeholder={en.addUniversity.general.placeholders.description}
        />
      </Form.Item>

      {/* Logo & Banner */}
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Form.Item
            name='logo'
            label={en.addUniversity.general.logo}
            rules={[
              {
                required: true,
                message: en.addUniversity.general.validation.logo,
              },
            ]}
            valuePropName='fileList'
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload.Dragger
              beforeUpload={() => false}
              maxCount={1}
              style={{
                background: '#F8FAFF',
                border: '1px dashed #B8C7E0',
                borderRadius: '8px',
                padding: '24px 0',
              }}
            >
              <div className='flex flex-col items-center gap-1'>
                <CloudUpload size={32} color='#475467' className='mb-2' />
                <div className='text-sm text-[#475467]'>
                  Drag & Drop your logo here or{' '}
                  <span style={{ color: '#1B56CC', fontWeight: 600 }}>
                    Browse Files
                  </span>
                </div>
                <div className='text-xs text-[#667085]'>
                  Supported formats: PNG, JPG, SVG. Max size: 5MB.
                </div>
              </div>
            </Upload.Dragger>
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='banner'
            label={en.addUniversity.general.banner}
            valuePropName='fileList'
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload.Dragger
              beforeUpload={() => false}
              maxCount={1}
              style={{
                background: '#F8FAFF',
                border: '1px dashed #B8C7E0',
                borderRadius: '8px',
                padding: '24px 0',
              }}
            >
              <div className='flex flex-col items-center gap-1'>
                <ImageIcon size={32} color='#475467' className='mb-2' />
                <div className='text-sm text-[#475467]'>
                  Drag & Drop your banner image here or{' '}
                  <span style={{ color: '#1B56CC', fontWeight: 600 }}>
                    Browse Files
                  </span>
                </div>
                <div className='text-xs text-[#667085]'>
                  Recommended size: 1200x400px. Max size: 10MB.
                </div>
              </div>
            </Upload.Dragger>
          </Form.Item>
        </div>
      </div>

      <Form.Item
        name='website'
        label={en.addUniversity.general.websiteUrl}
        rules={[
          {
            required: true,
            message: en.addUniversity.general.validation.websiteUrl,
          },
          {
            type: 'url',
            message: en.addUniversity.general.validation.invalidUrl,
          },
        ]}
      >
        <Input placeholder={en.addUniversity.general.placeholders.websiteUrl} />
      </Form.Item>

      <div className='flex justify-end mt-8'>
        <Button
          type='primary'
          onClick={handleNext}
          style={{
            backgroundColor: '#1B56CC',
            padding: '12px 40px',
            fontSize: '16px',
            fontWeight: '700',
          }}
        >
          {en.addUniversity.buttons.next}
        </Button>
      </div>
    </div>
  );
};
