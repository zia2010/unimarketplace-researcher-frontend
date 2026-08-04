import { Button, Typography, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SignupVerify = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <Space direction="vertical" size={24} className="w-full">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <MailOutlined className="text-blue-600 text-xl" />
          </div>
        </div>

        {/* Text */}
        <div>
          <Title level={4} className="mb-1!">
            Check your email
          </Title>
          <Text type="secondary">Open mail app to verify</Text>
        </div>

        {/* Open email app (placeholder) */}
        <Button type="primary" size="large" block>
          Open email app
        </Button>

        {/* Resend */}
        <Text type="secondary">
          Didn’t receive the email?{' '}
          <span className="text-blue-600 cursor-pointer">
            Click to resend
          </span>
        </Text>

        {/* TEMP BYPASS */}
        <Button
          block
          size="large"
          onClick={() => navigate('/signup/profile')}
        >
          TEMP: I’ve verified (continue)
        </Button>

        {/* Back */}
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/login')}
        >
          Back to log in
        </Button>
      </Space>
    </div>
  );
};

export default SignupVerify;
