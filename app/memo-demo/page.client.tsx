'use client';

import { MemoTodoCard } from '@/app/memo-demo/components/todo-card';
import { useCallback, useEffect, useState } from 'react';

export type Todo = {
  completed: boolean;
  id: number;
  userId: number;
  todo: string;
};

export function MemoDemoPageClient() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // 從 dummyjson 取得 data
  useEffect(() => {
    fetch('https://dummyjson.com/todos')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setTodos(res.todos);
      });
  }, []);

  // useCallback 用來保持 toggleTodo 的函式參考穩定。
  // 這在將函式作為 props 傳給 React.memo 元件時很重要，
  // 否則每次 render 都會產生新的 function reference，
  // React.memo 會判定 props 改變而重新 render。
  const toggleTodo = useCallback((id: number) => {
    console.log(`todo: ${id} toggled.`);
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    });
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-4 flex flex-col items-center gap-8">
        <h2 className="text-4xl">Memo Demo - Todo List</h2>
        {/* Grid Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {todos.map((todo) => {
            return <MemoTodoCard key={todo.id} todo={todo} toggleTodo={toggleTodo} />;
          })}
        </section>
      </main>
    </div>
  );
}
