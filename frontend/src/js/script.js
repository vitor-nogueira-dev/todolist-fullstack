const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
const inputTask = document.querySelector('.input-task');

const URL_API = 'http://localhost:3333/tasks';
const fetchTasks = async () => {
  const response = await fetch(URL_API);
  const data = await response.json();
  return data;
};

const addTask = async (e) => {
  e.preventDefault();
  const task = {
    title: inputTask.value,
  };
  await fetch(URL_API, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  loadTasks();

  inputTask.value = '';
};

const deleteTask = async (id) => {
  await fetch(`${URL_API}/${id}`, {
    method: 'delete',
  });
  loadTasks();
};

const updateTask = async (task) => {
  const { id, title, status } = task;

  await fetch(`${URL_API}/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, status }),
  });
  loadTasks();
};

const formatDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle: 'short' };
  const date = new Date(dateUTC).toLocaleString('pt-br', options);
  return date;
};
const createElement = (tag, innerText = '', innerHTML = '') => {
  const element = document.createElement(tag);
  if (innerText) {
    element.innerText = innerText;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
};

const createSelect = (value) => {
  const options = `
  <option value="pendente">pendente</option>
  <option value="em andamento">em andamento</option>
  <option value="concluída">concluída</option>`;

  const select = createElement('select', '', options);

  select.value = value;

  return select;
};

const createRow = (task) => {
  const { id, title, created_at: created, status } = task;

  const tr = createElement('tr');
  const tdTitle = createElement('td', title);
  const tdCreatedAt = createElement('td', formatDate(created));
  const tdStatus = createElement('td');
  const tdActions = createElement('td');

  const select = createSelect(status);

  select.addEventListener('change', ({ target: { value } }) =>
    updateTask({ ...task, status: value })
  );

  const editButton = createElement(
    'button',
    '',
    '<span class="material-symbols-outlined"> edit </span>'
  );
  const deleteButton = createElement(
    'button',
    '',
    '<span class="material-symbols-outlined"> delete </span>'
  );

  const editForm = createElement('form');
  const editInput = createElement('input');

  editInput.value = title;
  editForm.appendChild(editInput);

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    updateTask({ id, title: editInput.value, status });
  });

  editButton.addEventListener('click', () => {
    (tdTitle.innerText = ''), tdTitle.appendChild(editForm);
  });

  deleteButton.addEventListener('click', () => deleteTask(id));

  editButton.classList.add('btn-action');
  deleteButton.classList.add('btn-action');

  tdStatus.appendChild(select);

  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  tr.appendChild(tdTitle);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdStatus);
  tr.appendChild(tdActions);

  return tr;
};

const loadTasks = async () => {
  const tasks = await fetchTasks();
  tbody.innerHTML = '';

  tasks.forEach((task) => {
    const tr = createRow(task);
    tbody.appendChild(tr);
  });
};

loadTasks();

addForm.addEventListener('submit', addTask);
