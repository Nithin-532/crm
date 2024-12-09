"use client"

import * as React from "react"
import { ArrowDown, ArrowRight, ArrowUp, Check, Clock, Circle, FilterX, MoreHorizontal, Plus, Search, Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TaskType = "Documentation" | "Bug" | "Feature"
type TaskStatus = "Todo" | "In Progress" | "Backlog" | "Canceled" | "Done"
type TaskPriority = "Low" | "Medium" | "High"

type Task = {
  id: string
  type: TaskType
  title: string
  status: TaskStatus
  priority: TaskPriority
}

const initialTasks: Task[] = [
  {
    id: "TASK-8782",
    type: "Documentation",
    title: "You can't compress the program without quantifying the open-source SSD...",
    status: "In Progress",
    priority: "Medium"
  },
  {
    id: "TASK-7878",
    type: "Documentation",
    title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: "Backlog",
    priority: "Medium"
  },
  {
    id: "TASK-7839",
    type: "Bug",
    title: "We need to bypass the neural TCP card!",
    status: "Todo",
    priority: "High"
  },
  {
    id: "TASK-5562",
    type: "Feature",
    title: "The SAS interface is down, bypass the open-source pixel so we can back ...",
    status: "Backlog",
    priority: "Medium"
  },
  {
    id: "TASK-8686",
    type: "Feature",
    title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
    status: "Canceled",
    priority: "Medium"
  },
  {
    id: "TASK-1280",
    type: "Bug",
    title: "Use the digital TLS panel, then you can transmit the haptic system!",
    status: "Done",
    priority: "High"
  },
  {
    id: "TASK-7262",
    type: "Feature",
    title: "The UTF8 application is down, parse the neural bandwidth so we can back...",
    status: "Done",
    priority: "High"
  },
]

export default function TaskList() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [filter, setFilter] = React.useState("")
  const [isAddingTask, setIsAddingTask] = React.useState(false)
  const [newTask, setNewTask] = React.useState<Partial<Task>>({
    type: "Feature",
    status: "Todo",
    priority: "Medium"
  })
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(filter.toLowerCase()) ||
    task.id.toLowerCase().includes(filter.toLowerCase())
  )

  const handleAddTask = () => {
    if (newTask.title) {
      const task: Task = {
        id: `TASK-${Math.floor(Math.random() * 10000)}`,
        type: newTask.type as TaskType,
        title: newTask.title,
        status: newTask.status as TaskStatus,
        priority: newTask.priority as TaskPriority
      }
      setTasks([...tasks, task])
      setIsAddingTask(false)
      setNewTask({ type: "Feature", status: "Todo", priority: "Medium" })
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`w-full p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back!</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Here's a list of your tasks for this month!</p>
          </div>
          {/* <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className={`${isDarkMode ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-black hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button> */}
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-2 top-2.5 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input
              placeholder="Filter tasks..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`pl-8 ${isDarkMode ? 'bg-transparent border-gray-800 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-black placeholder:text-gray-400'}`}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`${isDarkMode ? 'border-gray-800 bg-transparent text-white hover:bg-gray-800' : 'border-gray-300 bg-white text-black hover:bg-gray-100'}`}>
                <Clock className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-[200px] ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <DropdownMenuItem>Todo</DropdownMenuItem>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
              <DropdownMenuItem>Done</DropdownMenuItem>
              <DropdownMenuItem>Canceled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`${isDarkMode ? 'border-gray-800 bg-transparent text-white hover:bg-gray-800' : 'border-gray-300 bg-white text-black hover:bg-gray-100'}`}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-[200px] ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <DropdownMenuItem>High</DropdownMenuItem>
              <DropdownMenuItem>Medium</DropdownMenuItem>
              <DropdownMenuItem>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className={`${isDarkMode ? 'border-gray-800 bg-transparent text-white hover:bg-gray-800' : 'border-gray-300 bg-white text-black hover:bg-gray-100'}`}>
            <Plus className="mr-2 h-4 w-4" />
            View
          </Button>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className={isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className={`${isDarkMode ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-black border-gray-300'}`}>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Add a new task to your list. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className={`col-span-3 ${isDarkMode ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newTask.type}
                    onValueChange={(value: TaskType) => setNewTask({ ...newTask, type: value })}
                  >
                    <SelectTrigger className={`col-span-3 ${isDarkMode ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`}>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}>
                      <SelectItem value="Documentation">Documentation</SelectItem>
                      <SelectItem value="Bug">Bug</SelectItem>
                      <SelectItem value="Feature">Feature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: TaskStatus) => setNewTask({ ...newTask, status: value })}
                  >
                    <SelectTrigger className={`col-span-3 ${isDarkMode ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`}>
                      <SelectValue placeholder="Select task status" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Backlog">Backlog</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: TaskPriority) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger className={`col-span-3 ${isDarkMode ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`}>
                      <SelectValue placeholder="Select task priority" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTask} className={isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className={`rounded-lg border ${isDarkMode ? 'border-gray-800' : 'border-gray-300'}`}>
          <div className={`grid grid-cols-[25px_100px_120px_1fr_150px_150px_50px] gap-3 p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            <div><Checkbox className="opacity-0" /></div>
            <div>Task</div>
            <div>Title</div>
            <div></div>
            <div>Status</div>
            <div>Priority</div>
            <div></div>
          </div>
          
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`grid grid-cols-[25px_100px_120px_1fr_150px_150px_50px] gap-3 p-4 items-center border-t ${isDarkMode ? 'border-gray-800 group hover:bg-gray-800/50' : 'border-gray-200 group hover:bg-gray-100'}`}
            >
              <div>
                <Checkbox className={isDarkMode ? 'border-gray-700' : 'border-gray-300'} />
              </div>
              <div className="text-sm">{task.id}</div>
              <div>
                <Badge 
                  variant="outline" 
                  className={
                    task.type === "Documentation" ? "border-blue-500 text-blue-500" :
                    task.type === "Bug" ? "border-red-500 text-red-500" :
                    "border-green-500 text-green-500"
                  }
                >
                  {task.type}
                </Badge>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{task.title}</div>
              <div className="flex items-center gap-2 text-sm">
                {task.status === "Todo" && <Circle className="h-4 w-4" />}
                {task.status === "In Progress" && <Clock className="h-4 w-4 text-blue-500" />}
                {task.status === "Done" && <Check className="h-4 w-4 text-green-500" />}
                {task.status === "Canceled" && <FilterX className="h-4 w-4 text-red-500" />}
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{task.status}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {task.priority === "High" ? <ArrowUp className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{task.priority}</span>
              </div>
              <div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}