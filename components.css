# 💠 NEXUS — Controle Financeiro Pessoal

Sua vida financeira, organizada para sempre.

---

## 🚀 Como subir no GitHub

### 1. Clonar o repositório
```bash
git clone https://github.com/wesleils/NEXUS.git
cd NEXUS
```

### 2. Copiar os arquivos
Coloque todos os arquivos do projeto dentro da pasta clonada.

### 3. Enviar para o GitHub
```bash
git add .
git commit -m "🚀 NEXUS v1.0 - Setup inicial"
git push origin main
```

### 4. Ativar GitHub Pages
- Vá em **Settings** do repositório
- Clique em **Pages** no menu lateral
- Em **Source**, selecione `main` e pasta `/ (root)`
- Clique em **Save**
- Em alguns minutos seu app estará em: `https://wesleils.github.io/NEXUS`

---

## 🗄️ Configurar o Supabase

### 1. Executar o schema SQL
- Acesse [supabase.com](https://supabase.com)
- Entre no seu projeto
- Clique em **SQL Editor**
- Copie o conteúdo de `sql/schema.sql`
- Cole e clique em **Run**

### 2. Habilitar autenticação por email
- Vá em **Authentication → Providers**
- Confirme que **Email** está habilitado
- Em **Email Templates** você pode personalizar os emails

### 3. (Opcional) Desabilitar confirmação de email
- **Authentication → Settings**
- Desmarque "Enable email confirmations" para testes

---

## 📁 Estrutura do Projeto

```
NEXUS/
├── index.html              ← App completo (entrada + painel)
├── css/
│   ├── main.css            ← Reset, variáveis, layout, grid
│   ├── components.css      ← Auth, modais, investimentos, temas
│   └── charts.css          ← Estilos dos gráficos
├── js/
│   ├── config.js           ← Credenciais Supabase + utilidades
│   ├── auth.js             ← Login, cadastro, sessão
│   ├── db.js               ← Todas as queries do banco
│   ├── themes.js           ← 20 temas + editor personalizado
│   ├── charts.js           ← 5 gráficos (Chart.js)
│   ├── investments.js      ← Ações e FIIs (BRAPI API)
│   └── app.js              ← Lógica principal + todas as seções
├── sql/
│   └── schema.sql          ← Schema completo do banco
└── README.md
```

---

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 💼 Carteira | Saldo vitalício (toda entrada/saída registrada) |
| 💳 Transações | Receitas e gastos com categorias |
| 📈 Investimentos | Ações e FIIs com cotação em tempo real (BRAPI) |
| 🏦 Poupança | Múltiplas poupanças com metas |
| 🎯 Metas | Objetivos financeiros com progresso |
| 💸 Dívidas | Parcelas com controle de pagamento |
| 📅 Calendário | Contas mensais com visualização |
| 🏷 Categorias | Categorias customizáveis por tipo |
| 🎨 Temas | 20 temas + editor 100% personalizável |
| 📊 Gráficos | 5 gráficos: linha, donut, barras, área, radar |

---

## 📡 API de Cotações

Usamos a **[BRAPI](https://brapi.dev)** — API brasileira gratuita para B3:
- Cobre **ações** e **FIIs** da B3
- Atualização a cada ~15 minutos
- Sem necessidade de cadastro no plano gratuito
- 500+ ações e 500+ FIIs disponíveis

---

## 🔧 Problemas comuns

### "Erro ao carregar dados"
→ Verifique se executou o `schema.sql` no Supabase

### Cotações não aparecem
→ A BRAPI tem limite de requisições no plano gratuito. Aguarde alguns minutos.

### Login não funciona
→ Verifique se a confirmação de email está desativada no Supabase para testes

---

## 💡 Dica de uso

Cada módulo tem seu próprio arquivo JS. Se algo der problema:
- Problema com temas → `js/themes.js`
- Problema com gráficos → `js/charts.js`
- Problema com investimentos → `js/investments.js`
- Problema com dados → `js/db.js`
- Problema com login → `js/auth.js`
