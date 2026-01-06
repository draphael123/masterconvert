'use client';

import { FileInfo, ConversionType } from '@/lib/types';
import { getPresetForFile, getPresetById } from '@/lib/presets';
import { getFileExtension } from '@/lib/validation';

interface FileCardProps {
  file: FileInfo;
  onRemove: (id: string) => void;
  onPresetChange: (id: string, preset: ConversionType) => void;
  onAdvancedOptionsChange?: (id: string, options: any) => void;
}

export default function FileCard({
  file,
  onRemove,
  onPresetChange,
  onAdvancedOptionsChange,
}: FileCardProps) {
  const extension = getFileExtension(file.name);
  const availablePresets = getPresetForFile(file.name, extension);
  const selectedPreset = file.preset ? getPresetById(file.preset) : null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {file.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatFileSize(file.size)} • {file.type || 'Unknown type'}
          </p>
        </div>
        <button
          onClick={() => onRemove(file.id)}
          className="ml-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          aria-label="Remove file"
        >
          ✕
        </button>
      </div>

      {availablePresets.length > 0 ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Convert to:
          </label>
          <select
            value={file.preset || ''}
            onChange={(e) => onPresetChange(file.id, e.target.value as ConversionType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select format...</option>
            {availablePresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>

          {selectedPreset?.requiresAdvanced && (
            <AdvancedOptionsPanel
              fileId={file.id}
              preset={selectedPreset.id}
              currentOptions={file.advancedOptions}
              onChange={(options) => onAdvancedOptionsChange?.(file.id, options)}
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          No conversion options available for this file type
        </p>
      )}
    </div>
  );
}

function AdvancedOptionsPanel({
  fileId,
  preset,
  currentOptions,
  onChange,
}: {
  fileId: string;
  preset: ConversionType;
  currentOptions?: any;
  onChange: (options: any) => void;
}) {
  if (preset.startsWith('image-')) {
    return (
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Width (px):
        </label>
        <input
          type="number"
          value={currentOptions?.width || ''}
          onChange={(e) =>
            onChange({ ...currentOptions, width: parseInt(e.target.value) || undefined })
          }
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Auto"
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Height (px):
        </label>
        <input
          type="number"
          value={currentOptions?.height || ''}
          onChange={(e) =>
            onChange({ ...currentOptions, height: parseInt(e.target.value) || undefined })
          }
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Auto"
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Quality (1-100):
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={currentOptions?.quality || 90}
          onChange={(e) =>
            onChange({ ...currentOptions, quality: parseInt(e.target.value) || 90 })
          }
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    );
  }

  if (preset.includes('audio') || preset === 'mp4-to-mp3') {
    return (
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Trim Start (seconds):
        </label>
        <input
          type="number"
          min="0"
          value={currentOptions?.trimStart || ''}
          onChange={(e) =>
            onChange({ ...currentOptions, trimStart: parseFloat(e.target.value) || undefined })
          }
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="0"
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Trim End (seconds):
        </label>
        <input
          type="number"
          min="0"
          value={currentOptions?.trimEnd || ''}
          onChange={(e) =>
            onChange({ ...currentOptions, trimEnd: parseFloat(e.target.value) || undefined })
          }
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Full length"
        />
      </div>
    );
  }

  if (preset.includes('video')) {
    return (
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resolution (e.g., 1920x1080):
        </label>
        <input
          type="text"
          value={currentOptions?.resolution || ''}
          onChange={(e) =>
            onChange({ ...currentOptions, resolution: e.target.value || undefined })
          }
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="1920x1080"
        />
      </div>
    );
  }

  if (preset === 'xlsx-to-csv') {
    return (
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sheet Name (optional):
        </label>
        <input
          type="text"
          value={currentOptions?.sheetName || ''}
          onChange={(e) =>
            onChange({ ...currentOptions, sheetName: e.target.value || undefined })
          }
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Leave empty for first sheet"
        />
      </div>
    );
  }

  return null;
}


