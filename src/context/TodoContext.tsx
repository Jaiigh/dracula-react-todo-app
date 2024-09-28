import { createContext, useState, useEffect, ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createId from "../utils/createId";

export interface Todo {
    id : number | string;
    text : string;
    isCompleted : boolean;
    date : string;
}

interface TodoContextType {
    todos : Todo[];
    addTodo : (text : string) => void;
    completeTodo : (id : number | string) => void; 
    deleteTodo : (id : number | string) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
    children : ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const firstTodo: Todo = {
    id: 1,
    text: "Hello! Add your first todo!",
    isCompleted: false,
    date: new Date().toISOString().slice(0, 10),
  };

  const [todos, setTodos] = useState<Todo[]>(
    JSON.parse(localStorage.getItem("todos") || "[]") || [firstTodo],
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const newTodo: Todo = {
      id: createId(),
      text: text,
      isCompleted: false,
      date: currentDate,
    };
    setTodos([...todos, newTodo]);
    toast.success("Todo Added!");
  };

  const completeTodo = (id: number | string) => {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      setTodos(newTodos);
      todo.isCompleted
        ? toast.success("Todo Completed!", { theme: "colored" })
        : toast.success("Todo Restored!", { theme: "colored" });
    }
  };

  const deleteTodo = (id: number | string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    toast.error("Todo Deleted!");
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, completeTodo, deleteTodo }}>
      {children}
      <ToastContainer />
    </TodoContext.Provider>
  );
};
