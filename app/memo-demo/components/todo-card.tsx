// 'use client'

import { Todo } from '@/app/memo-demo/page.client';
import { memo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Check, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  todo: Todo;
  toggleTodo: (id: number) => void;
};

export const MemoTodoCard = memo(function MemoTodoCard({ todo, toggleTodo }: Props) {
  return <TodoCard todo={todo} toggleTodo={toggleTodo} />;
});

export function TodoCard({ todo, toggleTodo }: Props) {
  console.log(`todo: ${todo.id} rendered.`);
  const handleTodoClick = () => {
    console.log(`todo: ${todo.id} clicked.`);
    toggleTodo(todo.id);
  };
  return (
    <Card className={`${todo.completed ? 'bg-green-700' : ''}`}>
      <CardContent>
        <p>{todo.todo}</p>
      </CardContent>
      <CardFooter>
        <Button variant={'ghost'} onClick={handleTodoClick}>
          {todo.completed ? <Check /> : <Circle />}
        </Button>
      </CardFooter>
    </Card>
  );
}
