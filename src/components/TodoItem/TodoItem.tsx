/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
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
  todoToUpdate: Todo | null;
  setTodoToUpdate: React.Dispatch<React.SetStateAction<Todo | null>>;
  shouldToggleAllCompleted: boolean;
  currentTodos: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo,
  setSelectedTodo,
  setTodoToDelete,
  focusedTodoRef,
  shouldDeleteCompleted,
  todoToDelete,
  todoToUpdate,
  setTodoToUpdate,
  shouldToggleAllCompleted,
  currentTodos,
}) => {
  const [inputValue, setInputValue] = useState(todo.title);
  const [currentToggle, setCurrentToggle] = useState(
    currentTodos.some(toDo => !toDo.completed),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlurOrSubmit = () => {
    if (inputValue !== todo.title) {
      if (inputValue === '') {
        setTodoToDelete(todo);
      } else {
        setTodoToUpdate({
          id: todo.id,
          title: inputValue.trim(),
          userId: 2400,
          completed: todo.completed,
        });
      }
    }

    if (inputValue === todo.title) {
      setSelectedTodo(undefined);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue(todo.title);
      setSelectedTodo(undefined);
    }
  };

  useEffect(() => {
    setCurrentToggle(currentTodos.some(toDo => !toDo.completed));
  }, [currentTodos]);

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
          checked={todo.completed}
          onChange={() =>
            setTodoToUpdate({
              id: todo.id,
              title: todo.title,
              userId: 2400,
              completed: !todo.completed,
            })
          }
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
        <form
          onSubmit={e => {
            e.preventDefault();
            handleBlurOrSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlurOrSubmit}
            onKeyUp={handleKeyUp}
            ref={focusedTodoRef}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo === todoToDelete ||
            todo.id === todoToUpdate?.id ||
            (shouldDeleteCompleted && todo.completed) ||
            (shouldToggleAllCompleted && todo.completed !== currentToggle),
        })}
      >
        <div className={classNameLoader} />
        <div className="loader" />
      </div>
    </div>
  );
};
