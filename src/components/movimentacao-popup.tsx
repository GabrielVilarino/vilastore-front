"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { toast } from "sonner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MovimentacaoForm {
  id?: number;
  tipo: string;
  idProduto: string;
  quantidade: number;
  dataMovimentacao: string;
}

interface Produtos {
  id: number;
  nomeProduto: string;
  quantidade: number;
  valor: number;
}

interface AddMovimentacaoPopupProps {
  onClose: () => void;
  onSave: (movimentacao: MovimentacaoForm) => void;
  movimentacao?: MovimentacaoForm;
  produtos: Produtos[]
}

export default function AddMovimentacaoPopup({ onClose, onSave, movimentacao, produtos }: AddMovimentacaoPopupProps) {
  const [tipo, setTipo] = useState(movimentacao?.tipo || "");
  const [idProduto, setIdProduto] = useState<string>(
    movimentacao?.idProduto?.toString() || ""
  );
  const [quantidade, setQuantidade] = useState<number | "">(movimentacao?.quantidade || "");
  const [data, setData] = useState(movimentacao?.dataMovimentacao || "");
  const isEditing = Boolean(movimentacao);

  const formatDateLocal = (dateString: string) => {
    // dateString: "01/09/2025, 00:00:00"
    const [datePart, timePart] = dateString.split(", "); // ["01/09/2025", "00:00:00"]
    const [day, month, year] = datePart.split("/");      // ["01", "09", "2025"]
    const [hour, minute] = timePart.split(":");         // ["00", "00", "00"]

    return `${year}-${month}-${day}T${hour}:${minute}`; // "2025-09-01T00:00"
  };

  useEffect(() => {
    if (movimentacao) {
      setTipo(movimentacao.tipo);
      setIdProduto(movimentacao.idProduto.toString());
      setQuantidade(movimentacao.quantidade);
      setData(formatDateLocal(movimentacao.dataMovimentacao));

    }
  }, [movimentacao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const campos = {
      idProduto: { valor: idProduto, mensagem: "Selecione um produto!" },
      tipo: { valor: tipo, mensagem: "Selecione o tipo da movimentação!" },
      quantidade: { valor: quantidade, mensagem: "Informe a quantidade corretamente!" },
      data: { valor: data, mensagem: "Informe a data da movimentação!" },
    };

    const campoInvalido = Object.values(campos).find(c => !c.valor || c.valor === "" || c.valor === 0);
    
    if (campoInvalido) {
      toast.warning(campoInvalido.mensagem);
      return;
    }

    const movimentacaoData = {
      id: movimentacao?.id,
      tipo: tipo,
      idProduto: idProduto,
      quantidade: Number(quantidade),
      dataMovimentacao: data
    };

    onSave(movimentacaoData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-96"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">{isEditing ? "Editar Movimentação" : "Adicionar Movimentação"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label>Tipo da Movimentação:</Label>
            <Select
              value={tipo}
              onValueChange={(val) => setTipo(val)}  
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-lg text-start px-3 py-1">
                <SelectValue placeholder="Selecione o tipo da movimentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo</SelectLabel>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Nome do Produto:</Label>
            <Select
              value={idProduto}
              onValueChange={(val) => setIdProduto(val)} 
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-lg text-start px-3 py-1">
                <SelectValue placeholder="Selecione o nome do produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Produtos</SelectLabel>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id.toString()}>
                      {produto.nomeProduto}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">  
            <Label>Quantidade do Produto:</Label>
            <Input
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Data da Movimentação:</Label>
            <Input
              type="datetime-local"
              placeholder="Data da movimentação"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border bg-transparent text-black hover:cursor-pointer hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 rounded-xl hover:cursor-pointer"
            >
              {isEditing ? "Atualizar" : "Confirmar"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
