"use client"

import React, { useEffect, useState } from "react"
import { ChevronDown, Search, MoreHorizontal, Edit2, Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient, deleteClient, getClients, updateClient } from "@/app/api/sales/client/server"
import { Progress } from "@/components/ui/progress"
import { Description } from "@radix-ui/react-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientApiType, ClientFormType } from "@/schema/clientSchema"
import { toast } from "sonner"
import { motion } from "framer-motion"
import AddClientForm from "@/components/AddClientForm"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { convertToCSV } from "@/lib/utils"

enum Status {
  "Inactive" = 0,
  "Pending",
  "Active"
}

type Client = ClientApiType | null;

type ClientArray = Client[];

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

const getClientStatusValue = (value: any) => {
  switch (value) {
    case 2:
      return "Active";
    case 0:
      return "Inactive";
    default:
      return "Pending"
  }
}

export default function () {
  const [clients, setClients] = useState<any>([]);
  const [isClientsLoading, setIsClientsLoading] = useState(true);
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isEditingClient, setIsEditingClient] = useState(null)
  const [isAddingClient, setIsAddingClient] = useState(false)
  const router = useRouter();
  const { data: session } = useSession();
  const memberId = Number(session?.user?.id);
  console.log(session?.user);

  const filteredClients = clients.filter((client: any) =>
    (statusFilter === "All" || client.status === getClientStatusNum(statusFilter)) &&
    Object.values(client).some((value: any) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  )

  const fetchClients = async () => {
    if (!memberId) {
      return;
    }
    const fetchedClients = await getClients(memberId);
    console.log(fetchedClients);
    if (fetchedClients && fetchedClients.data && fetchedClients.data?.length > 0) {
      const newClientData = fetchedClients.data.map(val => ({
        id: val.id,
        name: val.name,
        company: val.company,
        status: val.status,
        remarks: val.remarks,
        number: val.contactDetails[0]?.contactNumber ?? "",
        numberId: val.contactDetails[0].id,
      }));
      setClients(newClientData);
    }
    setIsClientsLoading(false);
  }

  useEffect(() => {
    fetchClients();
    setIsClientsLoading(false);
  }, [])

  const handleSave = async (updatedClient: any) => {
    const loadId = toast.loading("Updating exisitng client...");
    const updatedClientData = {
      name: updatedClient.name,
      remarks: updatedClient.remarks,
      company: updatedClient.company,
      number: updatedClient.number,
      status: updatedClient.status
    };

    try {
      const response = await updateClient(memberId, updatedClientData, updatedClient.id, updatedClient.numberId);
      if (response.status === 200) {
        fetchClients();
        toast.dismiss(loadId);
        toast.success("Successfully updated exisiting client");
      }
    } catch (e) {

    }
    setIsEditingClient(null)
    toast.dismiss(loadId);
  }

  const handleAdd = async (newClient: any) => {
    const loadId = toast.loading("Creating new client...");
    const newClientData = {
      name: newClient.name,
      description: newClient.description,
      company: newClient.company,
      number: newClient.number,
      status: newClient.status,
      behaviour: newClient.behaviour,
      dealValue: newClient.dealValue * 100,
      remarks: newClient.remarks
    };

    try {
      const response = await createClient(newClientData.name, newClientData.description, newClientData.company, newClientData.number, newClientData.status, memberId, newClientData.behaviour, newClientData.dealValue, newClientData.remarks);
      if (response.status === 200) {
        fetchClients();
        toast.dismiss(loadId);
        toast.success("Successfully created new client");
      }
    } catch (e) {

    }

    setIsAddingClient(false)
    toast.dismiss(loadId);
  }

  const handleDelete = async (clientId: number) => {
    const loadId = toast.loading("Deleting client...");
    try {
      const response = await deleteClient(memberId, clientId);
      if (response.status === 200) {
        fetchClients();
        toast.dismiss(loadId);
        toast.success("Successfully deleted client");
      }
    } catch (e) {

    }

    toast.dismiss(loadId);
  }

  const openClient = async (clientId: number) => {
    router.push(`/sales/leads/${clientId}`)
  }

  const handleDownloadCSV = () => {
    const csvContent = convertToCSV(filteredClients);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'client_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  if (isClientsLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-gray-100" style={{ height: 'calc(100% - 60px)' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center justify-center"
        >
          <Loader2 className="w-16 h-16 mb-4 text-blue-500 animate-spin" />
          <h2 className="text-2xl font-semibold mb-2">Setting up your clients</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Status: {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["All", "Active", "Inactive", "Pending"].map((status) => (
                <DropdownMenuItem key={status} onSelect={() => setStatusFilter(status)}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <AddClientForm onSave={handleAdd} />
            </DialogContent>
          </Dialog>
          <Button onClick={handleDownloadCSV} className="w-full sm:w-auto">
            Download CSV
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full bg-gray-100" style={{ height: 'calc(100% - 60px)' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center flex flex-col items-center justify-center"
            >
              <h2 className="text-2xl font-semibold mb-2">No Clients Available</h2>
              <p className="text-gray-600">Start by adding your first client.</p>
              <Button className="mt-4" onClick={() => setIsAddingClient(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </motion.div>
          </div>
        )
          : (
            filteredClients.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client: any) => (
                    <TableRow key={client.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); openClient(client.id) }}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.number}</TableCell>
                      <TableCell>{client.company}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${client.status === 2 ? 'bg-green-100 text-green-800' :
                          client.status === 0 ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {client.status === 2 ? "Active" : client.status === 0 ? "Inactive" : "Pending"}
                        </span>
                      </TableCell>
                      <TableCell>{client.remarks}</TableCell>
                      <TableCell className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Dialog open={isEditingClient && client?.id === isEditingClient || false} onOpenChange={(val) => {
                          if (val) {
                            setIsEditingClient(client.id);
                          } else {
                            setIsEditingClient(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsEditingClient(client.id) }}>
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Edit {client.name}</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Client</DialogTitle>
                            </DialogHeader>
                            <ClientForm client={client} onSave={handleSave} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(client.id) }} className="text-red-600 hover:text-red-800 hover:bg-red-100">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete {client.name}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No search results available.
                </TableCell>
              </TableRow>
            )
          )}
      </div>
    </div>
  )
}

function ClientForm({ client, onSave } : { client: any, onSave: any }) {
  const [editedClient, setEditedClient] = useState<ClientFormType>(client || {
    name: "",
    number: "",
    company: "",
    status: 2,
    remarks: "",
    numberId: ""
  })

  const handleChange = (e: any) => {
    if (e === "Active" || e === "Inactive" || e === "Pending") {
      const statusValue = getClientStatusNum(e);
      setEditedClient(prev => ({ ...prev, "status": statusValue }))
    } else {
      setEditedClient(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedClient)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <Input id="name" name="name" value={editedClient.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">Phone</label>
        <Input id="number" name="number" value={editedClient.number} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <Input id="company" name="company" value={editedClient.company} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <Select onValueChange={handleChange} defaultValue={getClientStatusValue(editedClient.status)}>
          <SelectTrigger>
            <SelectValue placeholder={getClientStatusValue(editedClient.status)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Remarks</label>
        {/*@ts-ignore*/}
        <Input id="description" name="description" value={editedClient.remarks} onChange={handleChange} />
      </div>
      <Button type="submit">{client ? 'Save Changes' : 'Add Client'}</Button>
    </form>
  )
}