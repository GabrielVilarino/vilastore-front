"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { toast } from "sonner"

interface ProdutoForm {
  id?: number;
  nomeProduto: string;
  valor: number;
  quantidade: number;
}

interface AddProductPopupProps {
  onClose: () => void;
  onSave: (produto: ProdutoForm) => void;
  produto?: ProdutoForm;
}

export default function AddProductPopup({ onClose, onSave, produto }: AddProductPopupProps) {
  const [nome, setNome] = useState(produto?.nomeProduto || "");
  const [valor, setValor] = useState<number | "">(produto?.valor || "");
  const [quantidade, setQuantidade] = useState<number | "">(produto?.quantidade || "");
  const isEditing = Boolean(produto);

  useEffect(() => {
    if (produto) {
      setNome(produto.nomeProduto);
      setValor(produto.valor);
      setQuantidade(produto.quantidade);
    }
  }, [produto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || valor === "" || quantidade === "") return;

    if (valor <= 0 ) {
      toast.warning("O valor deve ser maior que zero!")
      return
    }

    const produtoData = {
      id: produto?.id,
      nomeProduto: nome,
      valor: Number(valor),
      quantidade: Number(quantidade),
    };

    onSave(produtoData);
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
        <h2 className="text-xl font-semibold mb-4 text-center">{isEditing ? "Editar Produto" : "Adicionar Produto"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label>Nome do Produto:</Label>
            <Input
              type="text"
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Valor do Produto:</Label>
            <Input
              type="number"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
