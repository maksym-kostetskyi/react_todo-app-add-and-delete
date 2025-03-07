/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoItem } from '../TodoItem';

const classNameLoader = 'modal-background has-background-white-ter';

type Props = {
  shownTodos: Todo[];
  selectedTodo?: Todo;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | undefined>>;
  setTodoToDelete: React.Dispatch<React.SetStateAction<Todo | null>>;
  focusedTodoRef: React.RefObject<HTMLInputElement>;
  shouldDeleteCompleted: boolean;
  todoToDelete: Todo | null;
  tempTodo: Todo | null;
  todoToUpdate: Todo | null;
  setTodoToUpdate: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoList: React.FC<Props> = ({
  shownTodos,
  selectedTodo,
  setSelectedTodo,
  setTodoToDelete,
  focusedTodoRef,
  shouldDeleteCompleted,
  todoToDelete,
  tempTodo,
  todoToUpdate,
  setTodoToUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {shownTodos.length !== 0 && (
        <div>
          {shownTodos.map(todo => (
            <TodoItem
              todo={todo}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              setTodoToDelete={setTodoToDelete}
              focusedTodoRef={focusedTodoRef}
              shouldDeleteCompleted={shouldDeleteCompleted}
              todoToDelete={todoToDelete}
              key={todo.id}
              todoToUpdate={todoToUpdate}
              setTodoToUpdate={setTodoToUpdate}
            />
          ))}
        </div>
      )}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            'todo completed': tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          {/* overlay will cover the todo while it is being deleted or updated */}

          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className={classNameLoader} />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
