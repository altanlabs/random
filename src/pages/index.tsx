import { TodoList } from "@/components/blocks/todo-list"

export default function IndexPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-mono mb-2 text-amber-900 dark:text-amber-100">
          Retro Todo List
        </h1>
        <p className="text-amber-700 dark:text-amber-300 font-mono">
          Keep track of your tasks in style
        </p>
      </div>
      <TodoList />
    </div>
  )
}