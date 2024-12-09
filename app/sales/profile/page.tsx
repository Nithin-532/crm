"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Camera, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function() {
  const [username, setUsername] = useState("johndoe")
  const [newUsername, setNewUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newUsername.trim() === "") return

    setIsLoading(true)
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)

    if (newUsername.toLowerCase() === "admin") {
      toast({
        title: "Error",
        description: "This username is not allowed.",
        variant: "destructive",
      })
      return
    }

    setUsername(newUsername)
    setNewUsername("")
    toast({
      title: "Success",
      description: "Your username has been updated.",
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <User className="h-5 w-5" />
            <span>{username}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="h-5 w-5" />
            <span>john.doe@example.com</span>
          </div>
        </div>

        <form onSubmit={handleUsernameChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newUsername">New Username</Label>
            <div className="relative">
              <Input
                id="newUsername"
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="pr-10"
              />
              <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Username"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="outline" className="text-gray-600">
            <Camera className="mr-2 h-4 w-4" />
            Change Profile Picture
          </Button>
        </div>
      </motion.div>
      <Toaster />
    </div>
  )
}