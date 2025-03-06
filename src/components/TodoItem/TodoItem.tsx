/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

const classNameLoader = 'modal-background has-background-white-ter';

type Props = {
  todo: Todo;
  selectedTodo?: Todo;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | undefined>>;
  setTodoToDelete: React.Dispatch<React.SetStateAction<Todo | null>>;
  focusedTodoRef: React.RefObject<HTMLInputElement>;
  shouldDeleteCompleted: boolean;
  todoToDelete: Todo | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo,
  setSelectedTodo,
  setTodoToDelete,
  focusedTodoRef,
  shouldDeleteCompleted,
  todoToDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed && true}
        />
      </label>

      {todo !== selectedTodo ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodo(todo)}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => setTodoToDelete(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
            onBlur={() => setSelectedTodo(undefined)}
            ref={focusedTodoRef}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo === todoToDelete || (shouldDeleteCompleted && todo.completed),
        })}
      >
        <div className={classNameLoader} />
        <div className="loader" />
      </div>
    </div>
  );
};
