"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MapPin, Calendar, Edit2, Save, Plus, Loader2, Phone, Trash2, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import Editor from "@/components/Editor"
import { useSession } from "next-auth/react"
import { addClientContactDetail, createClientMeeting, deleteClientContactDetail, deleteClientMeeting, getCurrentClient, updateClientContactDetail, updateClientDBAddress, updateClientMeeting, updateSingleClientData } from "@/app/api/sales/client/server"
import { toast } from "sonner"
import { ClientAddress, ClientMeeting } from "@prisma/client"

const Map = dynamic(() => import("@/components/Map"), { ssr: false })

type Behavior = "cool" | "hot-headed" | "professional" | "indecisive"
type DealStatus = "Accepted" | "Completed" | "In-Progress" | "Rejected"
type clientContactDetails = {
  id: number,
  contactNumber: string,
  clientId: number
}

type Client = {
  id: number
  name: string
  behaviour: Behavior
  contactDetails: clientContactDetails[]
  company: string
  status: number
  dealStatus: DealStatus
  dealValue: number
  remarks: string
  clientAddress: ClientAddress[]
  clientMeetings: ClientMeeting[] | undefined
  fieldVisits: number
  detailedRemarks: string
}

const getClientStatusNum = (value: string) => {
  switch (value) {
    case "Active":
      return 2;
    case "Inactive":
      return 0;
    default:
      return 1
  }
}

const getClientStatusValue = (value: number) => {
  switch (value) {
    case 2:
      return "Active";
    case 0:
      return "Inactive";
    default:
      return "Pending"
  }
}

const behaviorEmojis: Record<Behavior, string> = {
  "cool": "😎",
  "hot-headed": "🥵",
  "professional": "🧑‍💼",
  "indecisive": "🤔"
}

const dealStatusColors: Record<DealStatus, string> = {
  "Accepted": "text-green-600",
  "Completed": "text-blue-600",
  "In-Progress": "text-yellow-600",
  "Rejected": "text-red-600"
}

