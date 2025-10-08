let users = [
  { id: 1, name: 'Sample User 1', email: 'sample1@test.com' },
  { id: 2, name: 'Sample User 2', email: 'sample2@test.com' },
];

const getUsers = (req, res) => {
  res.status(200).json(users);
};

const createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id: newId, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = {
  getUsers,
  createUser,
};