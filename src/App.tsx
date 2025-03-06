/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>(todosFromServer);
  const [shownTodos, setShownTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todosFilter, setTodosFilter] = useState(FilterStatus.All);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [shouldDeleteCompleted, setShouldDeleteCompleted] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [todoBeingAdded, setTodoBeingAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearInput, setClearInput] = useState(false);
  const focusedTodoRef = useRef<HTMLInputElement>(null);
  const defaultInputRef = useRef<HTMLInputElement>(null);

  const showError = (errMessage: string) => {
    if (errMessage) {
      setErrorMessage(errMessage);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

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

  const deleteCompletedTodos = React.useCallback(() => {
    if (shouldDeleteCompleted) {
      const completedTodos = getCompletedTodos();

      Promise.all(completedTodos.map(todo => deleteTodo(todo)))
        .then(() => {
          setCurrentTodos(currentTodos.filter(todo => !todo.completed));
        })
        .catch(error => {
          showError('Unable to delete a todo');
          throw error;
        })
        .finally(() => {
          setShouldDeleteCompleted(false);
          defaultInputRef.current?.focus();
        });
    }
  }, [currentTodos, getCompletedTodos, shouldDeleteCompleted]);

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
        case FilterStatus.Active:
          return currentTodos.filter(todo => !todo.completed);
        case FilterStatus.Completed:
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
    deleteCompletedTodos();
  }, [shouldDeleteCompleted, deleteCompletedTodos]);

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

        <TodoList
          shownTodos={shownTodos}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          setTodoToDelete={setTodoToDelete}
          focusedTodoRef={focusedTodoRef}
          shouldDeleteCompleted={shouldDeleteCompleted}
          todoToDelete={todoToDelete}
          tempTodo={tempTodo}
        />

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
