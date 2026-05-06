// ============================================================
// NEXUS - Gráficos (charts.js)
// ============================================================

let charts = {};

function getChartColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    accent:   s.getPropertyValue('--accent').trim(),
    accent2:  s.getPropertyValue('--accent2').trim(),
    positive: s.getPropertyValue('--positive').trim(),
    negative: s.getPropertyValue('--negative').trim(),
    warning:  s.getPropertyValue('--warning').trim(),
    info:     s.getPropertyValue('--info').trim(),
    text:     s.getPropertyValue('--text').trim(),
    textMuted:s.getPropertyValue('--text-muted').trim(),
    border:   s.getPropertyValue('--border').trim(),
    surface:  s.getPropertyValue('--surface').trim(),
  };
}

function destroyChart(key) {
  if (charts[key]) { charts[key].destroy(); delete charts[key]; }
}

// ── GRÁFICO 1: Linha - Fluxo de caixa ao longo do tempo ─────
async function renderCashflowChart(transactions) {
  destroyChart('cashflow');
  const canvas = document.getElementById('chart-cashflow');
  if (!canvas) return;

  const c = getChartColors();

  // Agrupar por mês
  const monthly = {};
  transactions.forEach(tx => {
    const month = tx.date.slice(0, 7);
    if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
    if (tx.type === 'income') monthly[month].income += tx.amount;
    else monthly[month].expense += tx.amount;
  });

  const labels = Object.keys(monthly).sort().slice(-12);
  const incomeData = labels.map(m => monthly[m]?.income || 0);
  const expenseData = labels.map(m => monthly[m]?.expense || 0);
  const balanceData = labels.map((m, i) => incomeData[i] - expenseData[i]);

  charts['cashflow'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels.map(l => {
        const [y, m] = l.split('-');
        return new Date(y, m-1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      }),
      datasets: [
        {
          label: 'Receitas',
          data: incomeData,
          borderColor: c.positive,
          backgroundColor: c.positive + '20',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: c.positive,
        },
        {
          label: 'Gastos',
          data: expenseData,
          borderColor: c.negative,
          backgroundColor: c.negative + '20',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: c.negative,
        },
        {
          label: 'Saldo',
          data: balanceData,
          borderColor: c.accent,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: c.accent,
        }
      ]
    },
    options: chartDefaults(c, true)
  });
}

// ── GRÁFICO 2: Donut - Gastos por categoria ──────────────────
async function renderCategoryChart(transactions) {
  destroyChart('categories');
  const canvas = document.getElementById('chart-categories');
  if (!canvas) return;

  const c = getChartColors();
  const expenses = transactions.filter(t => t.type === 'expense');
  const byCategory = {};

  expenses.forEach(tx => {
    const name = tx.categories?.name || 'Sem categoria';
    const color = tx.categories?.color || c.accent;
    if (!byCategory[name]) byCategory[name] = { total: 0, color };
    byCategory[name].total += tx.amount;
  });

  const sorted = Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total).slice(0, 8);

  charts['categories'] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: sorted.map(([k]) => k),
      datasets: [{
        data: sorted.map(([, v]) => v.total),
        backgroundColor: sorted.map(([, v]) => v.color + 'cc'),
        borderColor: sorted.map(([, v]) => v.color),
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      ...chartDefaults(c, false),
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: { color: c.textMuted, font: { size: 11 }, padding: 12, boxWidth: 12 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${formatCurrency(ctx.raw)}`
          }
        }
      }
    }
  });
}

// ── GRÁFICO 3: Barras - Receita vs Gasto por categoria ───────
async function renderIncomeVsExpenseChart(transactions) {
  destroyChart('income-expense');
  const canvas = document.getElementById('chart-income-expense');
  if (!canvas) return;

  const c = getChartColors();

  // Últimos 6 meses
  const monthly = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    monthly[key] = { income: 0, expense: 0 };
  }

  transactions.forEach(tx => {
    const key = tx.date.slice(0, 7);
    if (monthly[key]) {
      if (tx.type === 'income') monthly[key].income += tx.amount;
      else monthly[key].expense += tx.amount;
    }
  });

  const labels = Object.keys(monthly);

  charts['income-expense'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels.map(l => {
        const [y, m] = l.split('-');
        return new Date(y, m-1).toLocaleDateString('pt-BR', { month: 'short' });
      }),
      datasets: [
        {
          label: 'Receitas',
          data: labels.map(l => monthly[l].income),
          backgroundColor: c.positive + 'bb',
          borderColor: c.positive,
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Gastos',
          data: labels.map(l => monthly[l].expense),
          backgroundColor: c.negative + 'bb',
          borderColor: c.negative,
          borderWidth: 1,
          borderRadius: 6,
        }
      ]
    },
    options: {
      ...chartDefaults(c, true),
      plugins: { ...chartDefaults(c, true).plugins, legend: { labels: { color: c.textMuted, font: { size: 11 } } } }
    }
  });
}

// ── GRÁFICO 4: Área - Patrimônio total acumulado ─────────────
async function renderPatrimonyChart() {
  destroyChart('patrimony');
  const canvas = document.getElementById('chart-patrimony');
  if (!canvas) return;

  const c = getChartColors();

  // Buscar transações ordenadas
  const transactions = await DB.getTransactions(1000);
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  let running = 0;
  const points = [];
  const labels = [];

  sorted.forEach(tx => {
    running += tx.type === 'income' ? tx.amount : -tx.amount;
    points.push(running);
    labels.push(formatDate(tx.date));
  });

  // Simplificar para no máximo 60 pontos
  const step = Math.max(1, Math.floor(points.length / 60));
  const sampledLabels = labels.filter((_, i) => i % step === 0 || i === labels.length - 1);
  const sampledData = points.filter((_, i) => i % step === 0 || i === points.length - 1);

  charts['patrimony'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: sampledLabels,
      datasets: [{
        label: 'Patrimônio líquido',
        data: sampledData,
        borderColor: c.accent,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, c.accent + '60');
          gradient.addColorStop(1, c.accent + '05');
          return gradient;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      }]
    },
    options: {
      ...chartDefaults(c, true),
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${formatCurrency(ctx.raw)}` } } }
    }
  });
}

