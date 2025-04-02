# Kanban Workroom

Este projeto **Kanban Workroom** foi desenvolvido para aprimorar a organização e a gestão de tarefas em equipe. Ele é uma aplicação **fullstack**, utilizando **HTML, CSS e JavaScript** no frontend e **NodeJS (TypeScript), MongoDB e Docker** no backend para garantir escalabilidade e facilidade na manutenção.

## Funcionalidades Principais

- **Kanban Interativo**: Sistema de arrastar e soltar tarefas entre diferentes fases do fluxo de trabalho.
- **Gerenciamento de Tarefas**: Cada tarefa contém título, descrição, tag (_Nova_ ou _Revisão_), e fotos dos membros responsáveis.
- **Sistema de Revisão**: Usuários movem tarefas até "Entregue", enquanto o **Admin** define se ela passa para "Em Revisão" ou volta para ajustes.
- **Controle de Usuários**: Somente o **Admin** pode criar usuários e fornecer login e senha. Não há cadastro direto de usuários.
- **Reuniões**: Ícone de reunião no cabeçalho permite acesso a salas de reuniões.
- **Notificações em Tempo Real**: Os usuários recebem notificações automáticas sobre mudanças nas tarefas.
- **Personalização de Perfil**: Usuários podem alterar suas fotos de perfil.
- **Modo Claro/Escuro**: Alternância de tema para melhor experiência visual.

## Tecnologias Utilizadas

### **Frontend**
- **HTML**, **CSS**, **JavaScript**

### **Backend**
- **NodeJS** _(TypeScript)_
- **MongoDB** _(Armazena todas as tarefas e usuários)_
- **Docker** _(Containerização para facilitar deploy e escalabilidade)_

## Fluxo das Tarefas no Kanban

1. **Criação da Tarefa**: O administrador registra uma nova tarefa no sistema.
2. **Movimentação pelo Usuário**: O usuário pode mover a tarefa entre as etapas até "Entregue".
3. **Revisão pelo Admin**: O administrador revisa a entrega e decide:
   - Se estiver correta, ele move para **Concluída**.
   - Se precisar ajustes, a tarefa volta para "Tarefa" com a tag **Revisão**.

## Documentação da API

A API da aplicação é documentada utilizando **Swagger**, permitindo testes e visualização dos endpoints diretamente pelo navegador.

- **Swagger UI**: 

### Exemplo de Requisição

- **Endpoint:** `/tasks/{id}`
- **Parâmetros:** `id` da tarefa que deseja consultar.

Exemplo de resposta esperada:

```json
{
  "id": 1,
  "title": "Criar API de login",
  "description": "Desenvolver a lógica de autenticação e sessão de usuários.",
  "status": "Em andamento",
  "tag": "Nova",
  "assignedUsers": [
    {
      "id": 2,
      "name": "João Silva",
      "profilePicture": "https://example.com/profile.jpg"
    }
  ]
}
