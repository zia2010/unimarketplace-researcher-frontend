import { Modal, Form, Select, Input } from 'antd';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const reportReasons = [
  { value: 'foul_language', label: 'Foul Language' },
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'other', label: 'Other' },
];

export interface ReportPayload {
  reason: string;
  description?: string;
}

interface ReportModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  saveMutation: UseMutationResult<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    AxiosError<{ message: string }>,
    ReportPayload
  >;
}

function ReportModal({
  saveMutation,
  isModalOpen,
  setIsModalOpen,
}: ReportModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      saveMutation.mutate(values);
    });
  };

  return (
    <div>
      <Modal
        title='Report User'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saveMutation.isPending}
        okText='Submit Report'
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout='vertical' className='mt-4'>
          <Form.Item
            name='reason'
            label='Reason for Report'
            rules={[{ required: true, message: 'Please select a reason' }]}
          >
            <Select placeholder='Select a reason' options={reportReasons} />
          </Form.Item>

          <Form.Item
            name='description'
            label='Description'
            rules={[{ max: 500, message: 'Max 500 characters' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder='Provide more details about the violation...'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ReportModal;
