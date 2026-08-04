import {
  Table,
  Avatar,
  Card,
  Switch,
  Select,
  Button,
  Tag,
  ConfigProvider,
  App,
} from 'antd';
import { Trash2, Plus, Star } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { en } from '@/lib/locales/en';
import { User } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/services/api/user.api';
import { AxiosError } from 'axios';
import { rolesApi } from '@/lib/services/api/roles.api';
import { ProductImage } from '../common/productImage';

const variants = ['filled', 'solid', 'outlined'] as const;
const presets = [
  { status: 'success', icon: <CheckCircleOutlined />, text: 'Active' },
  { status: 'processing', icon: <SyncOutlined spin />, text: 'Invited' },
  { status: 'warning', icon: <ExclamationCircleOutlined />, text: 'Pending' },
  { status: 'error', icon: <CloseCircleOutlined />, text: 'Inactive' },
];

const ROLE_OPTIONS = [
  { value: 'Lab Director', label: 'Lab Director' },
  { value: 'Product Owner', label: 'Product Owner' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Viewer', label: 'Viewer' },
];

const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

const ROLE_SELECT_WIDTH_CH = `${Math.max(...ROLE_OPTIONS.map((opt) => opt.label.length)) + 1}ch`;

interface ManageMembersTableProps {
  data: User[];
  onAddMember: () => void;
  onClose: () => void;
}

const ManageMembersTable = ({
  data,
  onAddMember,
  onClose,
}: ManageMembersTableProps) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async (
      values: Partial<User & { isRemoveFromCompany?: boolean }>
    ) => {
      if (!values.id) {
        throw new Error('User id not found please try again later');
      }
      const isRemoveFromCompany = values?.isRemoveFromCompany;
      return await userApi.updateUser(
        { ...values, ...(isRemoveFromCompany ? { companyId: undefined } : {}) },
        values.id
      );
    },
    onSuccess: () => {
      message.success('Company registration submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['company_details'] });
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      message.error(
        error?.response?.data?.message || 'Failed to update user details'
      );
    },
  });

  const {
    data: rolesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roles-by-user-role'],
    queryFn: async () => await rolesApi.getRoles(),
  });

  const rolesData = rolesResponse;

  const arrayData = Object.keys(rolesData || {})
    .filter((key) => !isNaN(Number(key)))
    .map((key) => rolesData?.[key]);

  console.log(arrayData, isLoading, error);

  const handleSubmit = (
    values: Partial<User>,
    isRemoveFromCompany?: boolean
  ) => {
    updateUser({ ...values, isRemoveFromCompany });
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Member',
      dataIndex: 'firstName',
      key: 'member',
      width: '40%',
      render: (_, record) => (
        <div className='flex items-center gap-3 min-w-[200px]'>
          <div className='relative'>
            <Avatar
              size={40}
              src={record.profilePicture}
              className='bg-[#1652C9] flex items-center justify-center'
            >
              {record.profilePicture ? (
                <ProductImage
                  src={cdnUrl + record?.profilePicture}
                  alt='Profile Picture'
                  classNames=''
                />
              ) : (
                record.firstName?.[0] || 'U'
              )}
            </Avatar>
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-[#101828] text-[14px]'>
                {record.firstName === 'You'
                  ? en.settingsPage.you
                  : `${record.title ? record.title + ' ' : ''}${record.firstName} ${record.lastName}`}
              </span>
              {(record.firstName === 'You' ||
                record.role === 'Product Owner') && (
                <Star size={14} className='text-yellow-400 fill-yellow-400' />
              )}
            </div>
            <span className='text-[#475467] text-[12px]'>{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Owner',
      key: 'owner',
      render: (_, record) => {
        if (!arrayData || !Array.isArray(arrayData)) {
          return <div>Loading...</div>;
        }

        const companyAdminRole = arrayData?.find(
          (role) => role.name === 'Company Admin'
        );

        const companyStaffRole = arrayData?.find(
          (role) => role.name === 'Company Staff'
        );

        const isCompanyAdmin =
          companyAdminRole && record.roleId === companyAdminRole.id;

        console.log(isCompanyAdmin, record, companyAdminRole);
        return (
          <div className='flex flex-col gap-1 min-w-[100px]'>
            <span className='text-[#475467] text-[12px] font-medium'>
              Owner
            </span>
            <div className='flex items-center gap-2'>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#2F54EB',
                  },
                }}
              >
                <Switch
                  size='small'
                  checked={isCompanyAdmin}
                  disabled={isPending || isLoading}
                  checkedChildren='Admin'
                  unCheckedChildren='Staff'
                  onChange={(e) => {
                    const newRoleId = e
                      ? companyAdminRole?.id
                      : companyStaffRole?.id;

                    if (newRoleId) {
                      handleSubmit({ roleId: newRoleId, id: record.id });
                    }
                  }}
                  loading={isPending}
                />
              </ConfigProvider>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Role',
      key: 'role',
      render: (_, record) => (
        <div
          className='flex flex-col gap-1 min-w-[200px]'
          style={{ minWidth: ROLE_SELECT_WIDTH_CH }}
        >
          <span className='text-[#475467] text-[12px] font-medium'>Role</span>
          <Select
            defaultValue={record.role}
            onChange={(value) => (record.role = value)}
            variant='borderless'
            popupMatchSelectWidth={false}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: '#858586',
              background: 'white',
              borderRadius: '8px',
              padding: '0 4px',
            }}
            className='w-auto'
            options={ROLE_OPTIONS}
            disabled={true}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <div className='flex flex-col gap-1 min-w-[120px]'>
          <span className='text-[#475467] text-[12px] font-medium'>Status</span>
          <div className='flex items-center gap-2'>
            <Tag
              key={'active'}
              color={presets[0].status}
              icon={presets[0].icon}
              variant={variants[0]}
            >
              {presets[0].text}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-4 mt-5 min-w-[100px]'>
          {record.firstName !== 'You' && (
            <Button
              loading={isPending}
              disabled={isPending}
              className='flex items-center gap-2 text-[#F04438] text-[14px] font-medium hover:text-[#D92D20] transition-colors opacity-100 group-hover:opacity-100'
              onClick={() => handleSubmit({ id: record.id }, true)}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      className='my-8 border w-full border-[#EAECF0] shadow-sm rounded-xl overflow-hidden'
      variant='borderless'
      title={
        <span className='text-[#101828] text-[18px] font-semibold'>
          Manage Members
        </span>
      }
      extra={
        <Button
          type='text'
          icon={<Plus size={16} />}
          className='text-[#6941C6] font-semibold flex items-center gap-2 bg-[#F9F5FF] hover:bg-[#F9F5FF]'
          onClick={onAddMember}
          style={{
            border: '2px solid #EAECF0',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          New Member
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        showHeader={false}
        pagination={false}
        rowKey='id'
        rowClassName='group hover:bg-[#F9FAFB] transition-colors'
        scroll={{ x: true }}
        size='small'
      />
    </Card>
  );
};

export default ManageMembersTable;
