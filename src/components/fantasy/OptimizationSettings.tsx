import React from 'react';
import { FantasySettings } from '../../types/fantasy';

interface OptimizationSettingsProps {
  settings: FantasySettings;
  onSettingsChange: (settings: FantasySettings) => void;
}

export default function OptimizationSettings({ settings, onSettingsChange }: OptimizationSettingsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Optimization Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fantasy Site
          </label>
          <select
            value={settings.site}
            onChange={(e) => onSettingsChange({ ...settings, site: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="draftkings">DraftKings</option>
            <option value="fanduel">FanDuel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Lineups
          </label>
          <input
            type="number"
            min="1"
            max="150"
            value={settings.lineups}
            onChange={(e) => onSettingsChange({ ...settings, lineups: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Player Exposure (%)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={settings.maxExposure}
            onChange={(e) => onSettingsChange({ ...settings, maxExposure: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Salary Used
          </label>
          <input
            type="number"
            min="0"
            max={settings.budget}
            step="100"
            value={settings.minSalary}
            onChange={(e) => onSettingsChange({ ...settings, minSalary: parseInt(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );
}