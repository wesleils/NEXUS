// ============================================================
// NEXUS - App principal (app.js)
// ============================================================

// Estado global
let state = {
  wallet: null,
  transactions: [],
  categories: [],
  investments: [],
  savings: [],
  goals: [],
  debts: [],
  calendarBills: [],
  activeSection: 'overview'
};

// ── INICIALIZAÇÃO ────────────────────────────────────────────
async function initApp() {
  try {
    showLoader(true);
    await loadTheme();
    const loggedIn = await initAuth();

    if (!loggedIn) {
      showAuthScreen();
      return;
    }

    showAppScreen();
    await loadAllData();
    setupEventListeners();
    showLoader(false);
  } catch (e) {
    console.error('Erro ao inicializar:', e);
    showToast('Erro ao carregar dados', 'error');
    showLoader(false);
  }
}

// Carregar todos os dados
async function loadAllData() {
  const [wallet, transactions, categories, investments, savings, goals, debts, calendarBills] = await Promise.all([
    DB.getWallet(),
    DB.getTransactions(),
    DB.getCategories(),
    DB.getInvestments(),
    DB.getSavings(),
    DB.getGoals(),
    DB.getDebts(),
    DB.getCalendarBills()
  ]);

  state = { ...state, wallet, transactions, categories, investments, savings, goals, debts, calendarBills };

  renderAll();
}

function renderAll() {
  renderSummaryCards();
  renderTransactions();
  renderCategories();
  renderSavingsList();
  renderGoalsList();
  renderDebtsList();
  renderCalendar();
  loadInvestments();
  updateAllCharts();
}

// ── SUMMARY CARDS ────────────────────────────────────────────
async function updateDashboardSummary() {
  state.wallet = await DB.getWallet();
  state.investments = await DB.getInvestments();
  state.savings = await DB.getSavings();
  state.goals = await DB.getGoals();
  state.debts = await DB.getDebts();
  renderSummaryCards();
  updateAllCharts();
}

function renderSummaryCards() {
  const w = state.wallet || {};
  const totalInv = state.investments.reduce((s, i) => s + i.total_invested, 0);
  const totalSav = state.savings.reduce((s, i) => s + i.amount, 0);
  const totalGoals = state.goals.reduce((s, i) => s + i.current_amount, 0);
  const totalDebt = state.debts.reduce((s, d) => s + (d.installment_value * (d.total_installments - d.paid_installments)), 0);
  const totalPatrimony = (w.balance || 0) + totalInv + totalSav + totalGoals;

  setEl('summary-balance',   formatCurrency(w.balance));
  setEl('summary-income',    formatCurrency(w.total_income));
  setEl('summary-expense',   formatCurrency(w.total_expense));
  setEl('summary-invested',  formatCurrency(totalInv));
  setEl('summary-savings',   formatCurrency(totalSav));
  setEl('summary-goals',     formatCurrency(totalGoals));
  setEl('summary-debt',      formatCurrency(totalDebt));
  setEl('summary-patrimony', formatCurrency(totalPatrimony));

  setEl('user-name', getUserName());
  setEl('user-initials', getUserInitials());
}

// ── TRANSAÇÕES ───────────────────────────────────────────────
function renderTransactions(filter = 'all', search = '') {
  const container = document.getElementById('transactions-list');
  if (!container) return;

  let txs = state.transactions;
  if (filter !== 'all') txs = txs.filter(t => t.type === filter);
  if (search) txs = txs.filter(t => t.description.toLowerCase().includes(search.toLowerCase()));

  if (!txs.length) {
    container.innerHTML = `<div class="empty-state">Nenhuma transação encontrada</div>`;
    return;
  }

  container.innerHTML = txs.slice(0, 100).map(tx => `
    <div class="tx-item card-hover">
      <div class="tx-icon" style="background:${tx.categories?.color || 'var(--accent)'}22; color:${tx.categories?.color || 'var(--accent)'}">
        ${tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}
      </div>
      <div class="tx-info">
        <div class="tx-desc">${tx.description}</div>
        <div class="tx-cat">${tx.categories?.name || 'Sem categoria'} · ${formatDate(tx.date)}</div>
      </div>
      <div class="tx-amount ${tx.type === 'income' ? 'positive' : 'negative'}">
        ${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}
      </div>
      <button class="btn-icon" onclick="deleteTransaction('${tx.id}')">🗑</button>
    </div>
  `).join('');
}

