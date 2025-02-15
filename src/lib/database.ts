import { Database } from '@altanlabs/database'

const API_BASE_URL = 'https://api.altan.ai/galaxia/hook/BdBWUF'
const BASE_ID = 'a7155cbe-74fb-4569-8ba6-fbc372df9dd2'
const TASKS_TABLE_ID = '57616210-4459-4e35-962d-8bc4c20110dc'

export const db = new Database({
  baseURL: API_BASE_URL,
  baseId: BASE_ID,
})

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  due_date?: string
}

export const tasksService = {
  async getTasks() {
    const response = await db.records.list(TASKS_TABLE_ID)
    return response.data as Task[]
  },

  async createTask(task: Omit<Task, 'id'>) {
    const response = await db.records.create(TASKS_TABLE_ID, task)
    return response.data as Task
  },

  async updateTask(id: string, task: Partial<Task>) {
    const response = await db.records.update(TASKS_TABLE_ID, id, task)
    return response.data as Task
  },

  async deleteTask(id: string) {
    await db.records.delete(TASKS_TABLE_ID, id)
  }
}