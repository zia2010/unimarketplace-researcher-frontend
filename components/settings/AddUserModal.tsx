import { userApi } from '@/lib/services/api/user.api';
import { User } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Form, Modal, Row, Col, Input, Button, App } from 'antd';
import { AxiosError } from 'axios';

function AddUserModal({
  isModalOpen,
  setIsModalOpen,
  companyId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (state: boolean) => void;
  companyId?: string;
}) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const { mutate: submitUser, isPending } = useMutation({
    mutationFn: async (values: Partial<User>) => {
      return await userApi.createUser({ ...values, companyId: companyId });
    },
    onSuccess: () => {
      message.success('Company registration submitted successfully!');
      form.resetFields();
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      message.error(
        error?.response?.data?.message || 'Failed to submit user registration'
      );
    },
  });

  const handleSubmit = (values: Partial<User>) => {
    submitUser(values);
  };

  if (!companyId) return <></>;

  return (
    <div>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={500}
        title='Add Team Member'
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label='Title' name='title' required>
                <Input placeholder='Dr / Mr / Ms' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label='Role' name='role' required>
                <Input placeholder='Researcher' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='First Name' name='firstName' required>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Last Name' name='lastName' required>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label='Email Id' name='email' required>
            <Input type='email' />
          </Form.Item>

          <Form.Item label='Mobile' name='phone' required>
            <Input />
          </Form.Item>

          <div className='flex justify-end'>
            <Button
              type='primary'
              htmlType='submit'
              className='bg-blue-600'
              loading={isPending}
              disabled={isPending}
            >
              Add
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AddUserModal;
