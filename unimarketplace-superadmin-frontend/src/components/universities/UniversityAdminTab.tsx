import { Button, Form, FormInstance, Input } from 'antd';
import { en } from '../../locales/en';

interface UniversityAdminTabProps {
  setActiveTab: (tab: string) => void;
  form: FormInstance;
}

const ADMIN_FIELDS = [
    'adminFirstName',
    'adminLastName',
    'adminEmail',
    'adminPhone',
    'designation',
];

export const UniversityAdminTab = ({
  setActiveTab,
  form,
}: UniversityAdminTabProps) => {
    const handleNext = async () => {
        await form.validateFields(ADMIN_FIELDS);
        setActiveTab('4');
    };
  return (
    <div className='pt-6'>
      {/* Admin Name */}
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Form.Item
            name='adminFirstName'
            label={en.addUniversity.admin.firstName}
            rules={[
              {
                required: true,
                message: en.addUniversity.admin.validation.firstName,
              },
            ]}
          >
            <Input
              placeholder={en.addUniversity.admin.placeholders.firstName}
            />
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='adminLastName'
            label={en.addUniversity.admin.lastName}
            rules={[
              {
                required: true,
                message: en.addUniversity.admin.validation.lastName,
              },
            ]}
          >
            <Input placeholder={en.addUniversity.admin.placeholders.lastName} />
          </Form.Item>
        </div>
      </div>

      {/* Email */}
      <Form.Item
        name='adminEmail'
        label={en.addUniversity.admin.email}
        rules={[
          {
            required: true,
            message: en.addUniversity.admin.validation.email,
          },
          {
            type: 'email',
            message: en.addUniversity.admin.validation.invalidEmail,
          },
        ]}
      >
        <Input placeholder={en.addUniversity.admin.placeholders.email} />
      </Form.Item>

      {/* Phone + Designation */}
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Form.Item
            name='adminPhone'
            label={en.addUniversity.admin.phone}
            rules={[
              {
                required: true,
                message: en.addUniversity.admin.validation.phone,
              },
            ]}
          >
            <Input type="number" placeholder={en.addUniversity.admin.placeholders.phone} />
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='designation'
            label={en.addUniversity.admin.designation}
          >
            <Input
              placeholder={en.addUniversity.admin.placeholders.designation}
            />
          </Form.Item>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex justify-end mt-8 gap-4'>
        <Button
          type='primary'
          onClick={() => setActiveTab('2')}
          className='h-[44px] px-12 rounded-lg border-[#D0D5DD] text-[#344054] text-[16px] font-semibold'
          style={{
            backgroundColor: '#969696',
            padding: '12px 40px',
            fontSize: '16px',
            fontWeight: '700',
          }}
        >
          {en.addUniversity.buttons.back}
        </Button>

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
