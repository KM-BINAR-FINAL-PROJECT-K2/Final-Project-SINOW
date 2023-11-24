const imagekit = require("../lib/imagekit");
const ApiError = require("../utils/ApiError");

const uploadImageAndVideo = async (files, next) => {
  try {
    const imageFile = files.image[0];
    const videoFile = files.video[0];

    if (!isImageFile(imageFile)) {
      return next(
        new ApiError("Harus mengirim file gambar di field image", 400)
      );
    }

    if (!isVideoFile(videoFile)) {
      return next(
        new ApiError("Harus mengirim file video di field video", 400)
      );
    }

    console.log(imageFile);
    console.log(`Image-${Date.now()}.${getExtension(imageFile)}`);

    const uploadedImage = await imagekit.upload({
      file: imageFile.buffer,
      fileName: `Image-${Date.now()}.${getExtension(imageFile)}`,
    });

    if (!uploadedImage) {
      return next(new ApiError("Gagal upload gambar", 400));
    }

    const uploadedVideo = await imagekit.upload({
      file: videoFile.buffer,
      fileName: `Video-${Date.now()}.${getExtension(videoFile)}`,
    });

    if (!uploadedVideo) {
      return next(new ApiError("Gagal upload video", 400));
    }

    return {
      imageUrl: uploadedImage.url,
      videoUrl: uploadedVideo.url,
    };
  } catch (error) {
    console.error(error);
    return next(new ApiError(error.message, 500));
  }
};

const uploadVideo = async (file, next) => {
  try {
    if (!isVideoFile(file)) {
      return next(new ApiError("Harus mengisi file video di kolom video", 400));
    }
    const extension = getExtension(file);

    const uploadedVideo = await imagekit.upload({
      file: file.buffer,
      fileName: `Video-${Date.now()}.${extension}`,
    });

    if (!uploadedVideo) {
      return next(new ApiError("Gagal upload video", 400));
    }

    return {
      videoUrl: uploadedVideo.url,
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

module.exports = {
  uploadImageAndVideo,
  uploadVideo,
  uploadImage,
};
