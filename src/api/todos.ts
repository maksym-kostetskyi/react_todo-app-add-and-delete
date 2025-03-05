import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2400;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const postTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos`, {
    id: todo.id,
    title: todo.title,
    userId: 2400,
    completed: todo.completed,
  });
};

export const deleteTodo = (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};
