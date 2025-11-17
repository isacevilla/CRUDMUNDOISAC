# CRUD Mundo - Programação Web

Sistema de gerenciamento geográfico desenvolvido para a atividade avaliativa de Programação Web da ETEC. O projeto implementa um CRUD completo para países e cidades com integração a APIs externas.

## 📋 Descrição do Projeto

O **CRUD Mundo** é uma aplicação web full-stack que permite o gerenciamento de dados geográficos, focando em países e cidades do mundo. O sistema oferece funcionalidades completas de cadastro, consulta, edição e exclusão de registros, além de integração com APIs externas para enriquecimento de dados e informações em tempo real.

## 👨‍💻 Informações do Desenvolvedor

**Projeto:** CRUD Mundo - Programação Web  
**Curso:** Desenvolvimento de Sistemas  
**Unidade:** São José dos Campos - ETEC  
**Atividade:** Atividade Avaliativa - CRUD Mundo

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário para estilização
- **shadcn/ui** - Componentes UI reutilizáveis e acessíveis
- **Wouter** - Roteamento leve para React
- **tRPC** - Type-safe API client/server communication

### Backend
- **Node.js** - Runtime JavaScript server-side
- **Express 4** - Framework web para Node.js
- **tRPC 11** - Framework para APIs type-safe
- **Drizzle ORM** - ORM TypeScript-first para SQL
- **Zod** - Validação de schemas TypeScript-first

### Banco de Dados
- **MySQL** - Sistema de gerenciamento de banco de dados relacional
- **TiDB** - Banco de dados compatível com MySQL (ambiente de produção)

### APIs Externas
- **REST Countries API** - Dados complementares sobre países (bandeira, moeda, capital)
- **OpenWeatherMap API** - Informações climáticas de cidades (simulado para demonstração)

## 📦 Estrutura do Projeto

```
crud_mundo/
├── client/                    # Frontend React
│   ├── public/               # Arquivos estáticos
│   └── src/
│       ├── components/       # Componentes reutilizáveis
│       ├── pages/           # Páginas da aplicação
│       │   ├── Home.tsx     # Página inicial com estatísticas
│       │   ├── Paises.tsx   # Gerenciamento de países
│       │   └── Cidades.tsx  # Gerenciamento de cidades
│       ├── lib/             # Configurações e utilitários
│       └── App.tsx          # Componente raiz e rotas
├── server/                   # Backend Node.js
│   ├── db.ts               # Funções de acesso ao banco
│   ├── routers.ts          # Definição de rotas tRPC
│   └── _core/              # Configurações do servidor
├── drizzle/                 # Migrations e schema do banco
│   └── schema.ts           # Definição das tabelas
└── shared/                  # Tipos e constantes compartilhadas
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: `paises`
| Campo      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | INT (PK)     | Identificador único          |
| nome       | VARCHAR(255) | Nome do país                 |
| continente | VARCHAR(100) | Continente                   |
| populacao  | INT          | População total              |
| idioma     | VARCHAR(100) | Idioma principal             |
| bandeira   | TEXT         | URL da bandeira              |
| moeda      | VARCHAR(100) | Código da moeda              |
| capital    | VARCHAR(255) | Nome da capital              |
| createdAt  | TIMESTAMP    | Data de criação              |
| updatedAt  | TIMESTAMP    | Data de atualização          |

### Tabela: `cidades`
| Campo      | Tipo         | Descrição                    |
|------------|--------------|------------------------------|
| id         | INT (PK)     | Identificador único          |
| nome       | VARCHAR(255) | Nome da cidade               |
| populacao  | INT          | População total              |
| idPais     | INT (FK)     | Referência ao país           |
| latitude   | VARCHAR(50)  | Coordenada latitude          |
| longitude  | VARCHAR(50)  | Coordenada longitude         |
| createdAt  | TIMESTAMP    | Data de criação              |
| updatedAt  | TIMESTAMP    | Data de atualização          |

**Relacionamento:** Um país pode ter várias cidades (1:N)

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 22.x ou superior
- MySQL 8.0 ou superior
- pnpm (gerenciador de pacotes)

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd crud_mundo
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

As variáveis de ambiente são automaticamente configuradas no ambiente Manus. Para desenvolvimento local, crie um arquivo `.env` com:

```env
DATABASE_URL=mysql://usuario:senha@localhost:3306/bd_mundo
JWT_SECRET=sua-chave-secreta
```

4. **Execute as migrations do banco de dados**
```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Obrigatórios

#### Gerenciamento de Países
- ✅ Cadastrar novos países com dados completos
- ✅ Listar todos os países cadastrados
- ✅ Editar informações de países existentes
- ✅ Excluir países (com validação de integridade referencial)
- ✅ Campos: ID, nome, continente, população, idioma, bandeira, moeda, capital

#### Gerenciamento de Cidades
- ✅ Cadastrar novas cidades associadas a países
- ✅ Listar todas as cidades cadastradas
- ✅ Filtrar cidades por país
- ✅ Editar informações de cidades existentes
- ✅ Excluir cidades
- ✅ Campos: ID, nome, população, país (FK), latitude, longitude

