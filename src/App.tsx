/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import classNames from 'classnames';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>(todosFromServer);
  const [shownTodos, setShownTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todosFilter, setTodosFilter] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [shouldDeleteCompleted, setShouldDeleteCompleted] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [todoBeingAdded, setTodoBeingAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearInput, setClearInput] = useState(false);
  const focusedTodoRef = useRef<HTMLInputElement>(null);
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const classNameLoader = 'modal-background has-background-white-ter';

  function showError(errMessage: string) {
    if (errMessage) {
      setErrorMessage(errMessage);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }

  const getCompletedTodos = React.useCallback(() => {
    return currentTodos.filter(todo => todo.completed);
  }, [currentTodos]);

  const deleteChosenTodo = React.useCallback(
    (currentTodoToDelete: Todo | null) => {
      if (currentTodoToDelete) {
        deleteTodo(currentTodoToDelete)
          .then(() => {
            setCurrentTodos([
              ...currentTodos.slice(
                0,
                currentTodos.indexOf(currentTodoToDelete),
              ),
              ...currentTodos.slice(
                currentTodos.indexOf(currentTodoToDelete) + 1,
              ),
            ]);
          })
          .catch(error => {
            showError('Unable to delete a todo');
            throw error;
          })
          .finally(() => {
            setTodoToDelete(null);
            defaultInputRef.current?.focus();
          });
      }
    },
    [currentTodos],
  );

  const getAndShowTodos = React.useCallback(() => {
    getTodos()
      .then(todos => {
        setTodosFromServer(todos);
        setCurrentTodos(todos);
      })
      .catch(error => {
        showError('Unable to load todos');
        throw error;
      })
      .finally(() => defaultInputRef.current?.focus());
  }, []);

  const postNewTodo = React.useCallback(
    (todoToPost: Todo | null) => {
      if (todoToPost) {
        setTodoBeingAdded(true);
        setTempTodo({
          id: 0,
          userId: 2400,
          title: todoToPost.title,
          completed: todoToPost.completed,
        });

        setErrorMessage('');

        postTodo(todoToPost)
          .then(() => {
            setCurrentTodos([...currentTodos, todoToPost]);
            setClearInput(true);
            setNewTodo(null);
          })
          .catch(error => {
            showError('Unable to add a todo');
            throw error;
          })
          .finally(() => {
            setTodoBeingAdded(false);
            setTempTodo(null);
          });
      }
    },
    [currentTodos],
  );

  useEffect(() => {
    if (!todoBeingAdded) {
      defaultInputRef.current?.focus();
    }
  }, [todoBeingAdded]);

  useEffect(() => {
    getAndShowTodos();
  }, [getAndShowTodos]);

  useEffect(() => {
    function filterTodos(filter: string) {
      switch (filter) {
        case 'active':
          return currentTodos.filter(todo => !todo.completed);
        case 'completed':
          return currentTodos.filter(todo => todo.completed);
        default:
          return currentTodos;
      }
    }

    setShownTodos(filterTodos(todosFilter));
  }, [todosFilter, currentTodos]);

  useEffect(() => {
    postNewTodo(newTodo);
  }, [newTodo, postNewTodo]);

  useEffect(() => {
    deleteChosenTodo(todoToDelete);
  }, [deleteChosenTodo, todoToDelete]);

  useEffect(() => {
    if (shouldDeleteCompleted) {
      const completedTodos = getCompletedTodos();

      Promise.all(completedTodos.map(todo => deleteTodo(todo)))
        .then(() => {
          setCurrentTodos(currentTodos.filter(todo => !todo.completed));
        })
        .catch(error => {
          showError('Unable to delete completed todos');
          throw error;
        })
        .finally(() => {
          setShouldDeleteCompleted(false);
        });
    }
  }, [
    shouldDeleteCompleted,
    currentTodos,
    getCompletedTodos,
    deleteChosenTodo,
  ]);

  useEffect(() => {
    focusedTodoRef.current?.focus();
  }, [focusedTodoRef, selectedTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          defaultInputRef={defaultInputRef}
          currentTodos={currentTodos}
          setNewTodo={setNewTodo}
          showError={showError}
          todoBeingAdded={todoBeingAdded}
          clearInput={clearInput}
          setClearInput={setClearInput}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {shownTodos.length !== 0 && (
            <div>
              {shownTodos.map(todo => (
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
                        todo === todoToDelete ||
                        (shouldDeleteCompleted && todo.completed),
                    })}
                  >
                    <div className={classNameLoader} />
                    <div className="loader" />
                  </div>
                </div>
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

        {/* Hide the footer if there are no todos */}
        {currentTodos.length !== 0 && (
          <Footer
            currentTodos={currentTodos}
            todosFilter={todosFilter}
            setTodosFilter={setTodosFilter}
            setShouldDeleteCompleted={setShouldDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
