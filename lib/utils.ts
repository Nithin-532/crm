import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toCapitalise(value: string) {
  let result = value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  return result;
}

export function convertToCSV(clients: any[]) {
  const header = ['Name', 'Phone Number', 'Company', 'Status', 'Remarks'];
  const rows = clients.map(client => [
    client.name,
    client.number,
    client.company,
    client.status === 2 ? "Active" : client.status === 0 ? "Inactive" : "Pending",
    client.remarks
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}
