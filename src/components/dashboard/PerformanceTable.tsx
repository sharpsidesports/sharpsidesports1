import React, { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore';
import GolferProfileModal from './GolferProfileModal';
import { Golfer } from '../../types/golf';
import { SharpsideMetric } from '../../types/metrics';

type SortField = 'rank' | 'name' | SharpsideMetric;
type SortDirection = 'asc' | 'desc';

function PerformanceTable() {
  const { golfers, weights } = useGolfStore();
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedGolfer, setSelectedGolfer] = useState<Golfer | null>(null);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedGolfers = () => {
    return [...golfers].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortField === 'rank') {
        return sortDirection === 'asc'
          ? a.rank - b.rank
          : b.rank - a.rank;
      }

      // Get values based on metric type
      switch (sortField) {
        case 'Total':
          aValue = a.strokesGainedTotal;
          bValue = b.strokesGainedTotal;
          break;
        case 'OTT':
          aValue = a.strokesGainedTee;
          bValue = b.strokesGainedTee;
          break;
        case 'APP':
          aValue = a.strokesGainedApproach;
          bValue = b.strokesGainedApproach;
          break;
        case 'ARG':
          aValue = a.strokesGainedAround;
          bValue = b.strokesGainedAround;
          break;
        case 'P':
          aValue = a.strokesGainedPutting;
          bValue = b.strokesGainedPutting;
          break;
        case 'T2G':
          aValue = a.strokesGainedTee + a.strokesGainedApproach + a.strokesGainedAround;
          bValue = b.strokesGainedTee + b.strokesGainedApproach + b.strokesGainedAround;
          break;
        case 'DrivingDist':
          aValue = a.drivingDistance;
          bValue = b.drivingDistance;
          break;
        case 'DrivingAcc':
          aValue = a.drivingAccuracy;
          bValue = a.drivingAccuracy;
          break;
        case 'gir':
          aValue = a.gir;
          bValue = b.gir;
          break;
        case 'Prox100_125':
          aValue = a.proximityMetrics['100-125'];
          bValue = b.proximityMetrics['100-125'];
          break;
        case 'Prox125_150':
          aValue = a.proximityMetrics['125-150'];
          bValue = b.proximityMetrics['125-150'];
          break;
        case 'Prox175_200':
          aValue = a.proximityMetrics['175-200'];
          bValue = b.proximityMetrics['175-200'];
          break;
        case 'Prox200_225':
          aValue = a.proximityMetrics['200-225'];
          bValue = b.proximityMetrics['200-225'];
          break;
        case 'Prox225Plus':
          aValue = a.proximityMetrics['225plus'];
          bValue = b.proximityMetrics['225plus'];
          break;
        case 'BogeyAvoid':
          aValue = a.scoringStats.bogeyAvoidance;
          bValue = b.scoringStats.bogeyAvoidance;
          break;
        case 'TotalBirdies':
          aValue = a.scoringStats.totalBirdies;
          bValue = b.scoringStats.totalBirdies;
          break;
        case 'Par3BirdieOrBetter':
          aValue = a.scoringStats.par3BirdieOrBetter;
          bValue = b.scoringStats.par3BirdieOrBetter;
          break;
        case 'Par4BirdieOrBetter':
          aValue = a.scoringStats.par4BirdieOrBetter;
          bValue = b.scoringStats.par4BirdieOrBetter;
          break;
        case 'Par5BirdieOrBetter':
          aValue = a.scoringStats.par5BirdieOrBetter;
          bValue = b.scoringStats.par5BirdieOrBetter;
          break;
        case 'BirdieConversion':
          aValue = a.scoringStats.birdieOrBetterConversion;
          bValue = b.scoringStats.birdieOrBetterConversion;
          break;
        case 'Par3Scoring':
          aValue = a.scoringStats.par3ScoringAvg;
          bValue = b.scoringStats.par3ScoringAvg;
          break;
        case 'Par4Scoring':
          aValue = a.scoringStats.par4ScoringAvg;
          bValue = b.scoringStats.par4ScoringAvg;
          break;
        case 'Par5Scoring':
          aValue = a.scoringStats.par5ScoringAvg;
          bValue = b.scoringStats.par5ScoringAvg;
          break;
        case 'EaglesPerHole':
          aValue = a.scoringStats.eaglesPerHole;
          bValue = b.scoringStats.eaglesPerHole;
          break;
        case 'BirdieAvg':
          aValue = a.scoringStats.birdieAverage;
          bValue = b.scoringStats.birdieAverage;
          break;
        case 'BirdieOrBetterPct':
          aValue = a.scoringStats.birdieOrBetterPercentage;
          bValue = b.scoringStats.birdieOrBetterPercentage;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  const getMetricValue = (golfer: Golfer, metric: SharpsideMetric): number => {
    switch (metric) {
      case 'Total':
        return golfer.strokesGainedTotal;
      case 'OTT':
        return golfer.strokesGainedTee;
      case 'APP':
        return golfer.strokesGainedApproach;
      case 'ARG':
        return golfer.strokesGainedAround;
      case 'P':
        return golfer.strokesGainedPutting;
      case 'T2G':
        // T2G is the sum of OTT, APP, and ARG
        return golfer.strokesGainedTee + golfer.strokesGainedApproach + golfer.strokesGainedAround;
      case 'DrivingDist':
        return golfer.drivingDistance;
      case 'DrivingAcc':
        return golfer.drivingAccuracy;
      case 'gir':
        return golfer.gir;
      case 'Prox100_125':
        return golfer.proximityMetrics['100-125'];
      case 'Prox125_150':
        return golfer.proximityMetrics['125-150'];
      case 'Prox175_200':
        return golfer.proximityMetrics['175-200'];
      case 'Prox200_225':
        return golfer.proximityMetrics['200-225'];
      case 'Prox225Plus':
        return golfer.proximityMetrics['225plus'];
      // Scoring stats
      case 'BogeyAvoid':
        return golfer.scoringStats.bogeyAvoidance;
      case 'TotalBirdies':
        return golfer.scoringStats.totalBirdies;
      case 'Par3BirdieOrBetter':
        return golfer.scoringStats.par3BirdieOrBetter;
      case 'Par4BirdieOrBetter':
        return golfer.scoringStats.par4BirdieOrBetter;
      case 'Par5BirdieOrBetter':
        return golfer.scoringStats.par5BirdieOrBetter;
      case 'BirdieConversion':
        return golfer.scoringStats.birdieOrBetterConversion;
      case 'Par3Scoring':
        return golfer.scoringStats.par3ScoringAvg;
      case 'Par4Scoring':
        return golfer.scoringStats.par4ScoringAvg;
      case 'Par5Scoring':
        return golfer.scoringStats.par5ScoringAvg;
      case 'EaglesPerHole':
        return golfer.scoringStats.eaglesPerHole;
      case 'BirdieAvg':
        return golfer.scoringStats.birdieAverage;
      case 'BirdieOrBetterPct':
        return golfer.scoringStats.birdieOrBetterPercentage;
      default:
        return 0;
    }
  };

  const getMetricLabel = (metric: SharpsideMetric): string => {
    switch (metric) {
      case 'Total':
        return 'SG: Total';
      case 'OTT':
        return 'SG: Off the Tee';
      case 'APP':
        return 'SG: Approach';
      case 'ARG':
        return 'SG: Around';
      case 'P':
        return 'SG: Putting';
      case 'T2G':
        return 'SG: Tee to Green';
      case 'DrivingDist':
        return 'Driving Distance';
      case 'DrivingAcc':
        return 'Driving Accuracy';
      case 'gir':
        return 'GIR';
      case 'Prox100_125':
        return 'Prox 100-125';
      case 'Prox125_150':
        return 'Prox 125-150';
      case 'Prox175_200':
        return 'Prox 175-200';
      case 'Prox200_225':
        return 'Prox 200-225';
      case 'Prox225Plus':
        return 'Prox 225+';
      case 'BogeyAvoid':
        return 'Bogey Avoidance';
      case 'TotalBirdies':
        return 'Total Birdies';
      case 'Par3BirdieOrBetter':
        return 'Par 3 Birdie or Better';
      case 'Par4BirdieOrBetter':
        return 'Par 4 Birdie or Better';
      case 'Par5BirdieOrBetter':
        return 'Par 5 Birdie or Better';
      case 'BirdieConversion':
        return 'Birdie Conversion';
      case 'Par3Scoring':
        return 'Par 3 Scoring Avg';
      case 'Par4Scoring':
        return 'Par 4 Scoring Avg';
      case 'Par5Scoring':
        return 'Par 5 Scoring Avg';
      case 'EaglesPerHole':
        return 'Eagles per Hole';
      case 'BirdieAvg':
        return 'Birdie Average';
      case 'BirdieOrBetterPct':
        return 'Birdie or Better Percentage';
      default:
        return metric;
    }
  };

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Golfer
            </th>
            {weights.map(({ metric }) => (
              <th
                key={metric}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort(metric)}
              >
                {getMetricLabel(metric)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {getSortedGolfers().map((golfer) => (
            <tr
              key={golfer.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedGolfer(golfer)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={golfer.imageUrl}
                      alt={golfer.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {golfer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rank: {golfer.rank}
                    </div>
                  </div>
                </div>
              </td>
              {weights.map(({ metric }) => (
                <td key={metric} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getMetricValue(golfer, metric).toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedGolfer && (
        <GolferProfileModal
          golfer={selectedGolfer}
          onClose={() => setSelectedGolfer(null)}
        />
      )}
    </>
  );
}

export default PerformanceTable;