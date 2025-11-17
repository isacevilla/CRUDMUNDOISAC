import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Building2, Search, Cloud } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CidadeForm = {
  id?: number;
  nome: string;
  populacao: number;
  idPais: number;
  latitude?: string;
  longitude?: string;
};

export default function Cidades() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isWeatherDialogOpen, setIsWeatherDialogOpen] = useState(false);
  const [editingCidade, setEditingCidade] = useState<CidadeForm | null>(null);
  const [deletingCidadeId, setDeletingCidadeId] = useState<number | null>(null);
  const [selectedCidadeForWeather, setSelectedCidadeForWeather] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaisFilter, setSelectedPaisFilter] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: cidades, isLoading } = trpc.cidades.list.useQuery();
  const { data: paises } = trpc.paises.list.useQuery();

  const { data: weatherData, isLoading: isLoadingWeather } = trpc.apis.getWeatherData.useQuery(
    { cityName: selectedCidadeForWeather || "" },
    { enabled: !!selectedCidadeForWeather && isWeatherDialogOpen }
  );

  const createMutation = trpc.cidades.create.useMutation({
    onSuccess: () => {
      utils.cidades.list.invalidate();
      toast.success("Cidade cadastrada com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar cidade: " + error.message);
    },
  });

  const updateMutation = trpc.cidades.update.useMutation({
    onSuccess: () => {
      utils.cidades.list.invalidate();
      toast.success("Cidade atualizada com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar cidade: " + error.message);
    },
  });

  const deleteMutation = trpc.cidades.delete.useMutation({
    onSuccess: () => {
      utils.cidades.list.invalidate();
      toast.success("Cidade excluída com sucesso!");
      setIsDeleteDialogOpen(false);
      setDeletingCidadeId(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir cidade: " + error.message);
    },
  });

  const resetForm = () => {
    setEditingCidade(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const cidadeData = {
      nome: formData.get("nome") as string,
      populacao: parseInt(formData.get("populacao") as string),
      idPais: parseInt(formData.get("idPais") as string),
      latitude: formData.get("latitude") as string,
      longitude: formData.get("longitude") as string,
    };

    if (editingCidade?.id) {
      updateMutation.mutate({ id: editingCidade.id, ...cidadeData });
    } else {
      createMutation.mutate(cidadeData);
    }
  };

  const handleEdit = (cidade: any) => {
    setEditingCidade(cidade);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingCidadeId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCidadeId) {
      deleteMutation.mutate({ id: deletingCidadeId });
    }
  };

  const handleShowWeather = (cidadeNome: string) => {
    setSelectedCidadeForWeather(cidadeNome);
    setIsWeatherDialogOpen(true);
  };

  const getPaisNome = (idPais: number) => {
    return paises?.find((p) => p.id === idPais)?.nome || "Desconhecido";
  };

  const filteredCidades = cidades?.filter((cidade) => {
    const matchesSearch = cidade.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPais =
      selectedPaisFilter === "all" || cidade.idPais === parseInt(selectedPaisFilter);
    return matchesSearch && matchesPais;
  });

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                Gerenciamento de Cidades
              </CardTitle>
              <CardDescription className="mt-2">
                Cadastre e gerencie cidades associadas a países com dados climáticos
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Cidade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedPaisFilter} onValueChange={setSelectedPaisFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os países</SelectItem>
                {paises?.map((pais) => (
                  <SelectItem key={pais.id} value={pais.id.toString()}>
                    {pais.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>População</TableHead>
                    <TableHead>Coordenadas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCidades && filteredCidades.length > 0 ? (
                    filteredCidades.map((cidade) => (
                      <TableRow key={cidade.id}>
                        <TableCell className="font-medium">{cidade.nome}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getPaisNome(cidade.idPais)}</Badge>
                        </TableCell>
                        <TableCell>{cidade.populacao.toLocaleString("pt-BR")}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {cidade.latitude && cidade.longitude
                            ? `${cidade.latitude}, ${cidade.longitude}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowWeather(cidade.nome)}
                              title="Ver clima"
                            >
                              <Cloud className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(cidade)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(cidade.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma cidade cadastrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCidade?.id ? "Editar Cidade" : "Cadastrar Nova Cidade"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da cidade e associe a um país existente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  name="nome"
                  required
                  defaultValue={editingCidade?.nome || ""}
                />
              </div>

              <div>
                <Label htmlFor="idPais">País *</Label>
                <Select
                  name="idPais"
                  defaultValue={editingCidade?.idPais?.toString() || ""}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um país" />
                  </SelectTrigger>
                  <SelectContent>
                    {paises?.map((pais) => (
                      <SelectItem key={pais.id} value={pais.id.toString()}>
                        {pais.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="populacao">População *</Label>
                <Input
                  id="populacao"
                  name="populacao"
                  type="number"
                  required
                  defaultValue={editingCidade?.populacao || ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    placeholder="-23.5505"
                    defaultValue={editingCidade?.latitude || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    placeholder="-46.6333"
                    defaultValue={editingCidade?.longitude || ""}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingCidade?.id ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta cidade? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingCidadeId(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Clima */}
      <Dialog open={isWeatherDialogOpen} onOpenChange={setIsWeatherDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Dados Climáticos - {selectedCidadeForWeather}
            </DialogTitle>
            <DialogDescription>
              Informações climáticas em tempo real (simuladas para demonstração)
            </DialogDescription>
          </DialogHeader>

          {isLoadingWeather ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : weatherData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Temperatura</p>
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Condição</p>
                  <p className="text-lg font-semibold">{weatherData.description}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Umidade</p>
                  <p className="text-xl font-bold">{weatherData.humidity}%</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Vento</p>
                  <p className="text-xl font-bold">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
              {weatherData.simulated && (
                <p className="text-xs text-muted-foreground text-center">
                  * Dados simulados para demonstração. Em produção, seria integrado com
                  OpenWeatherMap API.
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Não foi possível carregar os dados climáticos.
            </p>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setIsWeatherDialogOpen(false);
                setSelectedCidadeForWeather(null);
              }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
