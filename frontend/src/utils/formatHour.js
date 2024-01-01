export const convertSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hourString = hours > 0 ? `${hours} jam` : "0 jam";
  const minuteString = minutes > 0 ? `${minutes} menit` : "0 menit";
  const secondString =
    remainingSeconds > 0 ? `${remainingSeconds} detik` : "0 detik";

  if (hours > 0) {
    return `${hourString} : ${minuteString || "0 menit"} ${
      secondString && `: ${secondString}`
    }`;
  } else if (!hours && minutes > 0) {
    return `${minuteString} ${secondString && `: ${secondString}`}`;
  }

  return secondString;
};

// Contoh penggunaan:
const seconds = 0;
console.log(convertSeconds(seconds));
