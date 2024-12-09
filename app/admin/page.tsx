"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Plus, Trash, Menu, Edit, LogOut, EyeOff, Eye } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { toCapitalise } from "@/lib/utils"
import { signOutAuth } from "../api/auth/route"
import { createMember, getTeams, updateMember } from "../api/member/server"
import { TeamMembersSkeleton } from "@/components/TeamMembersSkeleton"
import { toast } from "sonner"

type TeamMember = {
  id: number
  username: string
  password: string
  number: string
  teamId: number
  team: string
  firstname: string
  lastname: string
  status: "Active" | "Inactive"
}

const Roles = {
  0: "Admin",
  1: "Sales"
}

enum TeamRoles {
  'Sales' = 1
}

const AvailableTeams = [{ id: 1, name: 'Sales' }];

export default function () {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>()
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<string | number | null>(null)
  const [teams, setTeams] = useState<any>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    username: "",
    password: "",
    number: "",
    teamId: 1,
    team: "",
    firstname: "",
    lastname: "",
    status: "Active"
  })
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddMemberPassword, setShowAddMemberPassword] = useState(false);
  const [showEditingMemberPassword, setShowEditingMemberPassword] = useState(false);
  const router = useRouter()
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (teamMembers && teamMembers?.length > 0) {
      const filtered = teamMembers.filter(member =>
        (selectedTeam ? member.teamId === selectedTeam : true) &&
        (member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.number.includes(searchQuery))
      )
      setFilteredMembers(filtered)
    } else {
      setFilteredMembers([])
    }
  }, [searchQuery, selectedTeam, teamMembers])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTeamFilter = (team: string | number | null) => {
    setSelectedTeam(team)
  }

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await getTeams();
      if (response.status === 200 && response.data) {
        const newTeams = response.data;
        console.log(newTeams);
        setTeams(newTeams);
        const newMembers = newTeams?.length > 0
          ? newTeams.flatMap(team => team.members || [])
          : [];
        console.log(newMembers);
        setTeamMembers(newMembers);
      }
    } catch (e) {

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (session) {
      fetchTeams();
    }
  }, [])

  const handleAddMember = async () => {
    const loadId = toast.loading("Adding new member...");
    try {
      const response = await createMember(newMember.username, newMember.password, newMember.firstname, newMember.lastname, newMember.number, newMember.teamId, newMember.status);
      if (response.status === 200) {
        const data = response.data;
        setTeamMembers([...teamMembers, data]);
        toast.dismiss(loadId);
        toast.success("Successfully added new client");
        console.log(data);
      }
    } catch (e) {
      toast.dismiss(loadId);
      toast.error("Error while adding new client");
    } finally {
      toast.dismiss(loadId);
    }
    setIsAddMemberOpen(false)
    setNewMember({
      username: "",
      password: "",
      number: "",
      teamId: 1,
      firstname: "",
      lastname: "",
      team: "",
      status: "Active"
    })
  }

  const handleEditMember = async () => {
    const loadId = toast.loading("Editing member...");
    if (editingMember) {
      try {
        const response = await updateMember(editingMember.username, editingMember.password, editingMember.firstname, editingMember.lastname, editingMember.teamId, editingMember.id, editingMember.status);
        if (response.status === 200) {
          const data = response.data;
          toast.dismiss(loadId);
          toast.success("Successfully updated client");
          console.log(data);
        }
      } catch (e) {
        toast.dismiss(loadId);
        toast.error("Error while updating client");
      } finally {
        toast.dismiss(loadId);
        setIsEditMemberOpen(false)
        setEditingMember(null)
      }
    }
  }

  const handleDeleteMember = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id))
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden w-screen">
        <Sidebar className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <SidebarHeader>
            <h2 className="text-xl font-bold p-4">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-2 p-4">
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/admin')}>
                Team Members
              </Button>
              {/* <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/admin/settings')}>
                Settings
              </Button> */}
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button variant="outline" className="w-full" onClick={async () => await signOutAuth()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <header className="bg-white shadow-sm z-10">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button size="icon" className="md:hidden" onClick={toggleSidebar}>
                    <Menu className="h-6 w-6" />
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                {isLoading ? (
                  <TeamMembersSkeleton />
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Button
                        variant={selectedTeam === null ? "default" : "outline"}
                        onClick={() => handleTeamFilter(null)}
                      >
                        All Teams
                      </Button>
                      {teams && teams.length > 0 && teams.map((team: any) => (
                        <Button
                          key={team.id}
                          variant={selectedTeam === team.id ? "default" : "outline"}
                          onClick={() => handleTeamFilter(team.id)}
                        >
                          {toCapitalise(team.name)}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <Search className="w-4 h-4 text-gray-500" />
                        <Input
                          placeholder="Search team members..."
                          value={searchQuery}
                          onChange={handleSearch}
                          className="max-w-sm"
                        />
                      </div>
                      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Team Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                            <DialogDescription>
                              Add a new team member to your organization.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={newMember.username}
                                onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="password" className="text-right">
                                Password
                              </Label>
                              <div className="col-span-3 flex">
                                <Input
                                  id="password"
                                  type={showAddMemberPassword ? "text" : "password"}
                                  value={newMember.password}
                                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                                  className="flex-grow"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="ml-2"
                                  onClick={() => setShowAddMemberPassword(!showAddMemberPassword)}
                                >
                                  {showAddMemberPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="firstname" className="text-right">
                                First Name
                              </Label>
                              <Input
                                id="firstname"
                                value={newMember.firstname}
                                onChange={(e) => setNewMember({ ...newMember, firstname: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="lastname" className="text-right">
                                Last Name
                              </Label>
                              <Input
                                id="lastname"
                                value={newMember.lastname}
                                onChange={(e) => setNewMember({ ...newMember, lastname: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="number" className="text-right">
                                Phone
                              </Label>
                              <Input
                                id="number"
                                type="tel"
                                value={newMember.number}
                                onChange={(e) => setNewMember({ ...newMember, number: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            {/* <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                              <Input
                                id="role"
                                value={newMember.teamId}
                                type="number"
                                onChange={(e) => setNewMember({ ...newMember, teamId: Number(e.target.value) })}
                                className="col-span-3"
                              />
                            </div> */}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="team" className="text-right">
                                Team
                              </Label>
                              <Select
                                value={newMember.team}
                                onValueChange={(value) => setNewMember({ ...newMember, team: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select a team" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AvailableTeams.map((team) => (
                                    <SelectItem key={team.id} value={team.name}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="status" className="text-right">
                                Status
                              </Label>
                              <Select
                                value={newMember.status}
                                onValueChange={(value: "Active" | "Inactive") => setNewMember({ ...newMember, status: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleAddMember}>Add Member</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {teamMembers && teamMembers.length > 0 ? (
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-center">Name</TableHead>
                              <TableHead className="text-center">Username</TableHead>
                              <TableHead className="text-center">Phone</TableHead>
                              <TableHead className="text-center">Team</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMembers && filteredMembers.length > 0 && filteredMembers.map((member) => (
                              <TableRow key={member.id} className="cursor-pointer" onClick={() => router.push(`/admin/member/${member.id}`)}>
                                <TableCell className="text-center">{`${toCapitalise(member.firstname)} ${toCapitalise(member.lastname)}`}</TableCell>
                                <TableCell className="text-center">{member.username}</TableCell>
                                <TableCell className="text-center">{member.number}</TableCell>
                                <TableCell className="text-center">{Roles[member.teamId]}</TableCell>
                                <TableCell className="text-center">{member.status}</TableCell>
                                <TableCell className="text-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => {
                                        setEditingMember(member)
                                        setIsEditMemberOpen(true)
                                      }}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit member
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="text-red-600"
                                      >
                                        <Trash className="mr-2 h-4 w-4" /> Delete member
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>) : (
                      <div className="text-center py-10">
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No team members</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new team member.</p>
                        <div className="mt-6">
                          <Button onClick={() => setIsAddMemberOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Team Member
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update the details of the team member.
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingMember.username}
                  onChange={(e) => setEditingMember({ ...editingMember, username: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3 flex">
                  <Input
                    id="edit-password"
                    type={showEditingMemberPassword ? "text" : "password"}
                    value={editingMember.password}
                    onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })}
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => setShowEditingMemberPassword(!showEditingMemberPassword)}
                  >
                    {showEditingMemberPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-first-name" className="text-right">
                  First Name
                </Label>
                <Input
                  id="edit-first-name"
                  value={editingMember.firstname}
                  onChange={(e) => setEditingMember({ ...editingMember, firstname: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-last-name" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="edit-last-name"
                  value={editingMember.lastname}
                  onChange={(e) => setEditingMember({ ...editingMember, lastname: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-number" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-number"
                  type="tel"
                  value={editingMember.number}
                  onChange={(e) => setEditingMember({ ...editingMember, number: e.target.value })}
                  className="col-span-3"
                />
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Input
                  id="edit-role"
                  value={editingMember.teamId}
                  type="number"
                  onChange={(e) => setEditingMember({ ...editingMember, teamId: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div> */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team" className="text-right">
                  Team
                </Label>
                <Select
                  value={Roles[editingMember.teamId]}
                  onValueChange={(value) => setEditingMember({ ...editingMember, team: TeamRoles[value] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {AvailableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingMember.status}
                  onValueChange={(value: "Active" | "Inactive") => setEditingMember({ ...editingMember, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditMember}>Update Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}