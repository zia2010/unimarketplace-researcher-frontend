// import {
//   Form,
//   Input,
//   Button,
//   Radio,
//   Select,
//   Checkbox,
//   Typography,
// } from 'antd';
// import { UseSignup } from '../../lib/context/SignupContext';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const SignupProfile = () => {
//   const { data } = UseSignup();
// //eslint-disable-next-line
//   const onFinish = (values: any) => {
//     const payload = { ...data, ...values };
//     console.log('FINAL SIGNUP PAYLOAD:', payload);
//   };

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <Title level={4} className="text-center mb-8">
//         Fill your details
//       </Title>

//       <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
//         {/* Name */}
//         <Form.Item
//           label="Name"
//           name="name"
//           rules={[{ required: true }]}
//         >
//           <Input size="large" placeholder="Enter your profile name" />
//         </Form.Item>

//         {/* Email (read-only) */}
//         <Form.Item label="Email">
//           <Input size="large" value={data.email} disabled />
//         </Form.Item>

//         {/* University */}
//         <Form.Item label="University Name" name="university">
//           <Input size="large" placeholder="Enter your university name" />
//         </Form.Item>

//         {/* Gender */}
//         <Form.Item label="What’s your gender? (optional)" name="gender">
//           <Radio.Group>
//             <Radio value="female">Female</Radio>
//             <Radio value="male">Male</Radio>
//             <Radio value="non-binary">Non-binary</Radio>
//           </Radio.Group>
//         </Form.Item>

//         {/* DOB */}
//         <Form.Item label="What’s your date of birth?">
//           <Input.Group compact>
//             <Form.Item name={['dob', 'month']} noStyle>
//               <Select placeholder="Month" style={{ width: '33%' }}>
//                 {Array.from({ length: 12 }).map((_, i) => (
//                   <Option key={i + 1} value={i + 1}>
//                     {i + 1}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item name={['dob', 'day']} noStyle>
//               <Select placeholder="Date" style={{ width: '33%' }}>
//                 {Array.from({ length: 31 }).map((_, i) => (
//                   <Option key={i + 1} value={i + 1}>
//                     {i + 1}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item name={['dob', 'year']} noStyle>
//               <Select placeholder="Year" style={{ width: '34%' }}>
//                 {Array.from({ length: 80 }).map((_, i) => {
//                   const year = new Date().getFullYear() - i;
//                   return (
//                     <Option key={year} value={year}>
//                       {year}
//                     </Option>
//                   );
//                 })}
//               </Select>
//             </Form.Item>
//           </Input.Group>
//         </Form.Item>

//         {/* Marketing */}
//         <Form.Item name="marketing" valuePropName="checked">
//           <Checkbox>
//             Share my registration data with our content providers for
//             marketing purposes.
//           </Checkbox>
//         </Form.Item>

//         {/* Terms */}
//         <Text type="secondary" className="block text-xs mb-6">
//           By creating an account, you agree to the{' '}
//           <span className="underline">Terms of use</span> and{' '}
//           <span className="underline">Privacy Policy</span>.
//         </Text>

//         {/* Submit */}
//         <Button type="primary" htmlType="submit" block size="large">
//           Sign up
//         </Button>

//         <Text className="block text-center mt-4">
//           Already have an account?{' '}
//           <span className="text-blue-600 cursor-pointer">Log in</span>
//         </Text>
//       </Form>
//     </div>
//   );
// };

// export default SignupProfile;

/* eslint-disable */
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  message,
  // Radio,
  // Select,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { UseSignup } from '../../lib/context/SignupContext';
import { useAuth } from '../../lib/context/AuthContext';

const { Title, Text } = Typography;
// const { Option } = Select;

const SignupProfile = () => {
  const { data } = UseSignup();
  const { loginWithUser } = useAuth();
  const navigate = useNavigate();

const onFinish = (values: any) => {
  const signupPayload = { ...data, ...values };

  const user = {
    id: 'temp-id',
    email: signupPayload.email,
    name: signupPayload.name,
    role: 'user',
  };

  loginWithUser(user, 'signup-temp-token');
  navigate('/dashboard', { replace: true });
};


  return (
    <div className="w-full max-w-md mx-auto">
      <Title level={4} className="text-center mb-8">
        Fill your details
      </Title>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        {/* Name */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input size="large" placeholder="Enter your profile name" />
        </Form.Item>

        {/* Email */}
        <Form.Item label="Email">
          <Input size="large" value={data.email} disabled />
        </Form.Item>

        {/* University */}
        <Form.Item label="University Name" name="university">
          <Input size="large" placeholder="Enter your university name" />
        </Form.Item>

        {/*
        ======================================
        GENDER (COMMENTED FOR NOW)
        ======================================
        <Form.Item label="What’s your gender?" name="gender">
          <Radio.Group>
            <Radio value="female">Female</Radio>
            <Radio value="male">Male</Radio>
            <Radio value="non-binary">Non-binary</Radio>
          </Radio.Group>
        </Form.Item>
        */}

        {/*
        ======================================
        DATE OF BIRTH (COMMENTED FOR NOW)
        ======================================
        <Form.Item label="What’s your date of birth?">
          <Input.Group compact>
            <Form.Item name={['dob', 'month']} noStyle>
              <Select placeholder="Month" style={{ width: '33%' }}>
                {[...Array(12)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name={['dob', 'day']} noStyle>
              <Select placeholder="Date" style={{ width: '33%' }}>
                {[...Array(31)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name={['dob', 'year']} noStyle>
              <Select placeholder="Year" style={{ width: '34%' }}>
                {[...Array(80)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        */}

        {/* Marketing */}
        <Form.Item name="marketing" valuePropName="checked">
          <Checkbox>
            Share my registration data with our content providers for marketing
            purposes.
          </Checkbox>
        </Form.Item>

        {/* Terms */}
        <Text type="secondary" className="block text-xs mb-6">
          By creating an account, you agree to the{' '}
          <span className="underline">Terms of use</span> and{' '}
          <span className="underline">Privacy Policy</span>.
        </Text>

        {/* Submit */}
        <Button type="primary" htmlType="submit" block size="large">
          Sign up
        </Button>
      </Form>
    </div>
  );
};

export default SignupProfile;
