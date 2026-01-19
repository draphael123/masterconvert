import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { AdvancedOptions } from '../../lib/types';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export async function convertVideo(
  inputPath: string,
  outputFormat: 'webm' | 'mp4',
  options?: AdvancedOptions
): Promise<Buffer> {
  const outputPath = join(
    tmpdir(),
    `video-${Date.now()}-${Math.random().toString(36).substring(7)}.${outputFormat}`
  );

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath).toFormat(outputFormat);

    // Apply resolution downscale if specified
    if (options?.resolution) {
      const [width, height] = options.resolution.split('x').map(Number);
      if (width && height) {
        command = command.size(`${width}x${height}`);
      }
    }

    // Set video codec for WebM
    if (outputFormat === 'webm') {
      command = command.videoCodec('libvpx-vp9');
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




