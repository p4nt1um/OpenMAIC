'use client';

import {  useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ActivityHeatmapProps {
  data: number[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Resize chart when container size changes
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });
    resizeObserver.observe(chartRef.current);

    // Prepare data for heatmap
    const heatmapData = data.map((value, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      return [
        echarts.time.format(date, '{yyyy}-{MM}-{dd}', false),
        value,
      ];
    });

    // Configure chart
    const option: echarts.EChartsOption = {
      tooltip: {},
      visualMap: {
        min: 0,
        max: Math.max(...data),
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 30,
        inRange: {
          color: ['#f0e6ff', '#d9b3ff', '#bf80ff', '#a64dff', '#8c1aff', '#8200db'],
        },
      },
      calendar: {
        top: 80,
        left: 30,
        right: 30,
        cellSize: ['auto', 15],
        range: [
          heatmapData[heatmapData.length - 1][0],
          heatmapData[0][0]
        ],
        itemStyle: {
          borderWidth: 0.5,
        },
        yearLabel: { show: false },
        monthLabel: { show: false },
        dayLabel: { show: false },
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: heatmapData,
      },
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
  }, [data]);

  return <div ref={chartRef} className="w-full h-64 shadow-sm bg-white dark:bg-gray-800 p-2"></div>;
}