/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [
      {
        name: 'Fadhlan',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adella',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Grace',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Alif',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Aceng',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ragil',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dian',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Farhan',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Randika',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ivan',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    const insertUsers = await queryInterface.bulkInsert('Users', users, {
      returning: true,
    })

    const password = '$2a$10$VOZdAZlTEN6tuhmMU1g1xOJ9OPvlJutSqSa0m1AT7bJC2PZgJRzVa'

    const lastThreeDigit = 100
    const auths = insertUsers.map((user, index) => ({
      email: `${user.name}@admin.sinow.com`.toLowerCase(),
      phoneNumber: `+6281234567${lastThreeDigit + index}`,
      password,
      isEmailVerified: true,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await queryInterface.bulkInsert('Auths', auths)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Auths', null, {})
  },
}
