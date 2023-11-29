const imagekit = require("../lib/imagekit");
const ApiError = require("./ApiError");
const ffmpeg = require("fluent-ffmpeg");

const uploadVideo = async (file, next) => {
  try {
    if (!isVideoFile(file)) {
      return next(new ApiError("Harus mengisi file video di kolom video", 400));
    }
    const extension = getExtension(file);

    const compressedVideo = await compressVideo(file.buffer);

    const uploadedVideo = await imagekit.upload({
      file: compressedVideo,
      fileName: `Video-${Date.now()}.${extension}`,
    });

    if (!uploadedVideo) {
      return next(new ApiError("Gagal upload video", 400));
    }

    return {
      videoUrl: uploadedVideo.url,
      videoDuration: uploadedVideo.duration,
    };
  } catch {
    return next(new ApiError(error.message, 500));
  }
};

const uploadImage = async (file, next) => {
  try {
    if (!isImageFile(file)) {
      return next(new ApiError("Harus mengisi file image di kolom image", 400));
    }
    const extension = getExtension(file);

    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: `Image-${Date.now()}.${extension}`,
    });

    if (!uploadedImage) {
      return next(new ApiError("Gagal upload image", 400));
    }

    return {
      imageUrl: uploadedImage.url,
    };
  } catch {
    return next(new ApiError(error.message, 500));
  }
};
const isVideoFile = (file) => {
  return file.mimetype.startsWith("video/");
};

const isImageFile = (file) => {
  return file.mimetype.startsWith("image/");
};

const getExtension = (file) => {
  const split = file.originalname.split(".");
  return split[split.length - 1];
};

const compressVideo = async (videoBuffer) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg();
    ffmpegCommand
      .input(videoBuffer)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions(["-preset veryfast"])
      .on("end", () => {
        console.log("Video compressed successfully");
        resolve(ffmpegCommand.pipe());
      })
      .on("error", (err) => {
        console.error("Error compressing video:", err);
        reject(err);
      })
      .toFormat("mp4")
      .pipe();
  });
};

module.exports = {
  uploadVideo,
  uploadImage,
};
