const todoList = document.getElementById('todo-list');
const addTodo = document.getElementById('add-todo');
const todoMessage = document.getElementById('todo-message');

addTodo.addEventListener('click', async (e) => {
  try {
    const todoValue = todoMessage.value;
    todoMessage.value = '';

    const jsonMessage = { message: todoValue };

    const request = await fetch('http://localhost:8080/api/v1/todo', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(jsonMessage),
    });

    const data = await request.json();

    if (data.status == 201) {
      successAlert(data.message);
      getAllTodo();
    } else {
      errorAlert(data.message);
    }
  } catch (error) {
    errorAlert('Something went wrong');
  }
});

const getAllTodo = async () => {
  const request = await fetch('http://localhost:8080/api/v1/todo');

  const data = await request.json();

  const dataMap = data.map(
    (todo) => `
    <li class="list-group-item d-flex justify-content-between p-2">
    <p >${todo.message}</p>
    <div>
    <button id="${todo.id}" type="button" class="btn btn-danger delete-button">Delete</button>
    <button  id="${todo.id}" type="button" class="btn btn-warning update-button">Update</button>
    </div>
    </li>`
  );

  todoList.innerHTML = dataMap.join('');

  const deleteButtons = document.getElementsByClassName('delete-button');
  const updateButtons = document.getElementsByClassName('update-button');

  for (let index = 0; index < deleteButtons.length; index++) {
    addDeleteEvent(deleteButtons[index]);
    addUpdateEvent(updateButtons[index]);
  }
};

const addDeleteEvent = async (deleteButton) => {
  deleteButton.addEventListener('click', async (e) => {
    const id = e.target.id;
    try {
      const request = await fetch(`http://localhost:8080/api/v1/todo/${id}`, {
        method: 'DELETE',
      });

      const data = await request.json();

      if (request.status == 200) {
        successAlert(data.message);
        getAllTodo();
      } else {
        errorAlert(data.message);
      }
    } catch (error) {
      console.log(error);
      errorAlert('Something went wrong');
    }
  });
};

const addUpdateEvent = async (updateButton) => {
  updateButton.addEventListener('click', async (e) => {
    try {
      const id = e.target.id;
      const updatedTodo = await updateAlert();
      console.log(updatedTodo);
      if (!updatedTodo.isConfirmed) {
        return;
      }
      const request = await fetch(`http://localhost:8080/api/v1/todo/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ message: updatedTodo.value }),
      });

      const data = await request.json();

      if (request.status == 200) {
        successAlert(data.message);
        getAllTodo();
      } else {
        errorAlert(data.message);
      }
    } catch (error) {
      console.log(error);
      errorAlert('Something went wrong');
    }
  });
};

const successAlert = (message) => {
  Swal.fire({
    title: message,
    icon: 'success',
    showConfirmButton: false,
    timer: 1000,
    heightAuto: false,
  });
};

const errorAlert = (message) => {
  Swal.fire({
    title: message,
    icon: 'error',
    heightAuto: false,
  });
};

const updateAlert = async () => {
  const updatedTodo = await Swal.fire({
    title: 'Enter your updated todo',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Update',
    showLoaderOnConfirm: true,
    heightAuto: false,
  });

  return updatedTodo;
};

getAllTodo();
