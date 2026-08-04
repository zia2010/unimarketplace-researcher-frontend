import { Modal, Form, Input, Button } from 'antd';

export type UserData = {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  mobile?: string;
  education?: string;
  image?: string;
};

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserData) => void;
  data?: UserData; // optional → decides add / edit
}

export const UserFormModal = ({
  open,
  onClose,
  onSubmit,
  data,
}: UserFormModalProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable
      width={720}
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue(data || {});
        } else {
          form.resetFields();
        }
      }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
      }}
    >
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item label='Title' name='title' rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='First Name'
          name='firstName'
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Last Name'
          name='lastName'
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label='Email Id' name='email' rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label='Role' name='role' rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label='Mobile' name='mobile' rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {data && (
          <Form.Item label='Education' name='education'>
            <Input />
          </Form.Item>
        )}

        <div className='flex justify-end mt-6'>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              borderRadius: 12,
              backgroundColor: '#1652C9',
              padding: '12px 44px',
            }}
          >
            {data ? 'Save' : 'Add'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
