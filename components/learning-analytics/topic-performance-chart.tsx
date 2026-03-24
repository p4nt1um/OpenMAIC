'use client';

import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface TopicPerformanceChartProps {
  topics: string[];
  scores: number[];
}

export function TopicPerformanceChart({ topics, scores }: TopicPerformanceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !topics || !scores) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Resize chart when container size changes
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });
    resizeObserver.observe(chartRef.current);

    const topicList = topics;
    const scoreList = scores;

    // Configure chart
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: topicList,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        max: 100,
      },
      series: [
        {
          name: '主题表现',
          type: 'bar',
          data: scoreList,
          itemStyle: {
            color: '#8200db',
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Resize chart to container size
    setTimeout(() => {
      chartInstance.current?.resize();
    }, 100);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
    };
  }, [topics, scores]);

  return <div ref={chartRef} className="w-full h-64 shadow-sm bg-white dark:bg-gray-800 p-2"></div>;
}