// ── GRÁFICO 5: Radar - Saúde financeira ──────────────────────
async function renderHealthChart(wallet, investments, savings, goals, debts) {
  destroyChart('health');
  const canvas = document.getElementById('chart-health');
  if (!canvas) return;

  const c = getChartColors();

  const totalSavings = savings.reduce((s, x) => s + x.amount, 0);
  const totalInv = investments.reduce((s, x) => s + x.total_invested, 0);
  const totalGoals = goals.reduce((s, x) => s + x.current_amount, 0);
  const totalDebt = debts.reduce((s, x) => s + (x.installment_value * (x.total_installments - x.paid_installments)), 0);
  const income = wallet.total_income || 1;

  // Scores 0-10
  const savingsRate = Math.min(10, (totalSavings / income) * 10 * 12);
  const investRate = Math.min(10, (totalInv / income) * 10 * 12);
  const goalRate = Math.min(10, goals.length * 2);
  const debtRate = Math.max(0, 10 - Math.min(10, (totalDebt / income) * 2));
  const balanceRate = Math.min(10, (wallet.balance / (income / 12 || 1)));

  charts['health'] = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Poupança', 'Investimentos', 'Metas', 'Controle de dívidas', 'Liquidez'],
      datasets: [{
        label: 'Saúde financeira',
        data: [savingsRate, investRate, goalRate, debtRate, balanceRate],
        borderColor: c.accent,
        backgroundColor: c.accent + '30',
        pointBackgroundColor: c.accent,
        pointBorderColor: c.accent2,
        borderWidth: 2,
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 10,
          grid: { color: c.border },
          angleLines: { color: c.border },
          pointLabels: { color: c.textMuted, font: { size: 11 } },
          ticks: { display: false, stepSize: 2 }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// Defaults comuns de chart
function chartDefaults(c, showXY = true) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: c.surface,
        borderColor: c.border,
        borderWidth: 1,
        titleColor: c.text,
        bodyColor: c.textMuted,
        padding: 10,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` }
      }
    },
    scales: showXY ? {
      x: {
        grid: { color: c.border + '50', drawBorder: false },
        ticks: { color: c.textMuted, font: { size: 11 } }
      },
      y: {
        grid: { color: c.border + '50', drawBorder: false },
        ticks: {
          color: c.textMuted, font: { size: 11 },
          callback: (v) => formatCurrency(v).replace('R$\u00a0', 'R$ ').slice(0, 10)
        }
      }
    } : {}
  };
}

// Atualizar todos os gráficos
async function updateAllCharts() {
  try {
    const [transactions, investments, savings, goals, debts, wallet] = await Promise.all([
      DB.getTransactions(),
      DB.getInvestments(),
      DB.getSavings(),
      DB.getGoals(),
      DB.getDebts(),
      DB.getWallet()
    ]);

    await Promise.all([
      renderCashflowChart(transactions),
      renderCategoryChart(transactions),
      renderIncomeVsExpenseChart(transactions),
      renderPatrimonyChart(),
      renderHealthChart(wallet, investments, savings, goals, debts)
    ]);
  } catch (e) {
    console.error('Erro ao atualizar gráficos:', e);
  }
}
