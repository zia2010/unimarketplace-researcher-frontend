import { Button, Checkbox, Col, Input, Row } from 'antd';
import Link from 'next/link';
const { TextArea } = Input;

interface BookingPurposeStepProps {
  onBack: () => void;
  onSubmit: (purpose: string) => void;
  loading: boolean;
  purpose: string;
  setPurpose: (value: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
}

export const BookingPurposeStep = ({
  onBack,
  onSubmit,
  loading,
  purpose,
  setPurpose,
  termsAccepted,
  setTermsAccepted,
}: BookingPurposeStepProps) => {
  return (
    <div className='flex flex-col h-full md:px-4'>
      <div className='mb-4'>
        <span className='text-gray-400 text-sm'>Step 2/3</span>
      </div>

      <div className='flex-1 space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Purpose of Action <span className='text-red-500'>*</span>
          </label>
          <TextArea
            rows={12}
            placeholder='Please describe the purpose of your booking in detail.'
            className='w-full rounded-xl border-gray-200 resize-none p-4'
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className='mt-6'>
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className='flex items-start'
          >
            <span className='text-sm text-gray-600 mt-[-2px] block'>
              I confirm that I have read and accept the terms and conditions and
              privacy policy.
            </span>
          </Checkbox>
          <Link
            href='/termsOfService'
            target='_blank'
            className='text-xs text-blue-500 block ml-6 underline mt-1'
          >
            Read terms & condition
          </Link>
        </div>
      </div>

      <Row justify='end' className='mt-8 gap-4'>
        <Col>
          <Button
            className='h-11 px-8 rounded-xl'
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
        </Col>
        <Col>
          <Button
            type='primary'
            className='h-11 px-8 rounded-xl bg-[#1B56CC] border-none'
            onClick={() => onSubmit(purpose)}
            disabled={!purpose.trim() || !termsAccepted}
            loading={loading}
          >
            Next
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default BookingPurposeStep;
