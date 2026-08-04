'use client';

import React from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import { en } from '@/lib/locales/en';
import { useMutation } from '@tanstack/react-query';
import { enquiryApi } from '@/lib/services/api/enquiry.api';
import { EnquiryPayload, ApiError } from '@/types';

const { TextArea } = Input;
const t = en.landingPage.contactModal;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModalInner: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { modal, message } = App.useApp();

  const enquiryMutation = useMutation({
    mutationFn: (payload: EnquiryPayload) => enquiryApi.send(payload),
    onSuccess: (data) => {
      // 1. Reset and Close the main form modal
      form.resetFields();
      onClose();

      // 2. Show the "Success" popup directly
      modal.success({
        title: t.successMessage,
        content: data.message || 'We will get back to you shortly.',
        okButtonProps: {
          style: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
        },
      });
    },
    onError: (error: ApiError) => {
      console.error('Enquiry submission failed:', error);
      message.error(
        error?.message || 'Failed to submit enquiry. Please try again.'
      );
    },
  });

  const onFinish = (values: Record<string, string>) => {
    enquiryMutation.mutate({
      fullName: values.name,
      email: values.email,
      phoneNumber: values.phone,
      message: values.message,
    });
  };

  const onFinishFailed = (errorInfo: {
    errorFields: Array<{
      name: string | number | (string | number)[];
      errors: string[];
    }>;
    values: Record<string, string>;
    outOfDate: boolean;
  }) => {
    if (errorInfo.errorFields?.length > 0) {
      const firstError = errorInfo.errorFields[0].errors[0];
      if (firstError) {
        message.error(firstError);
      }
    }
  };

  return (
    <>
      <style>{`
        .ant-form-item-explain {
          display: none !important;
        }
      `}</style>
      <Modal
        title={
          <span className='text-xl font-bold text-slate-800'>{t.title}</span>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className='mt-6'
          requiredMark={false}
        >
          <Form.Item
            name='name'
            label={
              <span className='font-semibold text-slate-700'>
                {t.fields.name.label}
              </span>
            }
            rules={[{ required: true, message: t.fields.name.error }]}
          >
            <Input
              placeholder={t.fields.name.placeholder}
              className='h-11 rounded-lg'
            />
          </Form.Item>

          <Form.Item
            name='email'
            label={
              <span className='font-semibold text-slate-700'>
                {t.fields.email.label}
              </span>
            }
            rules={[
              { required: true, message: t.fields.email.errorRequired },
              { type: 'email', message: t.fields.email.errorInvalid },
            ]}
          >
            <Input
              placeholder={t.fields.email.placeholder}
              className='h-11 rounded-lg'
            />
          </Form.Item>

          <Form.Item
            name='phone'
            label={
              <span className='font-semibold text-slate-700'>
                {t.fields.phone.label}
              </span>
            }
            rules={[
              { required: true, message: t.fields.phone.errorRequired },
              { pattern: /^\d{10}$/, message: t.fields.phone.errorLength },
            ]}
          >
            <Input
              placeholder={t.fields.phone.placeholder}
              className='h-11 rounded-lg'
            />
          </Form.Item>

          <Form.Item
            name='message'
            label={
              <span className='font-semibold text-slate-700'>
                {t.fields.message.label}
              </span>
            }
            rules={[{ required: true, message: t.fields.message.error }]}
          >
            <TextArea
              rows={4}
              placeholder={t.fields.message.placeholder}
              className='rounded-lg'
            />
          </Form.Item>

          <Form.Item className='mb-0 mt-8'>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={enquiryMutation.isPending}
              className='h-12 bg-[#3B82F6] hover:bg-[#2563EB] font-bold rounded-xl border-none text-white transition-all'
            >
              {t.submit}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const ContactModal: React.FC<ContactModalProps> = (props) => (
  <App>
    <ContactModalInner {...props} />
  </App>
);

export default ContactModal;
