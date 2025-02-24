import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CourseStats {
  courseId: string;
  courseName: string;
  rounds: number;
  avgSgTotal: number;
  avgSgOtt: number;
  avgSgApp: number;
  avgSgArg: number;
  avgSgPutt: number;
  avgDrivingDist: number;
  avgDrivingAcc: number;
}

interface CourseComparisonProps {
  selectedCourse: CourseStats | null;
  comparisonCourse: CourseStats | null;
  loading?: boolean;
}

// Normalize a value to be between 0 and 100
const normalizeValue = (value: number, min: number, max: number) => {
  if (isNaN(value)) return 0;
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized)); // Clamp between 0 and 100
};

// Define min/max values for normalization
const ranges = {
  drivingDist: { min: 270, max: 320 },
  drivingAcc: { min: 40, max: 80 },
  sgApp: { min: -1, max: 1 },
  sgArg: { min: -1, max: 1 },
  sgPutt: { min: -1, max: 1 },
};

const getChartData = (selectedCourse: CourseStats | null, comparisonCourse: CourseStats | null) => {
  if (!selectedCourse) return null;

  const datasets = [
    {
      label: selectedCourse.courseName,
      data: [
        normalizeValue(selectedCourse.avgDrivingDist, ranges.drivingDist.min, ranges.drivingDist.max),
        normalizeValue(selectedCourse.avgDrivingAcc * 100, ranges.drivingAcc.min, ranges.drivingAcc.max),
        normalizeValue(selectedCourse.avgSgApp, ranges.sgApp.min, ranges.sgApp.max),
        normalizeValue(selectedCourse.avgSgArg, ranges.sgArg.min, ranges.sgArg.max),
        normalizeValue(selectedCourse.avgSgPutt, ranges.sgPutt.min, ranges.sgPutt.max),
      ],
      backgroundColor: 'rgba(53, 162, 235, 0.2)',
      borderColor: 'rgb(53, 162, 235)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(53, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(53, 162, 235)',
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ];

  if (comparisonCourse) {
    datasets.push({
      label: comparisonCourse.courseName,
      data: [
        normalizeValue(comparisonCourse.avgDrivingDist, ranges.drivingDist.min, ranges.drivingDist.max),
        normalizeValue(comparisonCourse.avgDrivingAcc * 100, ranges.drivingAcc.min, ranges.drivingAcc.max),
        normalizeValue(comparisonCourse.avgSgApp, ranges.sgApp.min, ranges.sgApp.max),
        normalizeValue(comparisonCourse.avgSgArg, ranges.sgArg.min, ranges.sgArg.max),
        normalizeValue(comparisonCourse.avgSgPutt, ranges.sgPutt.min, ranges.sgPutt.max),
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)',
      pointRadius: 3,
      pointHoverRadius: 5,
    });
  }

  return {
    labels: [
      'Driving Distance',
      'Driving Accuracy',
      'SG: Approach',
      'SG: Around Green',
      'SG: Putting',
    ],
    datasets,
  };
};

export default function CourseComparison({
  selectedCourse,
  comparisonCourse,
  loading = false,
}: CourseComparisonProps) {
  const chartData = getChartData(selectedCourse, comparisonCourse);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading course data...</span>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Select a course to view statistics</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Course Comparison</h2>
      {chartData && (
        <div className="h-96">
          <Radar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                  },
                },
                tooltip: {
                  callbacks: {
                    label: function(context: any) {
                      const value = context.raw;
                      const label = context.dataset.label;
                      const metric = context.chart.data.labels[context.dataIndex];
                      
                      // Get the original value before normalization
                      let originalValue;
                      if (metric === 'Driving Distance') {
                        originalValue = value * (ranges.drivingDist.max - ranges.drivingDist.min) / 100 + ranges.drivingDist.min;
                        return `${label}: ${originalValue.toFixed(1)} yards`;
                      } else if (metric === 'Driving Accuracy') {
                        originalValue = value * (ranges.drivingAcc.max - ranges.drivingAcc.min) / 100 + ranges.drivingAcc.min;
                        return `${label}: ${originalValue.toFixed(1)}%`;
                      }
                      return `${label}: ${value.toFixed(2)}`;
                    }
                  }
                }
              },
              scales: {
                r: {
                  min: 0,
                  max: 100,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 20,
                    display: false, // Hide the numerical values
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)', // Lighter grid lines
                  },
                  angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)', // Lighter angle lines
                  },
                  pointLabels: {
                    font: {
                      size: 12,
                    },
                    color: '#666',
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}