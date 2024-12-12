"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const behaviorOptions = ["cool", "hot-headed", "professional", "indecisive"]
const statusOptions = [
  { value: 2, label: "Active" },
  { value: 0, label: "Inactive" },
  { value: 1, label: "Pending" }
]

const getClientStatusNum = (value: any) => {
  switch (value) {
    case "Active":
      return 2;
    case "Inactive":
      return 0;
    default:
      return 1
  }
}

export default function AddClientForm({ onSave }: { onSave: any }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company: "",
    number: "",
    status: 2,
    memberId: 1, // Assuming a default value, adjust as needed
    behaviour: "professional",
    dealValue: 0,
    remarks: ""
  })

  const handleChange = (field: string, value: string | number) => {
    if (field === "status") {
      const statusValue = getClientStatusNum(value);
      setFormData(prev => ({ ...prev, [field]: statusValue }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData)
  }

  return (
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Phone Number</Label>
              <Input
                id="number"
                type="tel"
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status.toString()}
                onValueChange={(value) => handleChange('status', parseInt(value))}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="behaviour">Behavior</Label>
              <Select
                value={formData.behaviour}
                onValueChange={(value) => handleChange('behaviour', value)}
              >
                <SelectTrigger id="behaviour">
                  <SelectValue placeholder="Select behavior" />
                </SelectTrigger>
                <SelectContent>
                  {behaviorOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dealValue">Deal Value</Label>
              <Input
                id="dealValue"
                type="number"
                value={formData.dealValue}
                onChange={(e) => handleChange('dealValue', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Add Client</Button>
        </CardFooter>
      </form>
  )
}