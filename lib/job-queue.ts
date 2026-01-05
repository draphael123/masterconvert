// Lightweight in-memory job queue for serverless environments
// For production with Redis, use BullMQ instead

interface Job {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  resultFiles?: string[];
  error?: string;
  createdAt: number;
  expiresAt: number;
}

class InMemoryJobQueue {
  private jobs: Map<string, Job> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired jobs every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  createJob(jobId: string, ttlMinutes: number = 15): void {
    const now = Date.now();
    this.jobs.set(jobId, {
      id: jobId,
      status: 'pending',
      progress: 0,
      createdAt: now,
      expiresAt: now + ttlMinutes * 60 * 1000,
    });
  }

  updateJob(
    jobId: string,
    updates: Partial<Pick<Job, 'status' | 'progress' | 'message' | 'resultFiles' | 'error'>>
  ): void {
    const job = this.jobs.get(jobId);
    if (job) {
      Object.assign(job, updates);
    }
  }

  getJob(jobId: string): Job | undefined {
    const job = this.jobs.get(jobId);
    if (job && job.expiresAt > Date.now()) {
      return job;
    }
    if (job) {
      this.jobs.delete(jobId);
    }
    return undefined;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.expiresAt <= now) {
        this.jobs.delete(jobId);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.jobs.clear();
  }
}

// Singleton instance
let jobQueueInstance: InMemoryJobQueue | null = null;

export function getJobQueue(): InMemoryJobQueue {
  if (!jobQueueInstance) {
    jobQueueInstance = new InMemoryJobQueue();
  }
  return jobQueueInstance;
}

// For production with Redis, you can replace this with BullMQ:
/*
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export const conversionQueue = new Queue('conversions', { connection });

export const conversionWorker = new Worker(
  'conversions',
  async (job) => {
    // Process conversion
  },
  { connection }
);
*/

