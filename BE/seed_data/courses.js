const randomUsers = async (usersData) => {
  const users = usersData[0];
  for (let i = users.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [users[i], users[j]] = [users[j], users[i]];
  }
  const pickUser = users[Math.floor(Math.random() * users.length)];
  return pickUser.id;
};

const users = async () => {
  try {
    const result = await queryInterface.sequelize.query(
      `SELECT id FROM public."Users" WHERE role = 'admin'`
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = async () => {
  return {};
};
