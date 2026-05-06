-- ============================================================
-- NEXUS - Schema completo do banco de dados
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensão UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIAS
-- ============================================================
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('income', 'expense', 'investment', 'saving', 'goal', 'debt')),
  color text not null default '#8b5cf6',
  icon text not null default '💰',
  created_at timestamptz default now()
);

-- ============================================================
-- CARTEIRA PRINCIPAL
-- ============================================================
create table if not exists wallet (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  balance numeric(15,2) not null default 0,
  total_income numeric(15,2) not null default 0,
  total_expense numeric(15,2) not null default 0,
  updated_at timestamptz default now()
);

-- ============================================================
-- TRANSAÇÕES (receitas e gastos)
-- ============================================================
create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(15,2) not null,
  description text not null,
  category_id uuid references categories(id) on delete set null,
  date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- INVESTIMENTOS (ações e FIIs)
-- ============================================================
create table if not exists investments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ticker text not null,
  name text,
  type text not null check (type in ('stock', 'fii', 'custom')),
  quantity numeric(15,6) not null default 0,
  avg_price numeric(15,2) not null default 0,
  total_invested numeric(15,2) not null default 0,
  current_price numeric(15,2),
  is_active boolean default true,
  date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- POUPANÇA
-- ============================================================
create table if not exists savings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric(15,2) not null default 0,
  target_amount numeric(15,2),
  color text default '#10b981',
  icon text default '🏦',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists savings_transactions (
  id uuid primary key default uuid_generate_v4(),
  saving_id uuid references savings(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('deposit', 'withdraw')),
  amount numeric(15,2) not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- METAS FINANCEIRAS
-- ============================================================
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  target_amount numeric(15,2) not null,
  current_amount numeric(15,2) not null default 0,
  deadline date,
  color text default '#f59e0b',
  icon text default '🎯',
  is_completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists goal_transactions (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid references goals(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('deposit', 'withdraw')),
  amount numeric(15,2) not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- DÍVIDAS E PARCELAS
-- ============================================================
create table if not exists debts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  total_amount numeric(15,2) not null,
  installment_value numeric(15,2) not null,
  total_installments integer not null,
  paid_installments integer not null default 0,
  due_day integer not null check (due_day between 1 and 31),
  start_date date not null default current_date,
  color text default '#ef4444',
  icon text default '💳',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists debt_payments (
  id uuid primary key default uuid_generate_v4(),
  debt_id uuid references debts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  installment_number integer not null,
  amount numeric(15,2) not null,
  paid_date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- CONTAS DO CALENDÁRIO
-- ============================================================
create table if not exists calendar_bills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric(15,2) not null,
  due_day integer not null check (due_day between 1 and 31),
  category_id uuid references categories(id) on delete set null,
  is_recurring boolean default true,
  color text default '#8b5cf6',
  icon text default '📅',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- CONFIGURAÇÕES DO USUÁRIO (tema)
-- ============================================================
create table if not exists user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  theme_name text default 'nexus-dark',
  theme_custom jsonb default '{}',
  currency text default 'BRL',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table categories enable row level security;
alter table wallet enable row level security;
alter table transactions enable row level security;
alter table investments enable row level security;
alter table savings enable row level security;
alter table savings_transactions enable row level security;
alter table goals enable row level security;
alter table goal_transactions enable row level security;
alter table debts enable row level security;
alter table debt_payments enable row level security;
alter table calendar_bills enable row level security;
alter table user_settings enable row level security;

-- Políticas: cada usuário acessa apenas seus próprios dados
create policy "users_own_categories" on categories for all using (auth.uid() = user_id);
create policy "users_own_wallet" on wallet for all using (auth.uid() = user_id);
create policy "users_own_transactions" on transactions for all using (auth.uid() = user_id);
create policy "users_own_investments" on investments for all using (auth.uid() = user_id);
create policy "users_own_savings" on savings for all using (auth.uid() = user_id);
create policy "users_own_savings_tx" on savings_transactions for all using (auth.uid() = user_id);
create policy "users_own_goals" on goals for all using (auth.uid() = user_id);
create policy "users_own_goal_tx" on goal_transactions for all using (auth.uid() = user_id);
create policy "users_own_debts" on debts for all using (auth.uid() = user_id);
create policy "users_own_debt_payments" on debt_payments for all using (auth.uid() = user_id);
create policy "users_own_calendar" on calendar_bills for all using (auth.uid() = user_id);
create policy "users_own_settings" on user_settings for all using (auth.uid() = user_id);

-- ============================================================
-- FUNÇÃO: inicializar carteira ao criar usuário
-- ============================================================
create or replace function initialize_user_data()
returns trigger as $$
begin
  insert into wallet (user_id, balance, total_income, total_expense)
  values (new.id, 0, 0, 0);

  insert into user_settings (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function initialize_user_data();
