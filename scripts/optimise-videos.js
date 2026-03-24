import pkg from 'fast-glob';
const { glob } = pkg;
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import cliProgress from 'cli-progress';
import { fileURLToPath } from 'url';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

ffmpeg.setFfprobePath(ffprobeInstaller.path);
ffmpeg.setFfmpegPath(ffmpegPath);

const ENV = process.argv[2] === 'prod' ? 'prod' : process.argv[2] === 'dev' ? 'dev' : 'local';

const config = {
    local: {
        outputDir: 'dist/assets/videos',
    },
    dev: {
        crf: 23,
        scale: 720,
        audioBitrate: '128k',
        outputDir: 'dist-dev/assets/videos',
    },
    prod: {
        crf: 22,
        scale: 1080,
        audioBitrate: '160k',
        outputDir: 'dist-prod/assets/videos',
    },
};

const { crf, scale, audioBitrate, outputDir } = config[ENV];

function getVideoDuration(input) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(input, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration);
        });
    });
}

function copyFile(input, output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(input, output);
    console.log(`📋 Copied: ${path.basename(output)}`);
}

function optimiseFile(input, output, includeAudio) {
    return new Promise(async (resolve, reject) => {
        const duration = await getVideoDuration(input);

        const bar = new cliProgress.SingleBar({
            format: `⚙️  {file} [{bar}] {percentage}% | ETA: {eta}s`,
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true,
        });

        bar.start(100, 0, { file: path.basename(input) });

        const command = ffmpeg(input)
            .outputOptions([
                `-vcodec libx264`,
                `-crf ${crf}`,
                `-preset slow`,
                `-profile:v high`,
                `-level 4.1`,
                `-r 30`,
                `-movflags +faststart`,
                `-pix_fmt yuv420p`,
                `-vf scale=-2:${scale}`,
                `-map_metadata -1`,
            ])
            .output(output);

        if (includeAudio) {
            command.outputOptions([
                `-acodec aac`,
                `-b:a ${audioBitrate}`,
                `-map 0:v:0`,
                `-map 0:a:0`,
            ]);
        } else {
            command.outputOptions([`-an`, `-map 0:v:0`]);
        }

        command
            .on('progress', (progress) => {
                if (progress.timemark && duration) {
                    const parts = progress.timemark.split(':');
                    const seconds = (+parts[0]) * 3600 + (+parts[1]) * 60 + parseFloat(parts[2]);
                    const percent = Math.min(Math.floor((seconds / duration) * 100), 99);
                    bar.update(percent);
                }
            })
            .on('end', () => {
                bar.update(100);
                bar.stop();
                console.log(`✅ Done: ${path.basename(output)}`);
                resolve();
            })
            .on('error', (err) => {
                bar.stop();
                console.error(`❌ Failed: ${path.basename(input)}`, err.message);
                reject(err);
            })
            .run();
    });
}

async function optimise() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const audioVideos = await glob(path.join(__dirname, '../src/assets/videos/audio/*.{mp4,MP4}'));
    const noAudioVideos = await glob(path.join(__dirname, '../src/assets/videos/no-audio/*.{mp4,MP4}'));
    const allVideos = [
        ...audioVideos.map(f => ({ input: f, audio: true })),
        ...noAudioVideos.map(f => ({ input: f, audio: false })),
    ];

    if (allVideos.length === 0) {
        console.log('⚠️  No videos found.');
        return;
    }

    // Local — just copy files without optimising
    if (ENV === 'local') {
        console.log(`\n📋 Local build — copying ${allVideos.length} video(s) to ${outputDir}...\n`);
        for (const { input, audio } of allVideos) {
            const subDir = audio ? 'audio' : 'no-audio';
            const output = path.join(outputDir, subDir, path.basename(input));
            if (fs.existsSync(output)) continue;
            copyFile(input, output);
        }
        console.log(`\n✅ All videos copied.\n`);
        return;
    }

    // Dev/prod — optimise
    const toProcess = allVideos.filter(({ input, audio }) => {
        const subDir = audio ? 'audio' : 'no-audio';
        const output = path.join(outputDir, subDir, path.basename(input));
        return !fs.existsSync(output);
    });

    if (toProcess.length === 0) {
        console.log('✅ All videos already optimised, skipping.');
        return;
    }

    console.log(`\n🎬 Optimising ${toProcess.length} video(s) for ${ENV}...\n`);

    for (const { input, audio } of toProcess) {
        const subDir = audio ? 'audio' : 'no-audio';
        const output = path.join(outputDir, subDir, path.basename(input));
        fs.mkdirSync(path.dirname(output), { recursive: true });
        await optimiseFile(input, output, audio);
    }

    console.log(`\n🚀 All videos optimised successfully.\n`);
}

optimise().catch(err => {
    console.error('❌ Video optimisation failed:', err);
    process.exit(1);
});