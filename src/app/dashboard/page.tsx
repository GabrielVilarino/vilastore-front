import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import { Edit, Trash2, Plus } from "lucide-react"
import { ChartBarLabel } from '@/components/chart-bar-label'
import { Label } from "@/components/ui/label"

export default function Page() {
  return (
    <div className="flex flex-col p-10 gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">DashBoard</h1>
        <Label>Analise suas vendas de uma maneira simplificada</Label>
      </div>
      <div className="flex flex-wrap gap-5 justify-between max-h-[80vh] overflow-y-auto pr-4 pb-4 max-lg:justify-center">
        <p>AINDA EM DESENVOLVIMENTO</p>
      </div>
    </div>
  )
}
