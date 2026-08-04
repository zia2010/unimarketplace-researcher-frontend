import { EditUserFormValues } from '@/types';
import { Button, Form, Input, Modal, FormProps, FormInstance } from 'antd';
import React from 'react';

interface ProfileModalProps {
  isSubmitting: boolean;
  isEditModalVisible: boolean;
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormSubmit: FormProps['onFinish'];
  email: string;
  form: FormInstance<EditUserFormValues>;
}

function ProfileModal({
  isSubmitting,
  isEditModalVisible,
  setIsEditModalVisible,
  handleFormSubmit,
  email,
  form,
}: ProfileModalProps) {
  return (
    <Modal
      title='Edit Personal Information'
      open={isEditModalVisible}
      onCancel={() => setIsEditModalVisible(false)}
      footer={[
        <Button key='cancel' onClick={() => setIsEditModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={isSubmitting}
          onClick={handleFormSubmit}
          className='bg-[#001D4D] hover:bg-blue-600'
        >
          Save Changes
        </Button>,
      ]}
      width={600}
      centered
    >
      <Form form={form} layout='vertical' className='mt-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Form.Item
            label='First Name'
            name='firstName'
            rules={[
              { required: true, message: 'Please enter your first name' },
              { min: 2, message: 'First name must be at least 2 characters' },
            ]}
          >
            <Input
              placeholder='Enter your first name'
              size='large'
              disabled={isSubmitting}
            />
          </Form.Item>

          <Form.Item
            label='Last Name'
            name='lastName'
            rules={[
              { min: 2, message: 'Last name must be at least 2 characters' },
            ]}
          >
            <Input
              placeholder='Enter your last name'
              size='large'
              disabled={isSubmitting}
            />
          </Form.Item>

          <Form.Item label='Email' className='col-span-2'>
            <Input value={email} disabled size='large' className='bg-gray-50' />
            <p className='text-gray-500 text-sm mt-1'>
              Email cannot be changed as its your unique identifier
            </p>
          </Form.Item>

          <Form.Item
            label='Phone Number'
            name='phone'
            rules={[
              {
                pattern: /^[6-9]\d{9}$/,
                message:
                  'Please enter a valid 10-digit phone number (starting with 6-9)',
              },
            ]}
            className='col-span-2'
          >
            <Input
              placeholder='Enter your 10-digit phone number'
              size='large'
              disabled={isSubmitting}
              maxLength={10}
            />
          </Form.Item>

          <Form.Item
            label='Designation / Title'
            name='title'
            rules={[
              { min: 2, message: 'Designation must be at least 2 characters' },
            ]}
            className='col-span-2'
          >
            <Input
              placeholder='Enter your designation or title'
              size='large'
              disabled={isSubmitting}
            />
          </Form.Item>

          {/* <Form.Item
            label='Department / Education'
            name='education'
            rules={[
              { min: 2, message: 'Department must be at least 2 characters' },
            ]}
            className='col-span-2'
          >
            <Input
              placeholder='Enter your department or education'
              size='large'
              disabled={isSubmitting}
            />
          </Form.Item> */}
        </div>
      </Form>
    </Modal>
  );
}

export default ProfileModal;
