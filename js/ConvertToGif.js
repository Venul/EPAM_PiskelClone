/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function convertToGif(width, height, frames, animationSpeed) {
  const encoder = new GIFEncoder();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / animationSpeed);
  encoder.start();
  encoder.setSize(width, height);
  frames.forEach((frame) => {
    encoder.addFrame(frame);
  });
  encoder.finish();
  encoder.download('download.gif');
}
