import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type ClientDetailsProps = {
  client: {
    id: number
    name: string
    company: string
    status: number
    dealStatus: string
    dealValue: number
    remarks: string
  }
}

export function ClientDetails({ client }: ClientDetailsProps) {
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Inactive"
      case 1:
        return "Pending"
      case 2:
        return "Active"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Client ID</Label>
            <p className="text-lg">{client.id}</p>
          </div>
          <div>
            <Label>Name</Label>
            <p className="text-lg">{client.name}</p>
          </div>
          <div>
            <Label>Company</Label>
            <p className="text-lg">{client.company}</p>
          </div>
          <div>
            <Label>Status</Label>
            <p className="text-lg">{getStatusText(client.status)}</p>
          </div>
          <div>
            <Label>Deal Status</Label>
            <p className="text-lg">{client.dealStatus}</p>
          </div>
          <div>
            <Label>Deal Value</Label>
            <p className="text-lg">${(client.dealValue / 100).toFixed(2)}</p>
          </div>
          <div className="col-span-2">
            <Label>Remarks</Label>
            <p className="text-lg">{client.remarks}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

