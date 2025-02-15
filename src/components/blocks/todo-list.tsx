import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tasksService, type Task } from '@/lib/database'
import { useToast } from '@/hooks/use-toast'

export function TodoList() {
  const [newTodo, setNewTodo] = useState('')
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium')
  const [todos, setTodos] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const tasks = await tasksService.getTasks()
      setTodos(tasks)
    } catch (error) {
      toast({
        title: "Error loading tasks",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    try {
      const task = await tasksService.createTask({
        title: newTodo,
        completed: false,
        priority: newPriority,
        created_at: new Date().toISOString(),
      })
      
      setTodos([task, ...todos])
      setNewTodo('')
      toast({
        title: "Task added",
        description: "Your new task has been created",
      })
    } catch (error) {
      toast({
        title: "Error adding task",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await tasksService.updateTask(id, { completed })
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTask : todo
      ))
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="p-6 bg-amber-50 dark:bg-zinc-900 border-2 border-amber-900/20">
          <div className="flex justify-center">
            <span className="font-mono text-amber-900">Loading tasks...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card className="p-6 bg-amber-50 dark:bg-zinc-900 border-2 border-amber-900/20">
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="font-mono border-2 border-amber-900/20 bg-white dark:bg-zinc-800"
          />
          <Select
            value={newPriority}
            onValueChange={(value: Task['priority']) => setNewPriority(value)}
          >
            <SelectTrigger className="w-[120px] font-mono border-2 border-amber-900/20 bg-white dark:bg-zinc-800">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={addTodo}
            className="bg-amber-800 hover:bg-amber-900 text-white font-mono"
          >
            Add Task
          </Button>
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 border-2 border-amber-900/20 rounded-lg bg-white dark:bg-zinc-800 ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={(checked) => toggleTodo(todo.id, checked as boolean)}
                className="border-2 border-amber-900"
              />
              <span
                className={`flex-1 font-mono ${
                  todo.completed ? 'line-through text-amber-900/60' : 'text-amber-900'
                }`}
              >
                {todo.title}
              </span>
              <Badge className={`${getPriorityColor(todo.priority)} text-white font-mono`}>
                {todo.priority}
              </Badge>
            </div>
          ))}
          
          {todos.length === 0 && (
            <div className="text-center p-4 text-amber-900/60 font-mono">
              No tasks yet. Add one above!
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}