export default function ClientDetails() {
  const { id } = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const memberId = Number(session?.user?.id);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await getCurrentClient(Number(id), memberId);
        if (response.status === 200) {
          const currentClientDetails = response.data;
          if (currentClientDetails) {
            setClient(currentClientDetails);
          }
        } else {

        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchClient()
  }, [id])

  const handleEdit = () => setIsEditing(true)

  const handleSave = async () => {
    const loadId = toast.loading("Updating client Data");
    if (!client) {
      toast.dismiss(loadId);
      toast.error("No client available to update");
      return;
    }
    setIsEditing(false);
    try {
      const newClientData = {
        name: client.name,
        behaviour: client.behaviour,
        company: client.company,
        status: client.status,
        dealStatus: client.dealStatus,
        dealValue: client.dealValue,
        remarks: client.remarks,
        fieldVisits: client.fieldVisits,
        detailedRemarks: client.detailedRemarks
      }
      const response = await updateSingleClientData(memberId, newClientData, Number(id));
      if (response.status === 200) {
        toast.dismiss(loadId);
        toast.success("Updated Client Data successfully");
      } else {
        toast.error(response.message);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const handleChange = (field: keyof Client, value: any) => {
    if (client) {
      if (field === 'status') {
        setClient({ ...client, [field]: getClientStatusNum(value) })
      } else {
        setClient({ ...client, [field]: value })
      }
    }
  }

  const handleLocationChange = async (field: keyof Client['clientAddress'][0], value: string) => {
    if (client) {
      const newClientAddress = [...client.clientAddress]
      newClientAddress[0] = { ...newClientAddress[0], [field]: value }
      setClient({ ...client, clientAddress: newClientAddress })
    }
  }

  const updateClientAddress = async (field: keyof Client['clientAddress'][0], clientId: number, value: string) => {
    if (!isEditing) {
      return;
    }
    const loadId = toast.loading("Updating client address");
    try {
      const response = await updateClientDBAddress(field, clientId, value);
      if (response.status === 200) {
        toast.dismiss(loadId);
        toast.success("Updated Client address successfully")
      }
    } catch (e) {
      toast.dismiss(loadId);
      toast.error("Error while updating client address");
      setTimeout(() => {
        window.location.reload()
      }, 500);
    }
    toast.dismiss(loadId);
  }

  const handleAddMeeting = async () => {
    if (client) {
      try {
        const newMeeting = await createClientMeeting(new Date().toISOString(), Number(id));
        const newMeetingData = newMeeting.data;
        if (newMeetingData) {
          const newClientMeetings = client.clientMeetings ? [...client.clientMeetings, newMeetingData] : [newMeetingData];
          setClient({ ...client, clientMeetings: newClientMeetings })
        } else {
          toast.error(newMeeting.message);
        }
      } catch (e: any) {
        toast.error(e?.message);
      }
    }
  }

  const handleMeetingChange = (id: number, field: 'date' | 'notes', value: string) => {
    if (client) {
      if (client.clientMeetings && client.clientMeetings.length > 0) {
        setClient({
          ...client,
          clientMeetings: client.clientMeetings.map(meeting =>
            meeting.id === id ? { ...meeting, [field]: value } : meeting
          )
        })
      }
    }
  }

  const handleUpdateClientMeeting = async (meetingId: number, field: 'date' | 'notes', value: string) => {
    if (client) {
      if (client.clientMeetings && client.clientMeetings.length > 0) {
        const index = client.clientMeetings.findIndex(val => val.id === meetingId);
        let response;
        if (field === 'notes') {
          response = await updateClientMeeting(meetingId, Number(id), client.clientMeetings[index].date.toISOString(), value);
        }
        if (field === 'date') {
          response = await updateClientMeeting(meetingId, Number(id), value, client.clientMeetings[index].notes);
          console.log(response);
        }
        const updatedMeetingData = response?.data;
        if (updatedMeetingData) {
          setClient({
            ...client,
            clientMeetings: client.clientMeetings.map(meeting =>
              meeting.id === meetingId ? updatedMeetingData : meeting
            )
          })
        }
      }
    } else {
      toast.error("No Client has been created")
    }
  }

  const handleDeleteMeeting = async (meetingId: number) => {
    const loadId = toast.loading("Deleting client meeting");
    try {
      const response = await deleteClientMeeting(meetingId, Number(id));
      if (response.status === 200) {
        if (client?.clientMeetings && client.clientMeetings?.length > 0) {
          setClient(({
            ...client,
            clientMeetings: client.clientMeetings.filter(meeting =>
              meeting.id !== meetingId
            )
          }))
          toast.dismiss(loadId);
          toast.success(response.message);
        }
      } else {
        toast.dismiss(loadId);
        toast.error(response.message);
      }
    } catch (e: any) {
      toast.dismiss(loadId);
      toast.error(e?.message);
    }
    toast.dismiss(loadId);
  }

  const handleAddPhoneNumber = async () => {
    if (client) {
      try {
        const response = await addClientContactDetail(
          Number(id),
          ""
        );

        if (response.status === 200 && response.data) {
          setClient({
            ...client,
            contactDetails: [...client.contactDetails, response.data]
          });
        }
      } catch (error) {
        console.error("Failed to add phone number", error);
        // Optionally show an error toast
      }
    }
  }

  const handlePhoneNumberChange = (event: any, phoneId: number, value: string) => {
    if (client) {
      const newPhoneNumbers = [...client.contactDetails]
      const indexOfEditingNumber = newPhoneNumbers.findIndex(val => val.id === phoneId);
      newPhoneNumbers[indexOfEditingNumber] = { ...newPhoneNumbers[indexOfEditingNumber], contactNumber: value }
      setClient({ ...client, contactDetails: newPhoneNumbers })
    }
  }

  const handleUpdatePhoneNumber = async (phoneId: number, value: string) => {
    const loadId = toast.loading("Updating client phone number");
    try {
      const updatePhoneNumber = await updateClientContactDetail(phoneId, Number(id), value);
      if (updatePhoneNumber.status === 200) {
        toast.dismiss(loadId);
        toast.success("Successfully updated client phone number");
      } else {
        toast.dismiss(loadId);
        toast.error("Error while updating client phone Number");
      }
    } catch (e) {
      toast.dismiss(loadId);
      toast.error("Error while updating client phone Number");
    }
    toast.dismiss(loadId);
  }

  const handleRemovePhoneNumber = async (contactDetailId: number) => {
    if (client) {
      try {
        const response = await deleteClientContactDetail(contactDetailId);

        if (response.status === 200) {
          const newPhoneNumbers = client.contactDetails.filter(
            (phone) => phone.id !== contactDetailId
          );

          setClient({ ...client, contactDetails: newPhoneNumbers });
        }
      } catch (error) {
        console.error("Failed to remove phone number", error);
        // Optionally show an error toast
      }
    }
  };

  const handleFindLocation = async (e: any) => {
    e.preventDefault();
  }

  if (!client) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className={`container mx-auto space-y-8 ${isEditing ? "p-2 md:p-4" : "p-4"}`}>
      <div className={`flex justify-between items-center ${isEditing && "flex-col gap-3 md:flex-row"}`}>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {client.name}
          {isEditing ? (
            <Select value={client.behaviour} onValueChange={(value: Behavior) => handleChange('behaviour', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select behavior" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(behaviorEmojis).map(([key, emoji]) => (
                  <SelectItem key={key} value={key}>
                    {emoji} {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span title={client.behaviour}>{behaviorEmojis[client.behaviour]}</span>
          )}
        </h1>
        <Button onClick={isEditing ? handleSave : handleEdit} className={`${isEditing && "w-full md:w-48"}`}>
          {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit2 className="mr-2 h-4 w-4" />}
          {isEditing ? "Save Changes" : "Edit"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
              {client.contactDetails && client.contactDetails.map((phone, index) => (
                <div key={phone.id} className="flex items-center mb-2">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <Input
                    value={phone.contactNumber}
                    onChange={(e) => handlePhoneNumberChange(e, phone.id, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && e.target?.blur()}
                    onBlur={(e) => handleUpdatePhoneNumber(phone.id, e.target.value)}
                    readOnly={!isEditing}
                    className="flex-grow"
                  />
                  {isEditing && client.contactDetails.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePhoneNumber(phone.id)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <Button onClick={handleAddPhoneNumber} variant="outline" size="sm" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Phone Number
                </Button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <Input
                value={client.company}
                onChange={(e) => handleChange('company', e.target.value)}
                readOnly={!isEditing}
                className="mt-1"
              />
            </div>
            {!isEditing ? <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Input
                value={getClientStatusValue(Number(client.status))}
                readOnly={!isEditing}
                className="mt-1"
              />
            </div>
              :
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <Select onValueChange={(e) => handleChange('status', e)} defaultValue={getClientStatusValue(client.status)}>
                  <SelectTrigger>
                    <SelectValue placeholder={getClientStatusValue(client.status)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            <div>
              <label className="block text-sm font-medium text-gray-700">Field Visits</label>
              <Input
                type="number"
                value={client.fieldVisits}
                onChange={(e) => handleChange('fieldVisits', parseInt(e.target.value) || 0)}
                readOnly={!isEditing}
                min={0}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deal Status</label>
              {isEditing ? (
                <Select value={client.dealStatus} onValueChange={(value: DealStatus) => handleChange('dealStatus', value)}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select deal status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(dealStatusColors).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className={`mt-1 ${dealStatusColors[client.dealStatus]}`}>
                  {client.dealStatus}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deal Value</label>
              <Input
                type="number"
                value={client.dealValue}
                onChange={(e) => handleChange('dealValue', parseFloat(e.target.value) || 0)}
                readOnly={!isEditing}
                min={0}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Door Number</label>
                <Input
                  value={client.clientAddress ? client.clientAddress[0].doorNumber : '23 B'}
                  onChange={(e) => handleLocationChange('doorNumber', e.target.value)}
                  onBlur={(e) => updateClientAddress('doorNumber', Number(id), e.target.value)}
                  readOnly={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <Textarea
                  value={client.clientAddress ? client.clientAddress[0].address : "Texas, USA"}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  onBlur={(e) => updateClientAddress('address', Number(id), e.target.value)}
                  readOnly={!isEditing}
                  className="mt-1"
                  rows={3}
                />
              </div>
              {isEditing && (
                <Button onClick={handleFindLocation} className="ml-2" variant="outline">
                  <Search className="mr-2 h-4 w-4" /> Find Location
                </Button>
              )}
            </div>
            {client.clientAddress && client.clientAddress[0].lat ?
              <div className="h-64 rounded-lg overflow-hidden">
                <Map center={[client.clientAddress[0]?.lat || 12.971599, client.clientAddress[0]?.lng || 77.594563]} zoom={13} />
              </div>
              :
              <div className="h-64 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center">
                <p className="text-slate-600 bold font-bold text-2xl">Map location is not accessible</p>
              </div>
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Meetings</span>
            {isEditing && (
              <Button onClick={handleAddMeeting} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Meeting
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isEditing && "p-2 md:p-6"}`}>
          <div className="relative">
            <div className={`absolute top-0 bottom-0 w-0.5 bg-gray-200 ${isEditing ? "left-3.5 md:left-4" : "left-4"}`}></div>
            <div className="space-y-6">
              {client.clientMeetings && client.clientMeetings.length === 0
                ? <p>No meetings have been recorded</p>
                : client.clientMeetings?.map((meeting, index) => (
                  <div key={meeting.id} className="relative pl-8">
                    <div className="absolute left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className={`flex justify-between items-start mb-2 ${isEditing ? "gap-2 md:gap-4" : "gap-4"}`}>
                        <Input
                          type="datetime-local"
                          value={format(new Date(meeting.date), "yyyy-MM-dd'T'HH:mm")}
                          onChange={(e) => handleMeetingChange(meeting.id, 'date', e.target.value)}
                          onBlur={(e) => handleUpdateClientMeeting(meeting.id, 'date', e.target.value)}
                          readOnly={!isEditing}
                          className="mb-2"
                        />
                        {isEditing && <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="flex-shrink-0"
                          disabled={!isEditing}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete meeting</span>
                        </Button>}
                      </div>
                      <Textarea
                        value={meeting.notes}
                        onChange={(e) => handleMeetingChange(meeting.id, 'notes', e.target.value)}
                        onBlur={(e) => handleUpdateClientMeeting(meeting.id, 'notes', e.target.value)}
                        readOnly={!isEditing}
                        placeholder="Meeting notes"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Detailed Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Editor
            value={client.detailedRemarks}
            onChange={(value) => handleChange('detailedRemarks', value)}
            readOnly={!isEditing}
          />
        </CardContent>
      </Card> */}
    </div>
  )
}