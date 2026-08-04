import React from 'react';
import { Divider, Modal } from 'antd';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  okText: string;
  cancelText: string;
  isDanger?: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  okText,
  cancelText,
  isDanger = false,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      centered
      open={open}
      title={
        <>
          <span className='text-3xl font-semibold'>{title}</span>
          <Divider size='middle' />
        </>
      }
      onCancel={onCancel}
      width={600}
      footer={[
        <button
          className='rounded-[10px] border-[#D0D5DD] text-[#041B4B] font-bold border-[1px] px-8 py-2 cursor-pointer bg-white text-[16px] font-space-grotesk mr-3'
          onClick={onCancel}
        >
          {cancelText}
        </button>,
        <button
          className={`rounded-[10px] border-none cursor-pointer px-8 py-2 text-[16px] font-bold text-white font-space-grotesk ${isDanger ? 'bg-[#e80f0f]' : 'bg-[#1B56CC]'}`}
          onClick={onOk}
        >
          {okText}
        </button>,
      ]}
    >
      <div className='flex items-center h-20'>
        <p className='text-xl'>{description}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

