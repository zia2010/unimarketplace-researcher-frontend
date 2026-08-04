import { Button, Form, FormInstance, Input } from 'antd';
import { en } from '../../locales/en';

interface UniversityLocationTabProps {
  setActiveTab: (tab: string) => void;
  form: FormInstance;
}

const LOCATION_FIELDS = [
    'streetAddress',
    'city',
    'state',
    'postalCode',
    'googleMapsUrl',
    'latitude',
    'longitude',
];

export const UniversityLocationTab = ({
  setActiveTab,
  form,
}: UniversityLocationTabProps) => {
    const handleNext = async () => {
        await form.validateFields(LOCATION_FIELDS);
        setActiveTab('3');
    };
  return (
    <div className='pt-6'>
      {/* Street Address */}
      <Form.Item
        name='streetAddress'
        label={en.addUniversity.location.streetAddress}
        rules={[
          {
            required: true,
            message: en.addUniversity.location.validation.streetAddress,
          },
        ]}
      >
        <Input
          placeholder={en.addUniversity.location.placeholders.streetAddress}
        />
      </Form.Item>

      {/* City / State / Postal Code */}
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Form.Item
            name='city'
            label={en.addUniversity.location.city}
            rules={[
              {
                required: true,
                message: en.addUniversity.location.validation.city,
              },
            ]}
          >
            <Input placeholder={en.addUniversity.location.placeholders.city} />
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='state'
            label={en.addUniversity.location.state}
            rules={[
              {
                required: true,
                message: en.addUniversity.location.validation.state,
              },
            ]}
          >
            <Input placeholder={en.addUniversity.location.placeholders.state} />
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='postalCode'
            label={en.addUniversity.location.postalCode}
            rules={[
              {
                required: true,
                message: en.addUniversity.location.validation.postalCode,
              },
            ]}
          >
            <Input
              placeholder={en.addUniversity.location.placeholders.postalCode}
            />
          </Form.Item>
        </div>
      </div>

      {/* Google Maps Link */}
      <Form.Item
        name='googleMapsUrl'
        label={en.addUniversity.location.googleMapsUrl}
      >
        <Input
          placeholder={en.addUniversity.location.placeholders.googleMapsUrl}
        />
      </Form.Item>

      {/* Latitude / Longitude */}
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Form.Item
            name='latitude'
            label={en.addUniversity.location.latitude}
            rules={[
              {
                pattern: /^-?\d+(\.\d+)?$/,
                message: en.addUniversity.location.validation.latitude,
              },
            ]}
          >
            <Input
              placeholder={en.addUniversity.location.placeholders.latitude}
            />
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='longitude'
            label={en.addUniversity.location.longitude}
            rules={[
              {
                pattern: /^-?\d+(\.\d+)?$/,
                message: en.addUniversity.location.validation.longitude,
              },
            ]}
          >
            <Input
              placeholder={en.addUniversity.location.placeholders.longitude}
            />
          </Form.Item>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-end mt-8 gap-4'>
        <Button
          type='primary'
          onClick={() => setActiveTab('1')}
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
