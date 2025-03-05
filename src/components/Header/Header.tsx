import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  defaultInputRef: React.RefObject<HTMLInputElement>;
  currentTodos: Todo[];
  setNewTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  showError(errMessage: string): void;
  todoBeingAdded: boolean;
  clearInput: boolean;
  setClearInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header: React.FC<Props> = ({
  defaultInputRef,
  currentTodos,
  setNewTodo,
  showError,
  todoBeingAdded,
  clearInput,
  setClearInput,
}) => {
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedValue = inputValue.trim();

    if (trimmedValue) {
      setNewTodo({
        id: Math.max(...currentTodos.map(todo => todo.id)) + 1,
        userId: 2400,
        title: trimmedValue,
        completed: false,
      });
    } else {
      showError('Title should not be empty');
    }
  }

  useEffect(() => {
    if (clearInput) {
      setInputValue('');
      setClearInput(false);
    }
  }, [clearInput, setClearInput]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !currentTodos.some(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={defaultInputRef}
          disabled={todoBeingAdded}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </form>
    </header>
  );
};
