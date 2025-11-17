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
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Globe, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PaisForm = {
  id?: number;
  nome: string;
  continente: string;
  populacao: number;
  idioma: string;
  bandeira?: string;
  moeda?: string;
  capital?: string;
};

export default function Paises() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPais, setEditingPais] = useState<PaisForm | null>(null);
  const [deletingPaisId, setDeletingPaisId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);

  const utils = trpc.useUtils();
  const { data: paises, isLoading } = trpc.paises.list.useQuery();

  const createMutation = trpc.paises.create.useMutation({
    onSuccess: () => {
      utils.paises.list.invalidate();
      toast.success("País cadastrado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar país: " + error.message);
    },
  });

  const updateMutation = trpc.paises.update.useMutation({
    onSuccess: () => {
      utils.paises.list.invalidate();
      toast.success("País atualizado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar país: " + error.message);
    },
  });

  const deleteMutation = trpc.paises.delete.useMutation({
    onSuccess: () => {
      utils.paises.list.invalidate();
      toast.success("País excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setDeletingPaisId(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir país: " + error.message);
    },
  });

  const { data: countryData } = trpc.apis.getCountryData.useQuery(
    { countryName: searchTerm },
    { enabled: isSearchingAPI && searchTerm.length > 0 }
  );

  const resetForm = () => {
    setEditingPais(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const paisData = {
      nome: formData.get("nome") as string,
      continente: formData.get("continente") as string,
      populacao: parseInt(formData.get("populacao") as string),
      idioma: formData.get("idioma") as string,
      bandeira: formData.get("bandeira") as string,
      moeda: formData.get("moeda") as string,
      capital: formData.get("capital") as string,
    };

    if (editingPais?.id) {
      updateMutation.mutate({ id: editingPais.id, ...paisData });
    } else {
      createMutation.mutate(paisData);
    }
  };

  const handleEdit = (pais: any) => {
    setEditingPais(pais);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingPaisId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingPaisId) {
      deleteMutation.mutate({ id: deletingPaisId });
    }
  };

  const handleSearchAPI = async () => {
    if (searchTerm.trim()) {
      setIsSearchingAPI(true);
      // A query será executada automaticamente
    }
  };

  const fillFromAPI = () => {
    if (countryData) {
      setEditingPais({
        nome: countryData.name,
        continente: countryData.region,
        populacao: countryData.population,
        idioma: countryData.languages,
        bandeira: countryData.flag,
        moeda: countryData.currencies,
        capital: countryData.capital,
      });
      setIsSearchingAPI(false);
      setSearchTerm("");
      toast.success("Dados preenchidos da API REST Countries!");
    }
  };

  const filteredPaises = paises?.filter((pais) =>
    pais.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <Globe className="h-8 w-8 text-primary" />
                Gerenciamento de Países
              </CardTitle>
              <CardDescription className="mt-2">
                Cadastre e gerencie países do mundo com integração à API REST Countries
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
              Novo País
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar países..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                    <TableHead>Bandeira</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Continente</TableHead>
                    <TableHead>População</TableHead>
                    <TableHead>Idioma</TableHead>
                    <TableHead>Capital</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaises && filteredPaises.length > 0 ? (
                    filteredPaises.map((pais) => (
                      <TableRow key={pais.id}>
                        <TableCell>
                          {pais.bandeira ? (
                            <img
                              src={pais.bandeira}
                              alt={`Bandeira de ${pais.nome}`}
                              className="w-12 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{pais.nome}</TableCell>
                        <TableCell>{pais.continente}</TableCell>
                        <TableCell>{pais.populacao.toLocaleString("pt-BR")}</TableCell>
                        <TableCell>{pais.idioma}</TableCell>
                        <TableCell>{pais.capital || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(pais)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(pais.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum país cadastrado
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPais?.id ? "Editar País" : "Cadastrar Novo País"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do país. Você pode buscar informações da API REST Countries.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4 p-4 bg-muted rounded-lg">
            <Label className="text-sm font-medium mb-2 block">
              Buscar dados da API REST Countries
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o nome do país em inglês..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchAPI();
                  }
                }}
              />
              <Button type="button" onClick={handleSearchAPI} variant="secondary">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
            {countryData && isSearchingAPI && (
              <div className="mt-3 p-3 bg-background rounded border">
                <p className="text-sm font-medium mb-2">Dados encontrados:</p>
                <p className="text-sm">
                  <strong>{countryData.name}</strong> - {countryData.region}
                </p>
                <Button
                  type="button"
                  onClick={fillFromAPI}
                  size="sm"
                  className="mt-2"
                >
                  Preencher formulário com estes dados
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    required
                    defaultValue={editingPais?.nome || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="continente">Continente *</Label>
                  <Input
                    id="continente"
                    name="continente"
                    required
                    defaultValue={editingPais?.continente || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="populacao">População *</Label>
                  <Input
                    id="populacao"
                    name="populacao"
                    type="number"
                    required
                    defaultValue={editingPais?.populacao || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="idioma">Idioma Principal *</Label>
                  <Input
                    id="idioma"
                    name="idioma"
                    required
                    defaultValue={editingPais?.idioma || ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="capital">Capital</Label>
                <Input
                  id="capital"
                  name="capital"
                  defaultValue={editingPais?.capital || ""}
                />
              </div>

              <div>
                <Label htmlFor="moeda">Moeda</Label>
                <Input
                  id="moeda"
                  name="moeda"
                  defaultValue={editingPais?.moeda || ""}
                />
              </div>

              <div>
                <Label htmlFor="bandeira">URL da Bandeira</Label>
                <Input
                  id="bandeira"
                  name="bandeira"
                  type="url"
                  defaultValue={editingPais?.bandeira || ""}
                />
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
                {editingPais?.id ? "Atualizar" : "Cadastrar"}
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
              Tem certeza que deseja excluir este país? Esta ação não pode ser desfeita.
              <br />
              <strong className="text-destructive">
                Atenção: Não é possível excluir países com cidades associadas.
              </strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingPaisId(null);
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
    </div>
  );
}
