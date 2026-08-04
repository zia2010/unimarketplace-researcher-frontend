import React, { useState } from 'react';
import { Table, Avatar, Card, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Upload } from 'lucide-react';
import { en } from '../../locales/en';
import {
  RatingFeedbackData,
  ratingsFeedbackData,
} from '../../lib/types/ratingsFeedback.data';

const { Search } = Input;

const RatingsFeedbackTable: React.FC = () => {
  const [data, setData] = useState<RatingFeedbackData[]>(ratingsFeedbackData);

  const onSearch = (value: string) => {
    const filteredData = ratingsFeedbackData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.product.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  const columns: ColumnsType<RatingFeedbackData> = [
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
      dataIndex: 'product',
      key: 'product',
      render: (text) => (
        <div className='flex flex-col'>
          <span className='font-medium text-[#989797] text-[10px]'>
            {en.table.product}
          </span>
          <span className='font-bold text-[#1D2939] text-[14px] font-space-grotesk'>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'rating',
      key: 'rating',
      render: (text) => (
        <div className='flex flex-col'>
          <span className='font-medium text-[#989797] text-[10px]'>
            {en.table.rating}
          </span>
          <span className='font-bold text-[#1D2939] text-[14px] font-space-grotesk'>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'comments',
      key: 'comments',
      width: '400px',
      render: (text) => (
        <div className='flex flex-col'>
          <span className='font-medium text-[#989797] text-[10px]'>
            {en.table.comments}
          </span>
          <span className='text-[#1D2939] text-[12px] font-medium max-w-[400px] leading-[18px]'>
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
            padding: 20px 0 !important;
            vertical-align: top !important;
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

export default RatingsFeedbackTable;
