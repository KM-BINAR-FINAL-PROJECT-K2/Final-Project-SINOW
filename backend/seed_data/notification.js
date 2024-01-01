const data = []

for (let i = 11; i < 20; i += 1) {
  data.push({
    type: 'Promosi',
    title: 'Dapatkan potongan 50% untuk kategori UI/UX',
    content: 'Segera dapatkan potongan sebelum kehabisan',
    userId: i,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  data.push({
    type: 'Pengumuman',
    title: 'Versi lebih baru tersedia',
    content:
      'Versi 1.1.2 kini sudah tersedia, update aplikasi untuk menikmati fitur baru',
    userId: i,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  data.push({
    type: 'Promosi',
    title:
      'Dapatkan potongan 10% untuk kategori Data Science selama bulan April',
    content: 'Segera dapatkan potongan sebelum kehabisan',
    userId: i,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  data.push({
    type: 'Promosi',
    title: 'Diskon Ramadan Dapatkan potongan 35%',
    content: 'Ngabuburit bersama SINOW nikmati potongan harga hingga 35%',
    userId: i,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

data.push({
  type: 'Notifikasi',
  title: 'Data profil berhasil diperbarui',
  content: 'Data profil diperbarui pada tanggal 21/11/2023 12:00',
  userId: 11,
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

data.push({
  type: 'Notifikasi',
  title: 'Password berhasil diubah',
  content: 'passwsord berhasil diubah pada tanggal 23/11/2023 12:00',
  userId: 11,
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

data.push({
  type: 'Notifikasi',
  title: 'Pembayaran sukses',
  content: 'Sukses membeli course "Belajar Android Dasar"',
  userId: 12,
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

module.exports = data
