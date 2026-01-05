import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { AdvancedOptions } from '../../lib/types';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export async function convertAudio(
  inputPath: string,
  outputFormat: 'mp3' | 'wav',
  options?: AdvancedOptions
): Promise<Buffer> {
  const outputPath = join(
    tmpdir(),
    `audio-${Date.now()}-${Math.random().toString(36).substring(7)}.${outputFormat}`
  );

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .toFormat(outputFormat);

    // Apply trim if specified
    if (options?.trimStart !== undefined || options?.trimEnd !== undefined) {
      const start = options.trimStart || 0;
      const end = options.trimEnd;
      if (end !== undefined) {
        command = command.setDuration(end - start);
      }
      if (start > 0) {
        command = command.seekInput(start);
      }
    }

    // Set quality for MP3
    if (outputFormat === 'mp3') {
      command = command.audioBitrate(192);
    }

    command
      .on('end', async () => {
        try {
          const outputBuffer = await readFile(outputPath);
          await unlink(outputPath);
          resolve(outputBuffer);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        unlink(outputPath).catch(() => {});
        reject(error);
      })
      .save(outputPath);
  });
}

export async function extractAudioFromVideo(
  videoPath: string,
  outputFormat: 'mp3' = 'mp3'
): Promise<Buffer> {
  const outputPath = join(
    tmpdir(),
    `audio-${Date.now()}-${Math.random().toString(36).substring(7)}.${outputFormat}`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .toFormat(outputFormat)
      .audioBitrate(192)
      .noVideo()
      .on('end', async () => {
        try {
          const outputBuffer = await readFile(outputPath);
          await unlink(outputPath);
          resolve(outputBuffer);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        unlink(outputPath).catch(() => {});
        reject(error);
      })
      .save(outputPath);
  });
}

