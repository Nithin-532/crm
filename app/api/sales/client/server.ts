'use server'

import { prisma } from "@/prisma/prisma";
import { ClientAddress } from "@prisma/client";
import axios from "axios";
import { IdCard } from "lucide-react";

export async function createClient(name: string, description: string, company: string, number: string, status: number, memberId: number, behaviour: string, dealValue: number, remarks: string) {
    try {
        const createdClient = await prisma.client.create({
            data: {
                name: name,
                description: description,
                company: company,
                status: status,
                memberId: memberId,
                behaviour: behaviour,
                dealValue: dealValue,
                remarks: remarks,
                fieldVisits: 1,
                detailedRemarks: '',
                clientAddress: {
                    create: {
                        doorNumber: '',
                        address: '',
                        lat: null,
                        lng: null
                    }
                }
            }
        });

        await prisma.clientContactDetails.create({
            data: {
                clientId: createdClient.id,
                contactNumber: number
            }
        })

        return { status: 200, message: "Client Created" };
    } catch (e) {
        return { status: 500, message: "Error while creating client" + e }
    }

}

export async function getClients(memberId: number) {
    try {
        const clients = await prisma.client.findMany({
            where: {
                memberId: memberId
            },
            select: {
                id: true,
                name: true,
                contactDetails: true,
                company: true,
                status: true,
                remarks: true,
            }

        });

        return { status: 200, message: "Fetching clients successfully", data: clients };
    } catch (e) {
        return { status: 500, message: "Error while fetching clients" };
    }
}

export async function getCurrentClient(clientId: number, memberId: number) {
    try {
        const clientData = await prisma.client.findFirst({
            where: {
                id: clientId,
                memberId: memberId
            },
            include: {
                clientAddress: true,
                clientMeetings: true,
                contactDetails: true
            }
        });

        if (!clientData) {
            return {
                status: 404,
                message: "Client not found",
                data: null
            };
        }

        return {
            status: 200,
            message: "Fetched Client successfully",
            data: clientData
        };
    } catch (error) {
        console.error("Error in getCurrentClient:", error);

        return {
            status: 500,
            message: "Error while fetching client",
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function updateClient(memberId: number, newClientData: any, clientId: number, numberId: number) {
    try {
        const client = await prisma.client.update({
            where: {
                memberId: memberId,
                id: clientId
            },
            data: {
                name: newClientData.name,
                company: newClientData.company,
                status: newClientData.status,
                remarks: newClientData.remarks,
            }
        });

        await prisma.clientContactDetails.update({
            where: {
                id: numberId,
                clientId: clientId,
            },
            data: {
                contactNumber: newClientData.number
            }
        })

        return { status: 200, message: "Client Updated Successfully" }
    } catch (e) {
        return { status: 500, message: "Error while updating client" + e };
    }
}

export async function updateSingleClientData(memberId: number, newClientData: any, clientId: number) {
    try {
        const client = await prisma.client.update({
            where: {
                memberId: memberId,
                id: clientId
            },
            data: newClientData
        });

        return { status: 200, message: "Client Updated Successfully" }
    } catch (e) {
        return { status: 500, message: "Error while updating client" + e };
    }
}

export async function deleteClient(memberId: number, clientId: number) {
    try {
        await prisma.client.delete({
            where: {
                memberId: memberId,
                id: clientId
            }
        })

        return { status: 200, message: "Client Deleted Successfully" }
    } catch (e) {
        return { status: 500, message: "Error while deleting client" + e };
    }
}

export async function addClientContactDetail(clientId: number, contactNumber: string) {
    try {
        const newContactDetail = await prisma.clientContactDetails.create({
            data: {
                contactNumber: contactNumber,
                clientId: clientId
            }
        });

        return {
            status: 200,
            message: "Contact detail added successfully",
            data: newContactDetail
        };
    } catch (error) {
        console.error("Error adding contact detail:", error);

        return {
            status: 500,
            message: "Error adding contact detail",
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function updateClientContactDetail(clientContactId: number, clientId: number, contactNumber: string) {
    try {
        const newContactDetail = await prisma.clientContactDetails.update({
            where: {
                clientId: clientId,
                id: clientContactId
            },
            data: {
                contactNumber: contactNumber,
                clientId: clientId
            }
        });

        return {
            status: 200,
            message: "Contact detail updated successfully",
            data: newContactDetail
        };
    } catch (error) {
        console.error("Error while updating contact detail:", error);

        return {
            status: 500,
            message: "Error while updating contact detail",
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function deleteClientContactDetail(contactDetailId: number) {
    try {
        const deletedContactDetail = await prisma.clientContactDetails.delete({
            where: {
                id: contactDetailId
            }
        });

        return {
            status: 200,
            message: "Contact detail deleted successfully",
            data: deletedContactDetail
        };
    } catch (error) {
        console.error("Error deleting contact detail:", error);

        return {
            status: 500,
            message: "Error deleting contact detail",
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function geocodeAddress(address: string, doorNumber: string) {
    try {
        const fullAddress = `${doorNumber}, ${address}`;

        const response: any = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: fullAddress,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        if (response && response.data && response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                status: 200,
                message: 'Address geocoded successfully',
                data: {
                    lat: location.lat,
                    lng: location.lng
                }
            };
        } else {
            return {
                status: 404,
                message: 'Unable to geocode address',
                data: null
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return {
            status: 500,
            message: 'Error geocoding address',
            data: null
        };
    }
}

export async function updateClientDBAddress(key: keyof ClientAddress, clientId: number, value: string) {
    try {
        const response = await prisma.clientAddress.update({
            where: {
                clientId: clientId,
            },
            data: {
                [key]: value
            },
        })

        return {
            status: 200,
            message: "Client Address updated successfully",
        };
    } catch (e) {
        return {
            status: 500,
            message: "Error while updating client address",
            error: e instanceof Error ? e.message : 'Unknown error'
        };
    }
}

export async function createClientMeeting(timestamp: string, clientId: number) {
    const parsedDate = new Date(timestamp);
    try {
        const response = await prisma.clientMeeting.create({
            data: {
                date: parsedDate,
                clientId: clientId,
                notes: ''
            }
        })

        return {
            status: 200,
            message: "New Client meeting has been created",
            data: response
        };
    } catch (e) {
        return {
            status: 500,
            message: "Error while creating new client meeting, please try again.",
            error: e instanceof Error ? e.message : 'Unknown error'
        }
    }
}

export async function updateClientMeeting(id: number, clientId: number, timestamp: string, notes: string) {
    const parsedDate = new Date(timestamp);

    try {
        const response = await prisma.clientMeeting.update({
            where: {
                id: id,
                clientId: clientId
            },
            data: {
                notes: notes,
                date: parsedDate
            }
        })

        return {
            status: 200,
            message: "Client meeting has been updated",
            data: response
        };
    } catch (e) {
        return {
            status: 500,
            message: "Error while updating client meeting, please try again.",
            error: e instanceof Error ? e.message : 'Unknown error'
        }
    }
}

export async function deleteClientMeeting(id: number, clientId: number) {
    try {
        const response = await prisma.clientMeeting.delete({
            where: {
                id: id
            }
        })

        return {
            status: 200,
            message: "Client meeting has been deleted",
        };
    } catch(e) {
        return {
            status: 500,
            message: "Error while deleting client meeting",
        };
    }
}