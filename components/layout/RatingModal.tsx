'use client';

import { Modal, Button, Form, Input, Rate } from 'antd';
import { useState } from 'react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RatingFormValues {
  rating: number;
  feedback: string;
}

export default function RatingModal({ isOpen, onClose }: RatingModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RatingFormValues) => {
    setLoading(true);
    try {
      // TODO: Submit rating and feedback to API
      console.log('Rating:', values.rating);
      console.log('Feedback:', values.feedback);
      onClose();
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='How much do you rate this experience'
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key='skip' onClick={onClose}>
          Skip
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={() => form.submit()}
        >
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          name='rating'
          label='Rating'
          rules={[{ required: true, message: 'Please provide a rating' }]}
        >
          <Rate
            allowHalf
            tooltips={['Terrible', 'Bad', 'Normal', 'Good', 'Excellent']}
          />
        </Form.Item>

        <Form.Item
          name='feedback'
          label='Drop your experience with us'
          rules={[{ required: false }]}
        >
          <Input.TextArea rows={8} placeholder='Share your feedback...' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
