'use client';

import { JobStatus } from '@/lib/types';

interface ProgressCardProps {
  job: JobStatus;
  fileName: string;
  onDownload: (jobId: string, fileIndex?: number) => void;
  onDownloadZip?: (jobId: string) => void;
}

export default function ProgressCard({
  job,
  fileName,
  onDownload,
  onDownloadZip,
}: ProgressCardProps) {
  const getStatusColor = () => {
    switch (job.status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {fileName}
        </h3>
        <span
          className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor()} text-white`}
        >
          {job.status}
        </span>
      </div>

      {job.status === 'processing' && (
        <div className="mb-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {job.progress}% - {job.message || 'Processing...'}
          </p>
        </div>
      )}

      {job.status === 'completed' && job.resultFiles && (
        <div className="space-y-2">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✓ Conversion complete
          </p>
          <div className="flex gap-2">
            {job.resultFiles.length === 1 ? (
              <button
                onClick={() => onDownload(job.jobId, 0)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
              >
                Download
              </button>
            ) : (
              <>
                <button
                  onClick={() => onDownloadZip?.(job.jobId)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Download All (ZIP)
                </button>
                {job.resultFiles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onDownload(job.jobId, index)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                  >
                    File {index + 1}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {job.status === 'failed' && (
        <div>
          <p className="text-sm text-red-600 dark:text-red-400">
            ✗ {job.error || 'Conversion failed'}
          </p>
        </div>
      )}
    </div>
  );
}


