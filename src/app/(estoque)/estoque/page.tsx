"use client"
import { useEffect, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { CardTable } from "@/components/card-table"

import { Edit, Trash2, Plus, Search } from "lucide-react"

import { CustomAlert } from "@/components/alerta"
import AddProductPopup from "@/components/produto-popup"

import { toast } from "sonner"

const columns = [
  { key: "nomeProduto", label: "Produto" },
  { key: "quantidade", label: "Qtde. em Estoque" },
  { key: "valor", label: "Valor Unitário" },
]

interface Filtros {
  nome?: string;
}

interface Produtos {
  id: number;
  nomeProduto: string;
  quantidade: number;
  valor: number;
}

export default function Page() {
  const [showPopup, setShowPopup] = useState(false);
  const [findProduto, setFindProduto] = useState<string>("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [produtoEditando, setProdutoEditando] = useState<Produtos | null>(null);

  const fetchProdutos = async () => {
    setError('')
    try {
      const filtros: Filtros = {}

      if (findProduto && findProduto !== "") {
        filtros.nome = findProduto;
      }

      const response = await fetch('/api/get-produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtros),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      if (response.status == 204) {
        setProdutos([])
        return
      }

      const data = await response.json();

      const produtos: Produtos[] = data.produtos.map((produto: any) => ({
        id: produto.id,
        nomeProduto: produto.nome_produto,
        quantidade: produto.quantidade,
        valor: produto.valor,
      }))
      
      setProdutos(produtos)
    } catch (error) {
      setProdutos([])
      if (error instanceof Error) {
        
        setError(`${error.message}`)
        console.error('Erro ao carregar os produtos:', error.message)
      } else {
        setError('Erro desconhecido.')
        console.error('Erro desconhecido:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (produto: { nomeProduto: string; valor: number; quantidade: number }) => {
    setError('')
    try {

      const payload = {
        nome_produto: produto.nomeProduto,
        valor: produto.valor,
        quantidade: produto.quantidade,
      };

      const response = await fetch('/api/add-produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();

      const novoProduto: Produtos = {
        id: data.produto.id,
        nomeProduto: data.produto.nome,
        valor: data.produto.valor,
        quantidade: data.produto.quantidade,
      };

      setProdutos([...produtos, novoProduto]);
    } catch (error) {
      if (error instanceof Error) {
        
        setError(`${error.message}`)
        console.error('Erro ao adicionar produto:', error.message)
      } else {
        setError('Erro desconhecido.')
        console.error('Erro desconhecido:', error)
      }
    } finally {
      setLoading(false)
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      const payload = {
        id: id
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

      // Remove o produto do estado local
      setProdutos(produtos.filter((p) => p.id !== id));

      // Mostra toast de sucesso
      toast.success(data.detail);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Erro ao deletar produto:', error.message);
        toast.error(`${error.message}`);
      } else {
        setError('Erro desconhecido.');
        console.error('Erro desconhecido ao deletar produto:', error);
        toast.error('Erro desconhecido ao deletar produto.');
      }
    }
  }

  const handleEdit = (produto: Produtos) => {
    setProdutoEditando(produto);
    setShowPopup(true);
  }

  const handleUpdate = async (produto: { id?: number; nomeProduto: string; valor: number; quantidade: number }) => {
    
    if (!produto.id) return;

    setError('')
    try {

      const payload = {
        nome_produto: produto.nomeProduto,
        valor: produto.valor,
        quantidade: produto.quantidade,
      };

      const response = await fetch(`/api/update-produto/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();

      const updatedProduto: Produtos = {
        id: data.produto.id,
        nomeProduto: data.produto.nome,
        valor: data.produto.valor,
        quantidade: data.produto.quantidade,
      };

      setProdutos((prev) =>
        prev.map((p) => (p.id === updatedProduto.id ? updatedProduto : p))
      );

      toast.success(data.detail);
      setProdutoEditando(null);
      setShowPopup(false);
    } catch (error) {
      if (error instanceof Error) {
        
        setError(`${error.message}`)
        console.error('Erro ao adicionar produto:', error.message)
      } else {
        setError('Erro desconhecido.')
        console.error('Erro desconhecido:', error)
      }
    } finally {
      setLoading(false)
    }
  };

  const handleClose = () => {
    setProdutoEditando(null);
    setShowPopup(false);
  };

  useEffect(() => {
    fetchProdutos()
  }, [])

  return (
    <div className="flex flex-col p-10 gap-10">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <Button className="hover:cursor-pointer" onClick={() => setShowPopup(true)}>
          Adicionar Produto
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
        <div className="flex flex-col md:flex-row w-full md:w-[50%] gap-2 ">
          <Label>Produto:</Label>
          <Input placeholder="Digite o nome do produto" value={findProduto} onChange={(e) => setFindProduto(e.target.value)}/>
        </div>
        <Button className="w-full md:w-[180px] hover:cursor-pointer" onClick={fetchProdutos}>
          Filtrar
          <Search className="w-4 h-4 ml-2" />
        </Button>
      </div>
      {showPopup && (
        <AddProductPopup
          onClose={() => setShowPopup(false)}
          onSave={handleSave}
        />
      )}
      {produtoEditando && (
        <AddProductPopup
          onClose={handleClose}
          onSave={handleUpdate}
          produto={produtoEditando}
        />
      )}
      {
        loading ? (
          <p className="text-center text-gray-500">Buscando produtos...</p>
        ) : (
          <>
            {/* TABLE (desktop) */}
            <div className="hidden md:block mx-auto max-h-[70vh] overflow-y-auto pr-4">
              <Table style={{ tableLayout: "fixed" }}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtde. em Estoque</TableHead>
                    <TableHead>Valor Unid.</TableHead>
                    <TableHead>Editar</TableHead>
                    <TableHead>Remover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos && produtos.length > 0 ? (
                    produtos.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.nomeProduto}</TableCell>
                        <TableCell>{p.quantidade}</TableCell>
                        <TableCell>R$ {p.valor.toFixed(2)}</TableCell>
                        <TableCell>
                          <Edit className="w-4 h-4 hover:cursor-pointer" onClick={() => handleEdit(p)} />
                        </TableCell>
                        <TableCell>
                          <CustomAlert
                            trigger={<Trash2 className="w-5 h-5 hover:cursor-pointer" />}
                            title="Excluir Produto"
                            description={`Tem certeza que deseja excluir ${p.nomeProduto}? Essa ação não poderá ser desfeita.`}
                            onConfirm={() => handleDelete(p.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Nenhum produto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* CARDS (mobile) */}
            <div className=" max-h-[60vh] flex flex-wrap gap-10 items-center justify-center overflow-y-auto md:hidden">
              {produtos && produtos.length > 0 ? (
                <div className="flex flex-wrap gap-10 items-center justify-center">
                  {produtos.map((p) => (
                    <CardTable
                      key={p.id}
                      idItem={p.id}
                      title={p.nomeProduto}
                      columns={columns}
                      data={{
                        nomeProduto: p.nomeProduto,
                        quantidade: p.quantidade,
                        valor: `R$ ${p.valor.toFixed(2)}`,
                      }}
                      onDelete={(id) => setProdutos((prev) => prev.filter((p) => p.id !== id))}
                    />
                  ))}
                </div>
                ) : (
                  <div className="flex w-full justify-center">
                    <p className="w-full text-center text-gray-500">Nenhum produto encontrado.</p>
                  </div>
                )}
            </div>
          </>
        )
      }
    </div>
  )
}
