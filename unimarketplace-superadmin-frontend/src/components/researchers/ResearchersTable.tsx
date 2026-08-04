import React, { useState } from 'react';
import { Table, Avatar, Card, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Upload } from 'lucide-react';
import { en } from '../../locales/en';
import {
  ResearcherData,
  researchersData,
} from '../../lib/types/researchers.data';

const { Search } = Input;

const ResearchersTable: React.FC = () => {
  const [data, setData] = useState<ResearcherData[]>(researchersData);

  const onSearch = (value: string) => {
    const filteredData = researchersData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.organisation.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  const columns: ColumnsType<ResearcherData> = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className='flex items-center gap-[10px]'>
          <Avatar
            size={40}
            style={{ backgroundColor: '#1B56CC' }}
            className='flex items-center justify-center text-white font-bold text-lg'
          >
            {record.name.charAt(0)}
          </Avatar>
          <div className='flex flex-col'>
            <span className='text-[#989797] text-[10px] font-medium'>
              {en.table.name}
            </span>
            <span className='font-bold text-[#1D2939] text-[14px] font-space-grotesk'>
              {record.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'organisation',
      key: 'organisation',
      render: (text) => (
        <div className='flex flex-col'>
          <span className='font-medium text-[#989797] text-[10px]'>
            {en.table.organisation}
          </span>
          <span className='font-bold text-[#1D2939] text-[14px] font-space-grotesk'>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div className='flex flex-col'>
          <span className='font-medium text-[#989797] text-[10px]'>
            {en.table.status}
          </span>
          <span
            className={`font-semibold text-[13px] leading-[16px] font-space-grotesk ${
              status === 'Active' ? 'text-[#16A34A]' : 'text-[#989797]'
            }`}
          >
            {status}
          </span>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      render: (text) => (
        <div className='flex flex-col'>
          <span className='font-medium text-[#989797] text-[10px]'>
            {en.table.joiningDate}
          </span>
          <span className='font-bold text-[#1D2939] text-[14px] font-space-grotesk'>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'totalSpend',
      key: 'totalSpend',
      render: (text) => (
        <div className='flex flex-col'>
          <span className='font-medium text-[#989797] text-[10px]'>
            {en.table.totalSpend}
          </span>
          <span className='font-bold text-[#1D2939] text-[14px] font-space-grotesk'>
            {text}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Card
      className='my-8 py-6 px-4'
      bordered={false}
      style={{ borderRadius: '16px' }}
    >
      <div className='flex justify-between items-center mb-8'>
        <Search
          placeholder={en.search}
          allowClear
          onSearch={onSearch}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: 277,
            backgroundColor: '#F7F8FF',
            borderRadius: '50px',
          }}
          variant='borderless'
          className='custom-search'
        />
        <div className='flex items-center gap-[20px] mr-4'>
          <Upload className='w-5 h-5 text-[#041B4B] cursor-pointer hover:text-[#1B56CC]' />
        </div>
      </div>

      <style>
        {`
          .custom-search .ant-input-wrapper {
            background-color: #F7F8FF;
            border-radius: 50px;
            padding: 0 12px;
          }
          .custom-search .ant-input {
            background-color: #F7F8FF !important;
          }
          .ant-table-wrapper .ant-table-tbody > tr > td {
            border-bottom: none !important;
            padding: 16px 0 !important;
          }
        `}
      </style>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
        rowKey='key'
      />
    </Card>
  );
};

export default ResearchersTable;
