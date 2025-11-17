import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Building2, BarChart3, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function Home() {
  const { data: paises } = trpc.paises.list.useQuery();
  const { data: cidades } = trpc.cidades.list.useQuery();

  // Estatísticas
  const totalPaises = paises?.length || 0;
  const totalCidades = cidades?.length || 0;

  // Cidade mais populosa
  const cidadeMaisPopulosa = cidades && cidades.length > 0
    ? cidades.reduce((prev, current) =>
        prev.populacao > current.populacao ? prev : current
      )
    : undefined;

  // País mais populoso
  const paisMaisPopuloso = paises && paises.length > 0
    ? paises.reduce((prev, current) =>
        prev.populacao > current.populacao ? prev : current
      )
    : undefined;

  // Cidades por continente
  const cidadesPorContinente = paises?.reduce((acc, pais) => {
    const numCidades = cidades?.filter((c) => c.idPais === pais.id).length || 0;
    acc[pais.continente] = (acc[pais.continente] || 0) + numCidades;
    return acc;
  }, {} as Record<string, number>);

  const getPaisNome = (idPais: number) => {
    return paises?.find((p) => p.id === idPais)?.nome || "Desconhecido";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/paises">
                <Button variant="ghost">Países</Button>
              </Link>
              <Link href="/cidades">
                <Button variant="ghost">Cidades</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Sistema de Gerenciamento Geográfico
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie países e cidades do mundo com integração a APIs externas para dados
            complementares e informações climáticas em tempo real.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/paises">
              <Button size="lg" className="gap-2">
                <Globe className="h-5 w-5" />
                Gerenciar Países
              </Button>
            </Link>
            <Link href="/cidades">
              <Button size="lg" variant="outline" className="gap-2">
                <Building2 className="h-5 w-5" />
                Gerenciar Cidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="container py-12">
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Estatísticas do Sistema
          </h3>
          <p className="text-muted-foreground">
            Visão geral dos dados cadastrados no sistema
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Países
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{totalPaises}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Cidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{totalCidades}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cidade Mais Populosa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-lg font-bold">
                    {cidadeMaisPopulosa?.nome || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cidadeMaisPopulosa
                      ? cidadeMaisPopulosa.populacao.toLocaleString("pt-BR")
                      : "0"}{" "}
                    habitantes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                País Mais Populoso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-lg font-bold">
                    {paisMaisPopuloso?.nome || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paisMaisPopuloso
                      ? paisMaisPopuloso.populacao.toLocaleString("pt-BR")
                      : "0"}{" "}
                    habitantes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cidades por Continente */}
        {cidadesPorContinente && Object.keys(cidadesPorContinente).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cidades por Continente</CardTitle>
              <CardDescription>
                Distribuição de cidades cadastradas por continente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(cidadesPorContinente)
                  .sort(([, a], [, b]) => b - a)
                  .map(([continente, total]) => (
                    <div
                      key={continente}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <span className="font-medium">{continente}</span>
                      <span className="text-2xl font-bold text-primary">{total}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Features */}
      <section className="container py-12">
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-2">Funcionalidades</h3>
          <p className="text-muted-foreground">
            Recursos disponíveis no sistema de gerenciamento
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 text-primary mb-2" />
              <CardTitle>CRUD de Países</CardTitle>
              <CardDescription>
                Cadastre, edite, visualize e exclua países com dados completos incluindo
                população, idioma e continente.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>CRUD de Cidades</CardTitle>
              <CardDescription>
                Gerencie cidades associadas a países com informações de população e
                coordenadas geográficas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>APIs Externas</CardTitle>
              <CardDescription>
                Integração com REST Countries para dados complementares e OpenWeatherMap
                para informações climáticas.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              <strong>CRUD Mundo - Programação Web</strong>
            </p>
            <p className="text-sm">
              Sistema desenvolvido com React, TypeScript, tRPC, Tailwind CSS e MySQL
            </p>
            <p className="text-sm mt-2">
              Integração com REST Countries API e OpenWeatherMap API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
