# CRUD Mundo - Programação Web

**Projeto:** CRUD Mundo - Programação Web  
**Curso:** Desenvolvimento de Sistemas  
**Unidade:** São José dos Campos - ETEC  
**Atividade:** Atividade Avaliativa - CRUD Mundo

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
