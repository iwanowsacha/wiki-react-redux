import {ffmpegPath, ffprobePath} from 'ffmpeg-ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';

const setPath = () => {
    ffmpeg.setFfmpegPath(ffmpegPath?.replace('app.asar', 'app.asar.unpacked') as string);
    ffmpeg.setFfprobePath(ffprobePath?.replace('app.asar', 'app.asar.unpacked') as string);
}

export default function convertToJPG (imagePath: string, newPath: string) {
    setPath();
    /* Because .jpg images don't have transparency, the alpha channel is set to white instead of the default black */
    return new Promise<void>((resolve, reject) => {
      ffmpeg(imagePath)
      .outputOptions([
        `-vf format=yuva444p,geq='if(lte(alpha(X,Y),16),255,p(X,Y))':'if(lte(alpha(X,Y),16),128,p(X,Y))':'if(lte(alpha(X,Y),16),128,p(X,Y))'`,
        '-y'])
      .output(newPath)
      .on('error', (err) => reject(err as string))
      .on('end', () => resolve())
      .run();
    });
}