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

import { Edit, Trash2, Plus, Search } from "lucide-react"

import { CardTable } from "@/components/card-table"

import { CustomAlert } from "@/components/alerta"
import { toast } from "sonner"
import AddMovimentacaoPopup from "@/components/movimentacao-popup"

const columns = [
  { key: "produto", label: "Produto" },
  { key: "quantidade", label: "Quantidade" },
  { key: "data", label: "Data" },
]

interface Filtros {
  data_inicio?: string;
  data_fim?: string;
}

interface Movimentacoes {
  id: number;
  tipo: string;
  nomeProduto: string;
  idProduto: string;
  dataMovimentacao: string;
  quantidade: number;
}

interface Produtos {
  id: number;
  nomeProduto: string;
  quantidade: number;
  valor: number;
}

export default function Page() {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [movimentacoes, setMovimentacoes] = useState<Movimentacoes[]>([]);
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [movimentacaoEditando, setMovimentacaoEditando] = useState<Movimentacoes | null>(null);

  function formatarDataHoraBR(valor: string | Date): string {
    const data = new Date(valor);
    return data.toLocaleString("pt-BR", { hour12: false });
  }

  const fetchProdutos = async () => {
    setError('')
    try {
      const filtros: Filtros = {}

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

  const fetchMovimentacoes = async () => {
      setError('')
      try {
        const filtros: Filtros = {}
  
        if (dataInicio !== "") {
          filtros.data_inicio = dataInicio;
        }

        if (dataFim !== "") {
          filtros.data_fim = dataFim;
        }
  
        const response = await fetch('/api/get-movimentacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filtros),
        })
  
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.detail);
        }
  
        if (response.status == 204) {
          setMovimentacoes([])
          return
        }
  
        const data = await response.json();
  
        const movimentacoesData: Movimentacoes[] = data.movimentacoes.map((movimentacao: any) => ({
          id: movimentacao.id,
          tipo: movimentacao.tipo,
          nomeProduto: movimentacao.nome_produto,
          quantidade: movimentacao.quantidade,
          dataMovimentacao: formatarDataHoraBR(movimentacao.data_movimentacao),
          idProduto: movimentacao.produto_id,
        }))

        setMovimentacoes(movimentacoesData)
      } catch (error) {
        setMovimentacoes([])
        if (error instanceof Error) {
          
          setError(`${error.message}`)
          console.error('Erro ao carregar as movimentações:', error.message)
        } else {
          setError('Erro desconhecido.')
          console.error('Erro desconhecido:', error)
        }
      } finally {
        setLoading(false)
      }
    }
  
  useEffect(() => {
    fetchMovimentacoes()
    fetchProdutos()
  }, [])

  const handleSave = async (movimentacao: { tipo: string; idProduto: string; quantidade: number; dataMovimentacao: string }) => {
    setError('')
    try {

      const payload = {
        tipo: movimentacao.tipo,
        produto_id: movimentacao.idProduto,
        quantidade: movimentacao.quantidade,
        data_movimentacao: movimentacao.dataMovimentacao
      };

      const response = await fetch('/api/add-movimentacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();

      const novaMovimentacao: Movimentacoes = {
        id: data.movimentacao.id,
        tipo: data.movimentacao.tipo,
        nomeProduto: data.movimentacao.nomeProduto,
        idProduto: data.movimentacao.idProduto,
        quantidade: data.movimentacao.quantidade,
        dataMovimentacao: formatarDataHoraBR(data.movimentacao.dataMovimentacao),
      };

      setMovimentacoes([...movimentacoes, novaMovimentacao]);
    } catch (error) {
      if (error instanceof Error) {
        
        setError(`${error.message}`)
        toast.error(`${error.message}`)
        console.error('Erro ao adicionar movimentação:', error.message)
      } else {
        setError('Erro desconhecido.')
        console.error('Erro desconhecido:', error)
      }
    } finally {
      setLoading(false)
    }
  };

  const handleUpdate = async (movimentacao: { id?: number; tipo: string; idProduto: string; quantidade: number; dataMovimentacao: string }) => {
      
      if (!movimentacao.id) return;
  
      setError('')
      try {
  
        const payload = {
          tipo: movimentacao.tipo,
          produto_id: movimentacao.idProduto,
          quantidade: movimentacao.quantidade,
          data_movimentacao: movimentacao.dataMovimentacao,
        };
  
        const response = await fetch(`/api/update-movimentacao/${movimentacao.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
  
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.detail);
        }
  
        const data = await response.json();
  
        const updatedMovimentacao: Movimentacoes = {
          id: data.movimentacao.id,
          tipo: data.movimentacao.tipo,
          nomeProduto: data.movimentacao.nomeProduto,
          idProduto: data.movimentacao.idProduto,
          quantidade: data.movimentacao.quantidade,
          dataMovimentacao: data.movimentacao.dataMovimentacao,
        };
  
        setMovimentacoes((prev) =>
          prev.map((p) =>
            p.id === updatedMovimentacao.id
              ? {
                  ...updatedMovimentacao,
                  dataMovimentacao: formatarDataHoraBR(updatedMovimentacao.dataMovimentacao),
                }
              : p
          )
        );
  
        toast.success(data.detail);
        setMovimentacaoEditando(null);
        setShowPopup(false);
      } catch (error) {
        if (error instanceof Error) {
          
          setError(`${error.message}`)
          toast.error(`${error.message}`)
          console.error('Erro ao adicionar produto:', error.message)
        } else {
          setError('Erro desconhecido.')
          console.error('Erro desconhecido:', error)
        }
      } finally {
        setLoading(false)
      }
    };

  const handleEdit = (movimentacao: Movimentacoes) => {
    setMovimentacaoEditando(movimentacao);
    setShowPopup(true);
  }

  const handleClose = () => {
    setMovimentacaoEditando(null);
    setShowPopup(false);
  };

  async function handleDelete(id: number) {
    setError('');
    try {
      const payload = {
        id: id
      }

      const response = await fetch(`/api/delete-movimentacao`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao deletar movimentacao');
      }

      // Remove o movimentacao do estado local
      setMovimentacoes(movimentacoes.filter((m) => m.id !== id));

      // Mostra toast de sucesso
      toast.success(data.detail);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Erro ao deletar movimentação:', error.message);
        toast.error(`${error.message}`);
      } else {
        setError('Erro desconhecido.');
        console.error('Erro desconhecido ao deletar movimentação:', error);
        toast.error('Erro desconhecido ao deletar movimentação.');
      }
    }
  }

  return (
    <div className="flex flex-col p-10 gap-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Movimentações</h1>
        <Button className="hover:cursor-pointer" onClick={() => setShowPopup(true)}>
          <Label className="hidden sm:inline hover:cursor-pointer">Adicionar Movimentação</Label>
          <Plus className="w-4 h-4 sm:ml-2" />
        </Button>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
        <div className="flex flex-col md:flex-row w-full md:w-[210px] gap-2 ">
          <Label>Data Início:</Label>
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}/>
        </div>

        <div className="flex flex-col md:flex-row w-full md:w-[210px] gap-2 ">
          <Label>Data Fim:</Label>
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}/>
        </div>
        <Button className="w-full md:w-[180px] hover:cursor-pointer" onClick={fetchMovimentacoes}>
          Filtrar
          <Search className="w-4 h-4 ml-2" />
        </Button>
      </div>
      {showPopup && (
        <AddMovimentacaoPopup
          onClose={() => setShowPopup(false)}
          onSave={handleSave}
          produtos={produtos}
        />
      )}
      {
        movimentacaoEditando && (
          <AddMovimentacaoPopup
            onClose={handleClose}
            onSave={handleUpdate}
            movimentacao={movimentacaoEditando}
            produtos={produtos}
          />
        )
      }
      {/* TABLE (desktop) */}
      <div className="hidden md:block mx-auto max-h-[70vh] overflow-y-auto pr-4">
        <Table style={{ tableLayout: "fixed" }}>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Remover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { movimentacoes && movimentacoes.length > 0 ? (
              movimentacoes.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.tipo}</TableCell>
                  <TableCell>{m.nomeProduto}</TableCell>
                  <TableCell>{m.quantidade}</TableCell>
                  <TableCell>{m.dataMovimentacao}</TableCell>
                  <TableCell>
                    <Edit className="w-4 h-4 hover:cursor-pointer" onClick={() => handleEdit(m)}/>
                  </TableCell>
                  <TableCell>
                    <CustomAlert
                      trigger={<Trash2 className="w-5 h-5 hover:cursor-pointer" />}
                      title="Excluir Produto"
                      description={`Tem certeza que deseja excluir ${m.nomeProduto}? Essa ação não poderá ser desfeita.`}
                      onConfirm={() => handleDelete(m.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Nenhuma movimentação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* CARDS (mobile) */}
      <div className="max-h-[60vh] flex flex-wrap gap-10 items-center justify-center overflow-y-auto md:hidden">
        {movimentacoes && movimentacoes.length > 0 ? (
          movimentacoes.map((m) => (
            <CardTable
              key={m.id}
              idItem={m.id}
              title={m.tipo}
              columns={columns}
              data={{
                produto: m.nomeProduto,
                quantidade: m.quantidade,
                data: m.dataMovimentacao,
              }}
            />
          ))
        ) : (
          <div className="w-full text-center text-gray-500">
            Nenhuma movimentação encontrada.
          </div>
        )}
      </div>
    </div>
  )
}
