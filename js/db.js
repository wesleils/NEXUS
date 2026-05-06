// ============================================================
// NEXUS - Camada de dados / Supabase queries (db.js)
// ============================================================

function db() { return getSupabase(); }
function uid() { return getCurrentUser()?.id; }

// ── CARTEIRA ────────────────────────────────────────────────
const DB = {

  // Buscar carteira
  async getWallet() {
    const { data, error } = await db().from('wallet').select('*').eq('user_id', uid()).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || { balance: 0, total_income: 0, total_expense: 0 };
  },

  // Atualizar carteira
  async updateWallet(delta) {
    const wallet = await DB.getWallet();
    const newBalance = (wallet.balance || 0) + delta;
    const newIncome = delta > 0 ? (wallet.total_income || 0) + delta : wallet.total_income;
    const newExpense = delta < 0 ? (wallet.total_expense || 0) + Math.abs(delta) : wallet.total_expense;

    const { error } = await db().from('wallet').upsert({
      user_id: uid(),
      balance: newBalance,
      total_income: newIncome,
      total_expense: newExpense,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
    return newBalance;
  },

  // Ajuste direto (para correções)
  async setWallet(balance, income, expense) {
    const { error } = await db().from('wallet').upsert({
      user_id: uid(), balance, total_income: income, total_expense: expense,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  // ── CATEGORIAS ────────────────────────────────────────────
  async getCategories() {
    const { data, error } = await db().from('categories').select('*').eq('user_id', uid()).order('name');
    if (error) throw error;
    return data || [];
  },

  async addCategory(name, type, color, icon) {
    const { data, error } = await db().from('categories').insert({ user_id: uid(), name, type, color, icon }).select().single();
    if (error) throw error;
    return data;
  },

  async updateCategory(id, updates) {
    const { error } = await db().from('categories').update(updates).eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  async deleteCategory(id) {
    const { error } = await db().from('categories').delete().eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  // ── TRANSAÇÕES ────────────────────────────────────────────
  async getTransactions(limit = 500) {
    const { data, error } = await db().from('transactions')
      .select('*, categories(name, color, icon)')
      .eq('user_id', uid())
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async addTransaction(type, amount, description, categoryId, date, notes) {
    const { data, error } = await db().from('transactions')
      .insert({ user_id: uid(), type, amount, description, category_id: categoryId, date, notes })
      .select().single();
    if (error) throw error;

    // Atualizar carteira
    const delta = type === 'income' ? amount : -amount;
    await DB.updateWallet(delta);
    return data;
  },

  async deleteTransaction(id) {
    // Buscar transação para reverter carteira
    const { data: tx } = await db().from('transactions').select('*').eq('id', id).single();
    if (tx) {
      const delta = tx.type === 'income' ? -tx.amount : tx.amount;
      await DB.updateWallet(delta);
    }
    const { error } = await db().from('transactions').delete().eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  // ── INVESTIMENTOS ─────────────────────────────────────────
  async getInvestments() {
    const { data, error } = await db().from('investments')
      .select('*').eq('user_id', uid()).eq('is_active', true).order('ticker');
    if (error) throw error;
    return data || [];
  },

  async addInvestment(ticker, name, type, quantity, avgPrice, date, notes) {
    const totalInvested = quantity * avgPrice;
    const { data, error } = await db().from('investments')
      .insert({ user_id: uid(), ticker: ticker.toUpperCase(), name, type, quantity, avg_price: avgPrice, total_invested: totalInvested, date, notes })
      .select().single();
    if (error) throw error;

    // Descontar da carteira
    await DB.updateWallet(-totalInvested);
    return data;
  },

  async updateInvestmentPrice(id, currentPrice) {
    const { error } = await db().from('investments').update({ current_price: currentPrice }).eq('id', id);
    if (error) throw error;
  },

  async deleteInvestment(id) {
    const { data: inv } = await db().from('investments').select('*').eq('id', id).single();
    if (inv) {
      // Devolver valor investido para carteira
      await DB.updateWallet(inv.total_invested);
    }
    const { error } = await db().from('investments').update({ is_active: false }).eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  // ── POUPANÇA ──────────────────────────────────────────────
  async getSavings() {
    const { data, error } = await db().from('savings').select('*').eq('user_id', uid()).eq('is_active', true).order('name');
    if (error) throw error;
    return data || [];
  },

  async addSaving(name, color, icon, targetAmount) {
    const { data, error } = await db().from('savings')
      .insert({ user_id: uid(), name, color, icon, target_amount: targetAmount, amount: 0 })
      .select().single();
    if (error) throw error;
    return data;
  },

  async depositSaving(id, amount, date, notes) {
    const { data: saving } = await db().from('savings').select('*').eq('id', id).single();
    const newAmount = (saving.amount || 0) + amount;

    await db().from('savings').update({ amount: newAmount }).eq('id', id);
    await db().from('savings_transactions').insert({ saving_id: id, user_id: uid(), type: 'deposit', amount, date, notes });
    await DB.updateWallet(-amount);
    return newAmount;
  },

  async withdrawSaving(id, amount, date, notes) {
    const { data: saving } = await db().from('savings').select('*').eq('id', id).single();
    const newAmount = Math.max(0, (saving.amount || 0) - amount);

    await db().from('savings').update({ amount: newAmount }).eq('id', id);
    await db().from('savings_transactions').insert({ saving_id: id, user_id: uid(), type: 'withdraw', amount, date, notes });
    await DB.updateWallet(amount);
    return newAmount;
  },

  async deleteSaving(id) {
    const { data: saving } = await db().from('savings').select('*').eq('id', id).single();
    if (saving && saving.amount > 0) {
      await DB.updateWallet(saving.amount);
    }
    const { error } = await db().from('savings').update({ is_active: false }).eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  // ── METAS ─────────────────────────────────────────────────
  async getGoals() {
    const { data, error } = await db().from('goals').select('*').eq('user_id', uid()).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addGoal(name, description, targetAmount, deadline, color, icon) {
    const { data, error } = await db().from('goals')
      .insert({ user_id: uid(), name, description, target_amount: targetAmount, deadline, color, icon })
      .select().single();
    if (error) throw error;
    return data;
  },

  async depositGoal(id, amount, date, notes) {
    const { data: goal } = await db().from('goals').select('*').eq('id', id).single();
    const newAmount = (goal.current_amount || 0) + amount;
    const isCompleted = newAmount >= goal.target_amount;

    await db().from('goals').update({ current_amount: newAmount, is_completed: isCompleted }).eq('id', id);
    await db().from('goal_transactions').insert({ goal_id: id, user_id: uid(), type: 'deposit', amount, date, notes });
    await DB.updateWallet(-amount);
    return newAmount;
  },

  async withdrawGoal(id, amount, date, notes) {
    const { data: goal } = await db().from('goals').select('*').eq('id', id).single();
    const newAmount = Math.max(0, (goal.current_amount || 0) - amount);

    await db().from('goals').update({ current_amount: newAmount, is_completed: false }).eq('id', id);
    await db().from('goal_transactions').insert({ goal_id: id, user_id: uid(), type: 'withdraw', amount, date, notes });
    await DB.updateWallet(amount);
    return newAmount;
  },

  async deleteGoal(id) {
    const { data: goal } = await db().from('goals').select('*').eq('id', id).single();
    if (goal && goal.current_amount > 0) {
      await DB.updateWallet(goal.current_amount);
    }
    const { error } = await db().from('goals').delete().eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  // ── DÍVIDAS ───────────────────────────────────────────────
  async getDebts() {
    const { data, error } = await db().from('debts').select('*').eq('user_id', uid()).eq('is_active', true).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addDebt(name, description, totalAmount, installmentValue, totalInstallments, dueDay, startDate, color, icon) {
    const { data, error } = await db().from('debts')
      .insert({ user_id: uid(), name, description, total_amount: totalAmount, installment_value: installmentValue, total_installments: totalInstallments, paid_installments: 0, due_day: dueDay, start_date: startDate, color, icon })
      .select().single();
    if (error) throw error;
    return data;
  },

  async payDebtInstallment(id, installmentNumber, amount, paidDate, notes) {
    const { data: debt } = await db().from('debts').select('*').eq('id', id).single();
    const newPaid = (debt.paid_installments || 0) + 1;
    const isFinished = newPaid >= debt.total_installments;

    await db().from('debts').update({ paid_installments: newPaid, is_active: !isFinished }).eq('id', id);
    await db().from('debt_payments').insert({ debt_id: id, user_id: uid(), installment_number: installmentNumber, amount, paid_date: paidDate, notes });
    // Pagar parcela desconta da carteira
    await DB.updateWallet(-amount);
    return newPaid;
  },

  async deleteDebt(id) {
    // Buscar parcelas já pagas para devolver à carteira
    const { data: debt } = await db().from('debts').select('*').eq('id', id).single();
    if (debt && debt.paid_installments > 0) {
      const valorPago = debt.installment_value * debt.paid_installments;
      await DB.updateWallet(valorPago);
    }
    const { error } = await db().from('debts').update({ is_active: false }).eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  // ── CALENDÁRIO ────────────────────────────────────────────
  async getCalendarBills() {
    const { data, error } = await db().from('calendar_bills')
      .select('*, categories(name, color, icon)')
      .eq('user_id', uid()).eq('is_active', true).order('due_day');
    if (error) throw error;
    return data || [];
  },

  async addCalendarBill(name, amount, dueDay, categoryId, isRecurring, color, icon) {
    const { data, error } = await db().from('calendar_bills')
      .insert({ user_id: uid(), name, amount, due_day: dueDay, category_id: categoryId, is_recurring: isRecurring, color, icon })
      .select().single();
    if (error) throw error;
    return data;
  },

  async deleteCalendarBill(id) {
    const { error } = await db().from('calendar_bills').update({ is_active: false }).eq('id', id).eq('user_id', uid());
    if (error) throw error;
  },

  // ── CONFIGURAÇÕES ─────────────────────────────────────────
  async getSettings() {
    const { data, error } = await db().from('user_settings').select('*').eq('user_id', uid()).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || { theme_name: 'nexus-dark', theme_custom: {} };
  },

  async saveSettings(themeName, themeCustom) {
    const { error } = await db().from('user_settings').upsert({
      user_id: uid(), theme_name: themeName, theme_custom: themeCustom, updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
  }
};

// Extensões adicionais ao DB (fora do objeto para evitar vírgula)
DB.resetAllData = async function() {
  const u = uid();
  // Deletar todos os dados do usuário em ordem correta
  await db().from('debt_payments').delete().eq('user_id', u);
  await db().from('debts').delete().eq('user_id', u);
  await db().from('goal_transactions').delete().eq('user_id', u);
  await db().from('goals').delete().eq('user_id', u);
  await db().from('savings_transactions').delete().eq('user_id', u);
  await db().from('savings').delete().eq('user_id', u);
  await db().from('investments').delete().eq('user_id', u);
  await db().from('transactions').delete().eq('user_id', u);
  await db().from('calendar_bills').delete().eq('user_id', u);
  await db().from('categories').delete().eq('user_id', u);
  // Zerar carteira
  await db().from('wallet').update({ balance: 0, total_income: 0, total_expense: 0, updated_at: new Date().toISOString() }).eq('user_id', u);
};

DB.updateTransaction = async function(id, type, amount, description, categoryId, date, notes) {
  // Buscar transação antiga para reverter carteira
  const { data: old } = await db().from('transactions').select('*').eq('id', id).single();
  if (old) {
    const oldDelta = old.type === 'income' ? -old.amount : old.amount;
    await DB.updateWallet(oldDelta); // reverter
  }
  const { error } = await db().from('transactions').update({ type, amount, description, category_id: categoryId, date, notes }).eq('id', id).eq('user_id', uid());
  if (error) throw error;
  // Aplicar novo valor
  const newDelta = type === 'income' ? amount : -amount;
  await DB.updateWallet(newDelta);
};

DB.updateInvestment = async function(id, quantity, avgPrice, notes) {
  const { data: old } = await db().from('investments').select('*').eq('id', id).single();
  const newTotal = quantity * avgPrice;
  if (old) {
    const diff = newTotal - old.total_invested;
    await DB.updateWallet(-diff); // ajustar diferença
  }
  const { error } = await db().from('investments').update({ quantity, avg_price: avgPrice, total_invested: newTotal, notes }).eq('id', id).eq('user_id', uid());
  if (error) throw error;
};

DB.resetAllUserData = async function() {
  const u = uid();
  await db().from('debt_payments').delete().eq('user_id', u);
  await db().from('debts').delete().eq('user_id', u);
  await db().from('goal_transactions').delete().eq('user_id', u);
  await db().from('goals').delete().eq('user_id', u);
  await db().from('savings_transactions').delete().eq('user_id', u);
  await db().from('savings').delete().eq('user_id', u);
  await db().from('investments').update({ is_active: false }).eq('user_id', u);
  await db().from('transactions').delete().eq('user_id', u);
  await db().from('calendar_bills').delete().eq('user_id', u);
  await db().from('categories').delete().eq('user_id', u);
  await db().from('wallet').update({ balance: 0, total_income: 0, total_expense: 0, updated_at: new Date().toISOString() }).eq('user_id', u);
};
