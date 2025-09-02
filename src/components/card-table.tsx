'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Edit, Trash2, Plus } from "lucide-react"
import { CustomAlert } from "@/components/alerta"

type CardTableProps = React.ComponentProps<"div"> & {
  idItem?: string | number
  title?: string
  description?: string
  columns: { key: string; label: string }[]
  data: Record<string, any>
  onDelete?: (id: number | string) => void
}


export function CardTable({
  className,
  idItem,
  title,
  description,
  columns,
  data,
  onDelete,
  ...props
}: CardTableProps) {

  const handleDelete = async () => {
    if (!idItem) return;

    try {
      const payload = {
        id: idItem
      }

      const response = await fetch(`/api/delete-produto`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao deletar produto');
      }

      // Mostra toast de sucesso
      toast.success(data.detail);

      if (onDelete) onDelete(idItem);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao deletar produto:', error.message);
        toast.error(`${error.message}`);
      } else {
        console.error('Erro desconhecido ao deletar produto:', error);
        toast.error('Erro desconhecido ao deletar produto.');
      }
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6 w-68", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            {title && <CardTitle className="text-1xl font-bold">{title}</CardTitle>}
            <CustomAlert
              trigger={<Trash2 className="w-5 h-5 text-red-700 hover:cursor-pointer" />}
              title="Excluir Produto"
              description={`Tem certeza que deseja excluir ${title}? Essa ação não poderá ser desfeita.`}
              onConfirm={handleDelete}
            />
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between border-b pb-1">
                <Label className="font-semibold mr-1">{col.label}:</Label>
                <Label>{data[col.key]}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
