import { Modal, Form, ConfigProvider, Tabs } from 'antd';
import { en } from '../../locales/en';
import { UniversityData } from '../../lib/types/universities.data';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import './AddUniversityModal.css';
import { UniversityGeneralTab } from './UniversityGeneralTab';
import { UniversityLocationTab } from './UniversityLocationTab';
import { UniversityAdminTab } from './UniversityAdminTab';
import { UniversityPaymentTab } from './UniversityPaymentTab';

interface AddUniversityModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UniversityData) => void;
}

export const AddUniversityModal = ({
  open,
  onClose,
  onSubmit,
}: AddUniversityModalProps) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  const items = useMemo(
    () => [
      {
        key: '1',
        label: en.addUniversity.tabs.general,
        children: (
          <UniversityGeneralTab setActiveTab={setActiveTab} form={form} />
        ),
      },
      {
        key: '2',
        label: en.addUniversity.tabs.location,
        children: (
          <UniversityLocationTab setActiveTab={setActiveTab} form={form} />
        ),
      },
      {
        key: '3',
        label: en.addUniversity.tabs.admin,
        children: (
          <UniversityAdminTab setActiveTab={setActiveTab} form={form} />
        ),
      },
      {
        key: '4',
        label: en.addUniversity.tabs.payment,
        children: (
          <UniversityPaymentTab
            setActiveTab={setActiveTab}
            onSubmit={onSubmit}
            form={form}
          />
        ),
      },
    ],
    [form, onSubmit]
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={true}
      className='resource-form-modal'
      closeIcon={
        <div className='bg-[#EEF0FE] rounded-full p-1 flex items-center justify-center'>
          <X size={16} className='text-[#1B56CC]' />
        </div>
      }
      width={1200}
      styles={{
        body: {
          borderRadius: '30px',
          padding: '40px 30px 0px 30px',
          backgroundColor: '#FFFFFF',
        },
      }}
      afterOpenChange={(visible) => {
        if (visible) {
          setActiveTab('1');
        } else {
          form.resetFields();
        }
      }}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        requiredMark={(label, { required }) => (
          <span className='text-[#101010] text-[14px] font-medium'>
            {label}
            {required && <span className='text-[#F04438] ml-1'>*</span>}
          </span>
        )}
      >
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemSelectedColor: '#2F54EB',
                itemActiveColor: '#2F54EB',
                inkBarColor: '#2F54EB',
                titleFontSize: 16,
              },
            },
          }}
        >
          <Tabs
            activeKey={activeTab}
            items={items.map((item) => ({
              ...item,
              disabled: item.key !== activeTab,
            }))}
            onTabClick={(_, e) => {
              e.preventDefault();
            }}
            onChange={setActiveTab}
            className='university-form-tabs'
          />
        </ConfigProvider>

        <div className='flex justify-end mt-8 gap-4'></div>
      </Form>
    </Modal>
  );
};