async function saveTransaction() {
  const type = document.getElementById('tx-type').value;
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const description = document.getElementById('tx-description').value.trim();
  const categoryId = document.getElementById('tx-category').value || null;
  const date = document.getElementById('tx-date').value;
  const notes = document.getElementById('tx-notes').value;

  if (!amount || !description || !date) {
    showToast('Preencha todos os campos', 'error'); return;
  }

  try {
    const tx = await DB.addTransaction(type, amount, description, categoryId, date, notes);
    state.transactions.unshift({ ...tx, categories: state.categories.find(c => c.id === categoryId) });
    closeModal('modal-transaction');
    renderTransactions();
    await updateDashboardSummary();
    showToast(`${type === 'income' ? 'Receita' : 'Gasto'} registrado!`);
  } catch (e) {
    showToast(e.message || 'Erro ao salvar', 'error');
  }
}

async function deleteTransaction(id) {
  if (!confirm('Excluir essa transação?')) return;
  try {
    await DB.deleteTransaction(id);
    state.transactions = state.transactions.filter(t => t.id !== id);
    renderTransactions();
    await updateDashboardSummary();
    showToast('Transação excluída');
  } catch (e) {
    showToast(e.message || 'Erro', 'error');
  }
}

// ── CATEGORIAS ───────────────────────────────────────────────
function renderCategories() {
  const container = document.getElementById('categories-list');
  if (!container) return;

  if (!state.categories.length) {
    container.innerHTML = `<div class="empty-state">Nenhuma categoria criada</div>`;
  } else {
    container.innerHTML = state.categories.map(cat => `
      <div class="cat-item">
        <span class="cat-icon" style="background:${cat.color}22">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="badge badge-sm" style="color:${cat.color}">
          ${{ income:'Receita', expense:'Gasto', investment:'Investimento', saving:'Poupança', goal:'Meta', debt:'Dívida' }[cat.type] || cat.type}
        </span>
        <button class="btn-icon" onclick="deleteCategory('${cat.id}')">🗑</button>
      </div>
    `).join('');
  }

  // Popular selects de categoria nas forms
  const selects = document.querySelectorAll('.category-select');
  selects.forEach(sel => {
    const current = sel.value;
    sel.innerHTML = `<option value="">Sem categoria</option>` +
      state.categories.map(c => `<option value="${c.id}" ${c.id === current ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('');
  });
}

async function saveCategory() {
  const name = document.getElementById('cat-name').value.trim();
  const type = document.getElementById('cat-type').value;
  const color = document.getElementById('cat-color').value;
  const icon = document.getElementById('cat-icon').value.trim() || '📁';

  if (!name) { showToast('Nome obrigatório', 'error'); return; }

  try {
    const cat = await DB.addCategory(name, type, color, icon);
    state.categories.push(cat);
    closeModal('modal-category');
    renderCategories();
    showToast('Categoria criada!');
  } catch (e) {
    showToast(e.message || 'Erro', 'error');
  }
}

async function deleteCategory(id) {
  if (!confirm('Excluir categoria?')) return;
  try {
    await DB.deleteCategory(id);
    state.categories = state.categories.filter(c => c.id !== id);
    renderCategories();
    showToast('Categoria excluída');
  } catch (e) {
    showToast(e.message || 'Erro', 'error');
  }
}

// ── POUPANÇA ─────────────────────────────────────────────────
function renderSavingsList() {
  const container = document.getElementById('savings-list');
  if (!container) return;

  if (!state.savings.length) {
    container.innerHTML = `<div class="empty-state">Nenhuma poupança criada</div>`;
    return;
  }

  container.innerHTML = state.savings.map(s => {
    const pct = s.target_amount ? Math.min(100, (s.amount / s.target_amount) * 100) : null;
    return `
      <div class="saving-item card-hover">
        <div class="saving-icon" style="background:${s.color}22">${s.icon}</div>
        <div class="saving-info">
          <div class="saving-name">${s.name}</div>
          ${pct !== null ? `
            <div class="progress-bar">
              <div class="progress-fill" style="width:${pct}%; background:${s.color}"></div>
            </div>
            <div class="saving-pct">${formatCurrency(s.amount)} / ${formatCurrency(s.target_amount)} (${pct.toFixed(0)}%)</div>
          ` : `<div class="saving-amt">${formatCurrency(s.amount)}</div>`}
        </div>
        <div class="saving-actions">
          <button class="btn-sm" style="background:${s.color}22; color:${s.color}" onclick="openSavingDeposit('${s.id}','${s.name}')">+ Depositar</button>
          <button class="btn-sm btn-ghost" onclick="openSavingWithdraw('${s.id}','${s.name}')">- Retirar</button>
          <button class="btn-icon" onclick="deleteSaving('${s.id}')">🗑</button>
        </div>
      </div>
    `;
  }).join('');
}

async function saveSaving() {
  const name = document.getElementById('sav-name').value.trim();
  const target = parseFloat(document.getElementById('sav-target').value) || null;
  const color = document.getElementById('sav-color').value;
  const icon = document.getElementById('sav-icon').value.trim() || '🏦';

  if (!name) { showToast('Nome obrigatório', 'error'); return; }
  try {
    const s = await DB.addSaving(name, color, icon, target);
    state.savings.push(s);
    closeModal('modal-saving');
    renderSavingsList();
    showToast('Poupança criada!');
  } catch (e) { showToast(e.message, 'error'); }
}

function openSavingDeposit(id, name) {
  document.getElementById('savtx-id').value = id;
  document.getElementById('savtx-type').value = 'deposit';
  document.getElementById('savtx-title').textContent = `Depositar em ${name}`;
  document.getElementById('savtx-date').value = new Date().toISOString().slice(0,10);
  openModal('modal-saving-tx');
}

function openSavingWithdraw(id, name) {
  document.getElementById('savtx-id').value = id;
  document.getElementById('savtx-type').value = 'withdraw';
  document.getElementById('savtx-title').textContent = `Retirar de ${name}`;
  document.getElementById('savtx-date').value = new Date().toISOString().slice(0,10);
  openModal('modal-saving-tx');
}

async function saveSavingTransaction() {
  const id = document.getElementById('savtx-id').value;
  const type = document.getElementById('savtx-type').value;
  const amount = parseFloat(document.getElementById('savtx-amount').value);
  const date = document.getElementById('savtx-date').value;
  const notes = document.getElementById('savtx-notes').value;

  if (!amount || !date) { showToast('Preencha os campos', 'error'); return; }

  try {
    if (type === 'deposit') await DB.depositSaving(id, amount, date, notes);
    else await DB.withdrawSaving(id, amount, date, notes);
    state.savings = await DB.getSavings();
    closeModal('modal-saving-tx');
    renderSavingsList();
    await updateDashboardSummary();
    showToast(type === 'deposit' ? 'Depósito realizado!' : 'Retirada realizada!');
  } catch (e) { showToast(e.message, 'error'); }
}

async function deleteSaving(id) {
  if (!confirm('Excluir poupança? O saldo retorna à carteira.')) return;
  try {
    await DB.deleteSaving(id);
    state.savings = state.savings.filter(s => s.id !== id);
    renderSavingsList();
    await updateDashboardSummary();
    showToast('Poupança removida, saldo devolvido');
  } catch (e) { showToast(e.message, 'error'); }
}

// ── METAS ────────────────────────────────────────────────────
function renderGoalsList() {
  const container = document.getElementById('goals-list');
  if (!container) return;

  if (!state.goals.length) {
    container.innerHTML = `<div class="empty-state">Nenhuma meta cadastrada</div>`;
    return;
  }

  container.innerHTML = state.goals.map(g => {
    const pct = Math.min(100, (g.current_amount / g.target_amount) * 100);
    const remaining = g.target_amount - g.current_amount;
    return `
      <div class="goal-item card-hover ${g.is_completed ? 'completed' : ''}">
        <div class="goal-header">
          <span class="goal-icon" style="background:${g.color}22">${g.icon}</span>
          <div>
            <div class="goal-name">${g.name} ${g.is_completed ? '✅' : ''}</div>
            ${g.deadline ? `<div class="goal-deadline">Prazo: ${formatDate(g.deadline)}</div>` : ''}
          </div>
          <button class="btn-icon" onclick="deleteGoal('${g.id}')">🗑</button>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%; background:${g.color}"></div>
        </div>
        <div class="goal-values">
          <span>${formatCurrency(g.current_amount)} de ${formatCurrency(g.target_amount)}</span>
          <span>${pct.toFixed(0)}%</span>
        </div>
        ${!g.is_completed ? `
          <button class="btn-sm mt-8" style="background:${g.color}22; color:${g.color}" onclick="openGoalDeposit('${g.id}','${g.name}')">
            + Adicionar ${formatCurrency(remaining)} restantes
          </button>
        ` : ''}
      </div>
    `;
  }).join('');
}

async function saveGoal() {
  const name = document.getElementById('goal-name').value.trim();
  const desc = document.getElementById('goal-desc').value;
  const target = parseFloat(document.getElementById('goal-target').value);
  const deadline = document.getElementById('goal-deadline').value || null;
  const color = document.getElementById('goal-color').value;
  const icon = document.getElementById('goal-icon').value.trim() || '🎯';

  if (!name || !target) { showToast('Preencha os campos obrigatórios', 'error'); return; }
  try {
    const g = await DB.addGoal(name, desc, target, deadline, color, icon);
    state.goals.push(g);
    closeModal('modal-goal');
    renderGoalsList();
    showToast('Meta criada!');
  } catch (e) { showToast(e.message, 'error'); }
}

function openGoalDeposit(id, name) {
  document.getElementById('goaltx-id').value = id;
  document.getElementById('goaltx-title').textContent = `Adicionar à meta: ${name}`;
  document.getElementById('goaltx-date').value = new Date().toISOString().slice(0,10);
  openModal('modal-goal-tx');
}

async function saveGoalTransaction() {
  const id = document.getElementById('goaltx-id').value;
  const amount = parseFloat(document.getElementById('goaltx-amount').value);
  const date = document.getElementById('goaltx-date').value;
  const notes = document.getElementById('goaltx-notes').value;

  if (!amount || !date) { showToast('Preencha os campos', 'error'); return; }
  try {
    await DB.depositGoal(id, amount, date, notes);
    state.goals = await DB.getGoals();
    closeModal('modal-goal-tx');
    renderGoalsList();
    await updateDashboardSummary();
    showToast('Valor adicionado à meta!');
  } catch (e) { showToast(e.message, 'error'); }
}

async function deleteGoal(id) {
  if (!confirm('Excluir meta? O saldo retorna à carteira.')) return;
  try {
    await DB.deleteGoal(id);
    state.goals = state.goals.filter(g => g.id !== id);
    renderGoalsList();
    await updateDashboardSummary();
    showToast('Meta excluída, saldo devolvido');
  } catch (e) { showToast(e.message, 'error'); }
}

// ── DÍVIDAS ──────────────────────────────────────────────────
function renderDebtsList() {
  const container = document.getElementById('debts-list');
  if (!container) return;

  if (!state.debts.length) {
    container.innerHTML = `<div class="empty-state">Nenhuma dívida cadastrada</div>`;
    return;
  }

  container.innerHTML = state.debts.map(d => {
    const remaining = d.total_installments - d.paid_installments;
    const remainingValue = remaining * d.installment_value;
    const pct = (d.paid_installments / d.total_installments) * 100;
    return `
      <div class="debt-item card-hover">
        <div class="debt-header">
          <span class="debt-icon" style="background:${d.color}22">${d.icon}</span>
          <div>
            <div class="debt-name">${d.name}</div>
            <div class="debt-sub">Vence dia ${d.due_day} · ${d.paid_installments}/${d.total_installments} parcelas</div>
          </div>
          <div class="debt-amounts">
            <div class="negative">${formatCurrency(remainingValue)}</div>
            <div style="font-size:11px; color:var(--text-muted)">restante</div>
          </div>
          <button class="btn-icon" onclick="deleteDebt('${d.id}')">🗑</button>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%; background:${d.color}"></div>
        </div>
        <div class="debt-footer">
          <span style="font-size:12px; color:var(--text-muted)">${pct.toFixed(0)}% pago · Parcela: ${formatCurrency(d.installment_value)}</span>
          ${remaining > 0 ? `<button class="btn-sm" style="background:${d.color}22; color:${d.color}" onclick="payDebtInstallment('${d.id}','${d.paid_installments + 1}','${d.installment_value}')">Pagar parcela ${d.paid_installments + 1}</button>` : '<span class="positive">✅ Quitada</span>'}
        </div>
      </div>
    `;
  }).join('');
}

async function saveDebt() {
  const name = document.getElementById('debt-name').value.trim();
  const desc = document.getElementById('debt-desc').value;
  const installmentVal = parseFloat(document.getElementById('debt-installment').value);
  const totalInstallments = parseInt(document.getElementById('debt-total-inst').value);
  const dueDay = parseInt(document.getElementById('debt-due-day').value);
  const startDate = document.getElementById('debt-start').value;
  const color = document.getElementById('debt-color').value;
  const icon = document.getElementById('debt-icon').value.trim() || '💳';
  const totalAmount = installmentVal * totalInstallments;

  if (!name || !installmentVal || !totalInstallments || !dueDay || !startDate) {
    showToast('Preencha os campos obrigatórios', 'error'); return;
  }
  try {
    const d = await DB.addDebt(name, desc, totalAmount, installmentVal, totalInstallments, dueDay, startDate, color, icon);
    state.debts.push(d);
    closeModal('modal-debt');
    renderDebtsList();
    showToast('Dívida cadastrada!');
  } catch (e) { showToast(e.message, 'error'); }
}

async function payDebtInstallment(id, installmentNumber, amount) {
  if (!confirm(`Pagar parcela ${installmentNumber} de ${formatCurrency(parseFloat(amount))}?`)) return;
  try {
    await DB.payDebtInstallment(id, parseInt(installmentNumber), parseFloat(amount), new Date().toISOString().slice(0,10), '');
    state.debts = await DB.getDebts();
    renderDebtsList();
    await updateDashboardSummary();
    showToast('Parcela paga!');
  } catch (e) { showToast(e.message, 'error'); }
}

async function deleteDebt(id) {
  if (!confirm('Excluir dívida?')) return;
  try {
    await DB.deleteDebt(id);
    state.debts = state.debts.filter(d => d.id !== id);
    renderDebtsList();
    showToast('Dívida removida');
  } catch (e) { showToast(e.message, 'error'); }
}

// ── CALENDÁRIO ───────────────────────────────────────────────
function renderCalendar() {
  const container = document.getElementById('calendar-grid');
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Header do calendário
  const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const calTitle = document.getElementById('calendar-month');
  if (calTitle) calTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Montar grid
  let html = '<div class="cal-weekdays">';
  ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(d => { html += `<div class="cal-wd">${d}</div>`; });
  html += '</div><div class="cal-days">';

  for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const bills = state.calendarBills.filter(b => b.due_day === d);
    const debtBills = state.debts.filter(db => db.due_day === d && db.is_active);
    const isToday = d === today;
    const hasBill = bills.length > 0 || debtBills.length > 0;

    html += `
      <div class="cal-day ${isToday ? 'today' : ''} ${hasBill ? 'has-bill' : ''}" onclick="showDayBills(${d})">
        <span class="cal-day-num">${d}</span>
        ${bills.slice(0,2).map(b => `<div class="cal-bill-dot" style="background:${b.color}" title="${b.name}: ${formatCurrency(b.amount)}"></div>`).join('')}
        ${debtBills.slice(0,1).map(b => `<div class="cal-bill-dot" style="background:${b.color}" title="${b.name}: ${formatCurrency(b.installment_value)}"></div>`).join('')}
      </div>
    `;
  }
  html += '</div>';
  container.innerHTML = html;

  // Lista de contas do mês
  renderBillsList();
}

function renderBillsList() {
  const container = document.getElementById('bills-list');
  if (!container) return;

  const today = new Date().getDate();
  const allBills = [
    ...state.calendarBills.map(b => ({ ...b, billType: 'bill', amount: b.amount })),
    ...state.debts.filter(d => d.is_active).map(d => ({
      ...d, billType: 'debt', amount: d.installment_value, name: `${d.name} (parcela ${d.paid_installments+1}/${d.total_installments})`, color: d.color, icon: d.icon, due_day: d.due_day
    }))
  ].sort((a, b) => a.due_day - b.due_day);

  if (!allBills.length) { container.innerHTML = `<div class="empty-state">Nenhuma conta cadastrada</div>`; return; }

  container.innerHTML = allBills.map(b => {
    const isPast = b.due_day < today;
    const isToday = b.due_day === today;
    return `
      <div class="bill-item ${isToday ? 'bill-today' : ''} ${isPast ? 'bill-past' : ''}">
        <div class="bill-day" style="color:${b.color}">${String(b.due_day).padStart(2,'0')}</div>
        <div class="bill-icon">${b.icon || '📅'}</div>
        <div class="bill-name">${b.name}</div>
        <div class="bill-amount negative">${formatCurrency(b.amount)}</div>
        ${b.billType === 'bill' ? `<button class="btn-icon" onclick="deleteCalendarBill('${b.id}')">🗑</button>` : ''}
      </div>
    `;
  }).join('');
}

function showDayBills(day) {
  const bills = state.calendarBills.filter(b => b.due_day === day);
  const debts = state.debts.filter(d => d.due_day === day && d.is_active);
  if (!bills.length && !debts.length) return;

  const total = [...bills.map(b=>b.amount), ...debts.map(d=>d.installment_value)].reduce((s,v)=>s+v,0);
  showToast(`Dia ${day}: ${bills.length + debts.length} conta(s) · Total: ${formatCurrency(total)}`, 'info');
}

async function saveCalendarBill() {
  const name = document.getElementById('bill-name').value.trim();
  const amount = parseFloat(document.getElementById('bill-amount').value);
  const dueDay = parseInt(document.getElementById('bill-due-day').value);
  const catId = document.getElementById('bill-category').value || null;
  const isRecurring = document.getElementById('bill-recurring').checked;
  const color = document.getElementById('bill-color').value;
  const icon = document.getElementById('bill-icon').value.trim() || '📅';

  if (!name || !amount || !dueDay) { showToast('Preencha os campos', 'error'); return; }
  try {
    const b = await DB.addCalendarBill(name, amount, dueDay, catId, isRecurring, color, icon);
    state.calendarBills.push(b);
    closeModal('modal-bill');
    renderCalendar();
    showToast('Conta adicionada ao calendário!');
  } catch (e) { showToast(e.message, 'error'); }
}

async function deleteCalendarBill(id) {
  if (!confirm('Remover conta do calendário?')) return;
  try {
    await DB.deleteCalendarBill(id);
    state.calendarBills = state.calendarBills.filter(b => b.id !== id);
    renderCalendar();
    showToast('Conta removida');
  } catch (e) { showToast(e.message, 'error'); }
}

// ── AUTH UI ──────────────────────────────────────────────────
function showAuthScreen() {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('app-screen').style.display = 'none';
}

function showAppScreen() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showToast('Preencha email e senha', 'error'); return; }

  try {
    showLoader(true);
    await signIn(email, password);
    showAppScreen();
    await loadAllData();
    showLoader(false);
  } catch (e) {
    showLoader(false);
    showToast(e.message || 'Credenciais inválidas', 'error');
  }
}

async function handleSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  if (!name || !email || !password) { showToast('Preencha todos os campos', 'error'); return; }
  if (password.length < 6) { showToast('Senha mínimo 6 caracteres', 'error'); return; }

  try {
    showLoader(true);
    await signUp(email, password, name);
    showLoader(false);
    showToast('Conta criada! Verifique seu email para confirmar.', 'info');
    toggleAuthTab('login');
  } catch (e) {
    showLoader(false);
    showToast(e.message || 'Erro ao criar conta', 'error');
  }
}

function toggleAuthTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
}

// ── UTILITÁRIOS ──────────────────────────────────────────────
function setEl(id, content) {
  const el = document.getElementById(id);
  if (el) el.textContent = content;
}

function showLoader(show) {
  const el = document.getElementById('app-loader');
  if (el) el.style.display = show ? 'flex' : 'none';
}

function setupEventListeners() {
  // Enter nos inputs de login
  document.getElementById('login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });

  // Busca de transações
  document.getElementById('tx-search')?.addEventListener('input', e => {
    renderTransactions(document.getElementById('tx-filter').value, e.target.value);
  });
  document.getElementById('tx-filter')?.addEventListener('change', e => {
    renderTransactions(e.target.value, document.getElementById('tx-search').value);
  });

  // Fechar modais com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
}

// Iniciar
document.addEventListener('DOMContentLoaded', initApp);
