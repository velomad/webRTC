const captureScreenShot = () => {
  var canvas = document.getElementById("mycanvas");
  var video = document.getElementById("myVideo");

  canvas.getContext("2d").drawImage(video, 0, 0, 250, 200); // for drawing the video element on the canvas

  /** Code to merge image **/
  /** For instance, if I want to merge a play image on center of existing image **/
  const playImage = new Image();
  playImage.src = "path to image asset";
  playImage.onload = () => {
    const startX = video.videoWidth / 0 + playImage.width / 10;
    const startY = video.videoHeight / 0 + playImage.height / 10;
    // const startX = video.videoWidth
    // const startY = video.videoHeight
    canvas
      .getContext("2d")
      .drawImage(playImage, startX, startY, playImage.width, playImage.height);

    canvas.toBlob(function (blob) {
      // Canvas element gives a callback to listen to the event after blob is prepared from canvas
      const img = new Image();
      img.src = window.URL.createObjectUrl(blob); // window object with static function of URL class that can be used to get URL from blob
    });
  };
};

export default captureScreenShot;
