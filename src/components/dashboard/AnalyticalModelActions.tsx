import { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore.js';

export default function AnalyticalModelActions() {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [modelName, setModelName] = useState('');
  const { weights, savedModels = [], saveModel, loadModel } = useGolfStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) return;
    
    saveModel({
      name: modelName,
      weights: weights
    });
    setShowSaveDialog(false);
    setModelName('');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowSaveDialog(true)}
        className="text-sm text-green-600 hover:text-green-700 font-medium"
      >
        Save Model
      </button>
      
      {savedModels.length > 0 && (
        <select
          onChange={(e) => loadModel(e.target.value)}
          className="text-sm border-gray-300 rounded-md"
          defaultValue=""
        >
          <option value="" disabled>Load Saved Model</option>
          {savedModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Save Analysis Model</h3>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
              className="w-full rounded-md border-gray-300 mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}