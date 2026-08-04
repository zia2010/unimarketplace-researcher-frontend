import { Button, Form, FormInstance, Input } from 'antd';
import { en } from '../../locales/en';
import { UniversityData } from '../../lib/types/universities.data';

interface UniversityPaymentTabProps {
  setActiveTab: (tab: string) => void;
  onSubmit: (values: UniversityData) => void;
  form: FormInstance;
}

export const UniversityPaymentTab = ({
  setActiveTab,
  onSubmit,
  form,
}: UniversityPaymentTabProps) => {
  return (
    <div className='pt-6'>
      {/* Legal Entity */}
      <Form.Item
        name='legalEntityName'
        label={en.addUniversity.payment.legalEntityName}
        rules={[
          {
            required: true,
            message: en.addUniversity.payment.validation.legalEntityName,
          },
        ]}
      >
        <Input
          placeholder={en.addUniversity.payment.placeholders.legalEntityName}
        />
      </Form.Item>

      {/* PAN & GSTIN */}
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Form.Item
            name='pan'
            label={en.addUniversity.payment.pan}
            rules={[
              {
                required: true,
                message: en.addUniversity.payment.validation.pan,
              },
              {
                pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: en.addUniversity.payment.validation.invalidPan,
              },
            ]}
          >
            <Input placeholder={en.addUniversity.payment.placeholders.pan} />
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='gstin'
            label={en.addUniversity.payment.gstin}
            rules={[
              {
                required: true,
                message: en.addUniversity.payment.validation.gstin,
              },
              {
                pattern:
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message: en.addUniversity.payment.validation.invalidGstin,
              },
            ]}
          >
            <Input placeholder={en.addUniversity.payment.placeholders.gstin} />
          </Form.Item>
        </div>
      </div>

      {/* Beneficiary */}
      <Form.Item
        name='beneficiaryName'
        label={en.addUniversity.payment.beneficiaryName}
        rules={[
          {
            required: true,
            message: en.addUniversity.payment.validation.beneficiaryName,
          },
        ]}
      >
        <Input
          placeholder={en.addUniversity.payment.placeholders.beneficiaryName}
        />
      </Form.Item>

      {/* Bank Details */}
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Form.Item
            name='bankAccountNumber'
            label={en.addUniversity.payment.bankAccountNumber}
            rules={[
              {
                required: true,
                message: en.addUniversity.payment.validation.bankAccountNumber,
              },
            ]}
          >
            <Input
              type="number"
              placeholder={
                en.addUniversity.payment.placeholders.bankAccountNumber
              }
            />
          </Form.Item>
        </div>

        <div className='flex-1'>
          <Form.Item
            name='ifscCode'
            label={en.addUniversity.payment.ifscCode}
            rules={[
              {
                required: true,
                message: en.addUniversity.payment.validation.ifscCode,
              },
              {
                pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                message: en.addUniversity.payment.validation.invalidIfscCode,
              },
            ]}
          >
            <Input
              placeholder={en.addUniversity.payment.placeholders.ifscCode}
            />
          </Form.Item>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex justify-end mt-8 gap-4'>
        <Button
          type='primary'
          onClick={() => setActiveTab('3')}
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
          onClick={() => {
            onSubmit({
            key: Math.random().toFixed(10).toString(),
            name: form.getFieldValue('universityName'),
            avatar: '',
            status: 'Verification Pending',
            revenue: 0,
            joiningDate: '',
          })
          }}
          style={{
            backgroundColor: '#1B56CC',
            padding: '12px 40px',
            fontSize: '16px',
            fontWeight: '700',
          }}

        >
          {en.addUniversity.buttons.saveSubmit}
        </Button>
      </div>
    </div>
  );
};