#### Interface Web (Frontend)
- ✅ Páginas HTML5 estruturadas semanticamente
- ✅ Estilização com CSS3 (Tailwind CSS)
- ✅ Design responsivo para diferentes dispositivos
- ✅ Validação de formulários com JavaScript/TypeScript
- ✅ Confirmação de exclusão com diálogos
- ✅ Feedback visual para todas as operações

#### Backend (Node.js + tRPC)
- ✅ Comunicação type-safe com o banco de dados
- ✅ Operações CRUD via queries SQL (através do Drizzle ORM)
- ✅ Validação de integridade referencial
- ✅ Tratamento de erros adequado

#### Integração com APIs Externas
- ✅ **REST Countries API**: Busca automática de dados complementares (bandeira, moeda, capital)
- ✅ **OpenWeatherMap API**: Exibição de dados climáticos simulados para demonstração

### ✅ Funcionalidades Extras (Desafio)

- ✅ **Pesquisa Dinâmica**: Busca em tempo real de países e cidades pelo nome
- ✅ **Filtros Avançados**: Filtrar cidades por país
- ✅ **Estatísticas**:
  - Total de países e cidades cadastrados
  - Cidade mais populosa do sistema
  - País mais populoso do sistema
  - Total de cidades por continente
- ✅ **Integração com API REST Countries**: Preenchimento automático de formulários
- ✅ **Visualização de Clima**: Modal com dados climáticos das cidades

## 📱 Como Usar

### Página Inicial
A página inicial apresenta:
- Visão geral do sistema
- Estatísticas em tempo real
- Navegação para as páginas de gerenciamento
- Cards informativos sobre as funcionalidades

### Gerenciar Países
1. Acesse a página "Países" pelo menu de navegação
2. Clique em "Novo País" para cadastrar
3. Preencha o formulário manualmente ou use a busca da API REST Countries
4. Para editar, clique no ícone de lápis na linha do país
5. Para excluir, clique no ícone de lixeira (validação de cidades associadas)
6. Use a barra de pesquisa para filtrar países

### Gerenciar Cidades
1. Acesse a página "Cidades" pelo menu de navegação
2. Clique em "Nova Cidade" para cadastrar
3. Selecione o país associado no formulário
4. Preencha os dados da cidade (população, coordenadas)
5. Clique no ícone de nuvem para ver dados climáticos
6. Use filtros para buscar por nome ou país específico

## 🔒 Validações Implementadas

### Frontend
- Campos obrigatórios marcados com asterisco (*)
- Validação de tipos (números para população)
- Validação de URLs para bandeiras
- Confirmação antes de exclusões
- Feedback visual de loading durante operações

### Backend
- Validação de schemas com Zod
- Verificação de integridade referencial
- Tratamento de erros de banco de dados
- Validação de dados antes de inserção/atualização

## 🎨 Design e UX

O projeto utiliza um design moderno e profissional com:
- Paleta de cores azul e verde (representando terra e água)
- Componentes shadcn/ui para consistência visual
- Ícones Lucide React para melhor compreensão
- Animações suaves e transições
- Estados de loading e feedback visual
- Layout responsivo para mobile, tablet e desktop

## 📊 Critérios de Avaliação Atendidos

- ✅ **Organização**: Estrutura clara separando frontend e backend
- ✅ **HTML/CSS/JavaScript**: Uso correto e moderno das tecnologias
- ✅ **CRUD Funcional**: Todas as operações implementadas e testadas
- ✅ **Queries SQL**: Implementadas via ORM com eficiência
- ✅ **Interface Visual**: Design responsivo e profissional
- ✅ **Validações**: Campos obrigatórios e confirmações implementadas
- ✅ **APIs Externas**: Integração com REST Countries e OpenWeatherMap
- ✅ **Controle de Versão**: Projeto versionado com Git

## 🚀 Próximos Passos Sugeridos

Para expandir o projeto, considere:

1. **Autenticação de Usuários**: Implementar sistema de login para controle de acesso
2. **Exportação de Dados**: Adicionar funcionalidade para exportar relatórios em PDF/Excel
3. **Mapas Interativos**: Integrar Google Maps para visualizar cidades geograficamente
4. **Gráficos e Dashboards**: Adicionar visualizações com gráficos de população por continente
5. **API Key Real**: Configurar chave real da OpenWeatherMap para dados climáticos reais
6. **Upload de Imagens**: Permitir upload de bandeiras customizadas
7. **Histórico de Alterações**: Registrar quem e quando modificou cada registro
8. **Busca Avançada**: Filtros combinados (população, continente, idioma)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da atividade avaliativa do curso de Desenvolvimento de Sistemas da ETEC.

## 🙏 Agradecimentos

- ETEC São José dos Campos
- REST Countries API
- OpenWeatherMap API
- Comunidade Open Source

---

**Desenvolvido com ❤️ para a disciplina de Programação Web**
