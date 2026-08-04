import { Form, Input, Button, Typography, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UseSignup } from '../../lib/context/SignupContext';

const { Title, Text } = Typography;

const SignupRegister = () => {
  const { update } = UseSignup();
  const navigate = useNavigate();
//eslint-disable-next-line
  const onFinish = (values: any) => {
    update(values);
    navigate('/signup/verify');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Heading */}
      <div className="text-center mb-8">
        <Title level={3} className="mb-1!">
          Create an account
        </Title>
        <Text type="secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <br />
          Morbi lobortis maximus
        </Text>
      </div>

      {/* Form */}
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email address' },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        {/* Phone */}
        <Form.Item label="Phone" name="phone">
          <Input size="large" />
        </Form.Item>

        <Text type="secondary" className="block mb-4 text-xs">
          We strongly recommend adding a phone number. This will help verify
          your account and keep it safe.
        </Text>

        {/* Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {/* Password rules */}
        <Space direction="vertical" size={6} className="mb-6 text-xs text-gray-500">
          <span>• Use 8 or more characters</span>
          <span>• Use upper and lower case letters (e.g. Aa)</span>
          <span>• Use a number (e.g. 1234)</span>
          <span>• Use a symbol (e.g. !@#$)</span>
        </Space>

        {/* Submit */}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          className="mb-4"
        >
          Sign in
        </Button>

        {/* Terms */}
        <Text type="secondary" className="block text-center text-xs mb-4">
          By creating an account, you agree to the{' '}
          <span className="underline cursor-pointer">Terms of use</span> and{' '}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </Text>

        {/* Switch to login */}
        <Text className="block text-center">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Log in
          </span>
        </Text>
      </Form>
    </div>
  );
};

export default SignupRegister;
