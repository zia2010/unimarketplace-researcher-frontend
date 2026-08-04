import React, { useEffect, useRef } from 'react';
import { Card, Select } from 'antd';
import * as echarts from 'echarts';
import { TrendingUp } from 'lucide-react';

interface RevenueTrendsProps {
  points: { date: string; value: number }[];
}

const RevenueTrends: React.FC<RevenueTrendsProps> = ({ points }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    chart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: points.map((p) => p.date),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#667085', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { type: 'dashed' } },
        axisLabel: { color: '#667085', fontSize: 10 },
      },
      series: [
        {
          data: points.map((p) => p.value),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#1B56CC', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(27, 86, 204, 0.1)' },
              { offset: 1, color: 'rgba(27, 86, 204, 0)' },
            ]),
          },
        },
      ],
    });

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [points]);

  return (
    <Card bordered={false} style={{ borderRadius: '12px' }}>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-[#041B4B] text-xl font-bold font-space-grotesk'>
          Revenue Trends
        </h3>
        <Select
          defaultValue='30'
          variant='borderless'
          className='text-[#98A2B3] text-sm'
          options={[{ value: '30', label: 'Last 30 days' }]}
        />
      </div>

      <div className='flex justify-end items-center gap-1 mb-2'>
        <TrendingUp size={16} className='text-[#16A34A]' />
        <span className='text-[#16A34A] text-sm font-semibold'>15%</span>
      </div>

      <div ref={chartRef} style={{ height: 300, width: '100%' }} />
    </Card>
  );
};

export default RevenueTrends;
