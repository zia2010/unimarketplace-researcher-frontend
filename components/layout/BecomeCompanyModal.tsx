import { Modal, Form, Input, Button, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import {
  BecomeCompanyModalProps,
  CompanyCreateResponse,
  CompanyFormData,
} from '@/types/company.types';
import { companyApi } from '@/lib/services/api/company.api';
import { AxiosError } from 'axios';
import { userApi } from '@/lib/services/api/user.api';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { useEffect } from 'react';
import { storage } from '@/lib/services/storage';

export default function BecomeCompanyModal({
  open,
  onClose,
  companyData,
}: BecomeCompanyModalProps) {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const { mutate: submitCompany, isPending } = useMutation({
    mutationFn: async (values: CompanyFormData) => {
      let response: CompanyCreateResponse;
      if (companyData && companyData.id) {
        response = await companyApi.updateCompany(
          { ...companyData, ...values },
          companyData.id
        );
      } else {
        response = await companyApi.createCompany(values);
        if (response.id && user && user.id) {
          await userApi.updateUser({ companyId: response.id }, user?.id);
          storage.setUser(user);
        }
      }
      return response;
    },
    onSuccess: () => {
      message.success('Company registration submitted successfully!');
      form.resetFields();
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      message.error(
        error?.response?.data?.message ||
          'Failed to submit company registration'
      );
    },
  });

  const handleSubmit = (values: CompanyFormData) => {
    submitCompany(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (companyData) {
      form.setFieldsValue(companyData);
    }
  }, [companyData, form]);

  return (
    <Modal
      title={null}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
      closeIcon={
        <span className='text-gray-400 hover:text-gray-600 text-xl'>×</span>
      }
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        className='mt-6'
      >
        <Form.Item
          label='Company/Organisation Name'
          name='name'
          rules={[
            { required: true, message: 'Please enter company name' },
            { min: 2, message: 'Company name must be at least 2 characters' },
          ]}
        >
          <Input placeholder='Enter company name' className='h-12' />
        </Form.Item>

        <Form.Item label='Description' name='description'>
          <Input.TextArea
            placeholder='Enter description'
            rows={4}
            className='resize-none'
          />
        </Form.Item>

        <Form.Item label='Address' name='address'>
          <Input.TextArea
            placeholder='Enter address'
            rows={3}
            className='resize-none'
          />
        </Form.Item>

        <Form.Item
          label='Email Id'
          name='email'
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder='Enter email' className='h-12' />
        </Form.Item>

        <Form.Item className='mb-0 mt-8'>
          <div className='flex justify-end'>
            <Button
              type='primary'
              htmlType='submit'
              loading={isPending}
              className='h-12 px-8 bg-[#1652C9] hover:bg-[#1B56CC]'
              size='large'
            >
              {companyData && companyData.id
                ? 'Update company'
                : 'Join as company'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
