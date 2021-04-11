
import * as os from 'os';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as admin from 'firebase-admin';

export async function convert2YT() {
  const bucket = admin.storage().bucket();
  const [videoFiles] = await bucket.getFiles({ prefix: 'articuno' });
  const [imageFiles] = await bucket.getFiles({ prefix: 'articuno/images' });
  const video = videoFiles.find((o) => o.name.includes('webm'));
  const image = imageFiles.find((o) => ['.jpg', '.jpeg'].some(ext => o.name.includes(ext)));

  if (video && image) {
    const name: any = image.name.split('/').slice(-1);
    const tempImagePath = path.join(os.tmpdir(), name);

    const videoStream = bucket.file(video.name).createReadStream();
    await bucket.file(image.name).download({ destination: tempImagePath });

    ffmpeg(videoStream)
      .videoCodec('libx264')
      .audioCodec('copy')
      .input(tempImagePath)
      .inputOption('-loop 1')
      .outputOptions(['-preset medium', '-crf 18', '-tune stillimage', '-shortest'])
      .on('progress', function (progress) {
        if (progress.percent) {
          console.log(`Rendering: ${progress.percent}% done`)
        }
      })
      .on('codecData', function (data) {
        console.log('codecData=', data);
      })
      .on('end', function () {
        console.log('Video has been converted succesfully');
      })
      .on('error', function (err) {
        console.log('errer rendering video: ' + err.message);
      })
      //run ffmpeg command
      .output('output.mkv').run();
  }
}
