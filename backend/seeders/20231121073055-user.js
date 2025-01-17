/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [
      {
        name: 'Toto',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Awan',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Asep',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jojo',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ilyas',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Kukuh',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Albin',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Juki',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adi',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adit',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    const insertUsers = await queryInterface.bulkInsert('Users', users, {
      returning: true,
    })

    const password = '$2a$10$VOZdAZlTEN6tuhmMU1g1xOJ9OPvlJutSqSa0m1AT7bJC2PZgJRzVa'

    const lastThreeDigit = 200
    const auths = insertUsers.map((user, index) => ({
      email: `${user.name}@sinow.com`.toLowerCase(),
      phoneNumber: `+6281234567${lastThreeDigit + index}`,
      password,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
    }))

    await queryInterface.bulkInsert('Auths', auths)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Auths', null, {})
  },
}
