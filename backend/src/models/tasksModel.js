const connection = require('./connection');
const getAll = async () => {
  const [tasks] = await connection.execute('SELECT * FROM tasks');
  return tasks;
};

const createdTask = async (task) => {
  const { title, status = 'pendente' } = task;

  const dateUTC = new Date(Date.now()).toUTCString();
  const queryInsert = 'INSERT INTO tasks(title, status, created_at) VALUES(?, ?, ?)';

  const [createTask] = await connection.execute(queryInsert, [title, status, dateUTC]);

  return { insertId: createTask.insertId };
};

const deleteTask = async (id) => {
  const queryDelete = 'DELETE FROM tasks WHERE id = ?';
  const removedTask = await connection.execute(queryDelete, [id]);
  return removedTask;
};

const updateTask = async (id, task) => {
  const { title, status } = task;
  const queryUpdate = 'UPDATE tasks SET title = ?, status = ? WHERE id = ?';
  const updateTask = await connection.execute(queryUpdate, [title, status, id]);
  return updateTask;
};

module.exports = { getAll, createdTask, deleteTask, updateTask };
