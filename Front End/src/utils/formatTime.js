export const formatTime = (isoString) => {
  const tanggalWaktu = new Date(isoString);

  const tahun = tanggalWaktu.getFullYear();
  const bulan = tanggalWaktu.getMonth() + 1;
  const tanggal = tanggalWaktu.getDate();

  const jam = tanggalWaktu.getHours();
  const menit = tanggalWaktu.getMinutes();
  const detik = tanggalWaktu.getSeconds();

  const hasil = `${tahun}-${padZero(bulan)}-${padZero(tanggal)} - ${padZero(
    jam
  )}:${padZero(menit)}:${padZero(detik)}`;

  return hasil;
};

function padZero(nilai) {
  return nilai < 10 ? "0" + nilai : nilai;
}
