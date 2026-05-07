// ============================================================
// NEXUS - Gráficos Sofisticados v2
// ============================================================

let charts = {};

// Paleta de cores do tema atual
function C() {
  const s = getComputedStyle(document.documentElement);
  const get = v => s.getPropertyValue(v).trim();
  return {
    accent:   get('--accent'),
    accent2:  get('--accent2'),
    positive: get('--positive'),
    negative: get('--negative'),
    warning:  get('--warning'),
    info:     get('--info'),
    text:     get('--text'),
    muted:    get('--text-muted'),
    dim:      get('--text-dim'),
    border:   get('--border'),
    surface:  get('--surface'),
    surface2: get('--surface2'),
    bg:       get('--bg'),
  };
}

function destroyChart(key) {
  if (charts[key]) { charts[key].destroy(); delete charts[key]; }
}

// Gradiente vertical helper
function grad(ctx, top, bottom, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h || 300);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  return g;
}

// Hex + alpha helper
function alpha(hex, a) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

// Tooltip premium padrão
function premiumTooltip(c) {
  return {
    enabled: true,
    backgroundColor: c.surface,
    borderColor: c.border,
    borderWidth: 1,
    titleColor: c.text,
    bodyColor: c.dim,
    padding: { top: 10, bottom: 10, left: 14, right: 14 },
    cornerRadius: 10,
    titleFont: { size: 11, weight: '700' },
    bodyFont: { size: 11 },
    displayColors: true,
    boxWidth: 8, boxHeight: 8,
    boxPadding: 4,
    callbacks: {
      label: ctx => ` ${ctx.dataset.label || ''}: ${formatCurrency(ctx.raw)}`
    }
  };
}

// Grid e eixos padrão
function premiumScales(c, yCallback) {
  return {
    x: {
      grid: { color: alpha(c.border, 0.5), drawBorder: false, lineWidth: 1 },
      ticks: { color: c.muted, font: { size: 10 }, maxTicksLimit: 8 },
      border: { display: false }
    },
    y: {
      grid: { color: alpha(c.border, 0.5), drawBorder: false, lineWidth: 1 },
      ticks: {
        color: c.muted, font: { size: 10 }, maxTicksLimit: 6,
        callback: yCallback || (v => {
          if (Math.abs(v) >= 1000) return 'R$' + (v/1000).toFixed(0) + 'k';
          return 'R$' + v.toFixed(0);
        })
      },
      border: { display: false }
    }
  };
}

// ── GRÁFICO 1: Fluxo de caixa — linha com gradiente e glow ──
async function renderCashflowChart(transactions) {
  destroyChart('cashflow');
  const canvas = document.getElementById('chart-cashflow');
  if (!canvas) return;
  const c = C();

  const monthly = {};
  transactions.forEach(tx => {
    const m = tx.date.slice(0,7);
    if (!monthly[m]) monthly[m] = { income:0, expense:0 };
    monthly[m][tx.type === 'income' ? 'income' : 'expense'] += tx.amount;
  });

  const labels = Object.keys(monthly).sort().slice(-12);
  const income  = labels.map(m => monthly[m]?.income  || 0);
  const expense = labels.map(m => monthly[m]?.expense || 0);
  const balance = labels.map((_,i) => income[i] - expense[i]);

  charts['cashflow'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels.map(l => {
        const [y,m] = l.split('-');
        return new Date(y,m-1).toLocaleDateString('pt-BR',{month:'short'}).replace('.','');
      }),
      datasets: [
        {
          label: 'Receitas',
          data: income,
          borderColor: c.positive,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: c.positive,
          tension: 0.45,
          fill: true,
          backgroundColor: ctx => grad(ctx.chart.ctx, alpha(c.positive, 0.25), alpha(c.positive, 0.01), ctx.chart.height),
        },
        {
          label: 'Gastos',
          data: expense,
          borderColor: c.negative,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: c.negative,
          tension: 0.45,
          fill: true,
          backgroundColor: ctx => grad(ctx.chart.ctx, alpha(c.negative, 0.2), alpha(c.negative, 0.01), ctx.chart.height),
        },
        {
          label: 'Saldo',
          data: balance,
          borderColor: c.accent,
          borderWidth: 2,
          borderDash: [6,3],
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.45,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode:'index', intersect: false },
      animation: { duration: 800, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { color: c.muted, font:{ size:10 }, boxWidth:8, boxHeight:8, padding:14 }
        },
        tooltip: premiumTooltip(c),
      },
      scales: premiumScales(c),
    }
  });
}

// ── GRÁFICO 2: Gastos por categoria — barras horizontais ─────
async function renderCategoryChart(transactions) {
  destroyChart('categories');
  const canvas = document.getElementById('chart-categories');
  if (!canvas) return;
  const c = C();

  const expenses = transactions.filter(t => t.type === 'expense');
  const byCat = {};
  expenses.forEach(tx => {
    const name  = tx.categories?.name  || 'Outros';
    const color = tx.categories?.color || c.accent;
    if (!byCat[name]) byCat[name] = { total:0, color };
    byCat[name].total += tx.amount;
  });

  const sorted = Object.entries(byCat).sort((a,b) => b[1].total - a[1].total).slice(0,6);

  if (!sorted.length) {
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    return;
  }

  const total = sorted.reduce((s,[,v]) => s + v.total, 0);

  charts['categories'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: sorted.map(([k]) => k.length > 12 ? k.slice(0,11)+'…' : k),
      datasets: [{
        label: 'Gastos',
        data: sorted.map(([,v]) => v.total),
        backgroundColor: ctx => {
          const color = sorted[ctx.dataIndex]?.[1]?.color || c.accent;
          const g = ctx.chart.ctx.createLinearGradient(ctx.chart.width, 0, 0, 0);
          g.addColorStop(0, alpha(color, 0.9));
          g.addColorStop(1, alpha(color, 0.3));
          return g;
        },
        borderColor: sorted.map(([,v]) => v.color || c.accent),
        borderWidth: 0,
        borderRadius: { topRight: 6, bottomRight: 6 },
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...premiumTooltip(c),
          callbacks: {
            label: ctx => {
              const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
              return ` ${formatCurrency(ctx.raw)} (${pct}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: alpha(c.border, 0.4), drawBorder: false },
          ticks: {
            color: c.muted, font:{ size:9 },
            callback: v => 'R$' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v)
          },
          border: { display: false }
        },
        y: {
          grid: { display: false },
          ticks: { color: c.dim, font:{ size:9, weight:'600' } },
          border: { display: false }
        }
      }
    }
  });
}

// ── GRÁFICO 3: Receita × Gasto — barras arredondadas ─────────
async function renderIncomeVsExpenseChart(transactions) {
  destroyChart('income-expense');
  const canvas = document.getElementById('chart-income-expense');
  if (!canvas) return;
  const c = C();

  const now = new Date();
  const monthly = {};
  for (let i=5; i>=0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    monthly[key] = { income:0, expense:0 };
  }
  transactions.forEach(tx => {
    const key = tx.date.slice(0,7);
    if (monthly[key]) monthly[key][tx.type === 'income' ? 'income' : 'expense'] += tx.amount;
  });

  const labels = Object.keys(monthly);

  charts['income-expense'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels.map(l => {
        const [y,m] = l.split('-');
        return new Date(y,m-1).toLocaleDateString('pt-BR',{month:'short'}).replace('.','');
      }),
      datasets: [
        {
          label: 'Receitas',
          data: labels.map(l => monthly[l].income),
          backgroundColor: ctx => {
            const g = ctx.chart.ctx.createLinearGradient(0,0,0,ctx.chart.height);
            g.addColorStop(0, alpha(c.positive, 0.9));
            g.addColorStop(1, alpha(c.positive, 0.5));
            return g;
          },
          borderColor: c.positive,
          borderWidth: 0,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Gastos',
          data: labels.map(l => monthly[l].expense),
          backgroundColor: ctx => {
            const g = ctx.chart.ctx.createLinearGradient(0,0,0,ctx.chart.height);
            g.addColorStop(0, alpha(c.negative, 0.9));
            g.addColorStop(1, alpha(c.negative, 0.5));
            return g;
          },
          borderColor: c.negative,
          borderWidth: 0,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode:'index', intersect:false },
      animation: { duration:700, easing:'easeOutQuart' },
      plugins: {
        legend: { labels:{ color:c.muted, font:{size:10}, boxWidth:8, boxHeight:8, padding:12 } },
        tooltip: premiumTooltip(c),
      },
      scales: {
        ...premiumScales(c),
        x: { ...premiumScales(c).x, grid:{ display:false } }
      }
    }
  });
}

// ── GRÁFICO 4: Patrimônio — área com gradiente dramático ──────
async function renderPatrimonyChart() {
  destroyChart('patrimony');
  const canvas = document.getElementById('chart-patrimony');
  if (!canvas) return;
  const c = C();

  const transactions = await DB.getTransactions(1000);
  const sorted = [...transactions].sort((a,b) => a.date.localeCompare(b.date));
  if (!sorted.length) return;

  let running = 0;
  const points = [];
  const dates  = [];
  sorted.forEach(tx => {
    running += tx.type === 'income' ? tx.amount : -tx.amount;
    points.push(Math.round(running * 100) / 100);
    dates.push(tx.date);
  });

  // Amostrar para max 60 pontos
  const step = Math.max(1, Math.floor(points.length / 60));
  const sampledPts  = points.filter((_,i) => i % step === 0 || i === points.length-1);
  const sampledDates = dates.filter((_,i) => i % step === 0 || i === dates.length-1);

  charts['patrimony'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: sampledDates.map(d => formatDate(d)),
      datasets: [{
        label: 'Patrimônio',
        data: sampledPts,
        borderColor: c.accent,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: c.accent,
        tension: 0.35,
        fill: true,
        backgroundColor: ctx => {
          const h = ctx.chart.height;
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, alpha(c.accent, 0.35));
          g.addColorStop(0.6, alpha(c.accent, 0.08));
          g.addColorStop(1, alpha(c.accent, 0));
          return g;
        },
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode:'index', intersect:false },
      animation: { duration:1000, easing:'easeInOutCubic' },
      plugins: {
        legend: { display:false },
        tooltip: {
          ...premiumTooltip(c),
          callbacks: { label: ctx => ` ${formatCurrency(ctx.raw)}` }
        }
      },
      scales: {
        x: {
          grid: { display:false },
          ticks: { display:false },
          border: { display:false }
        },
        y: {
          grid: { color: alpha(c.border,0.5), drawBorder:false },
          ticks: {
            color: c.muted, font:{size:9}, maxTicksLimit:5,
            callback: v => 'R$' + (Math.abs(v)>=1000 ? (v/1000).toFixed(0)+'k' : v.toFixed(0))
          },
          border: { display:false }
        }
      }
    }
  });
}

// ── GRÁFICO 5: Saúde financeira — radar premium ───────────────
async function renderHealthChart(wallet, investments, savings, goals, debts) {
  destroyChart('health');
  const canvas = document.getElementById('chart-health');
  if (!canvas) return;
  const c = C();

  const totalSav  = savings.reduce((s,x) => s + x.amount, 0);
  const totalInv  = investments.reduce((s,x) => s + x.total_invested, 0);
  const goalsDone = goals.filter(g => g.is_completed).length;
  const totalDebt = debts.reduce((s,d) => s + d.installment_value * Math.max(0, d.total_installments - d.paid_installments), 0);
  const income    = wallet.total_income || 1;

  const savScore  = Math.min(10, (totalSav  / income) * 12 * 10);
  const invScore  = Math.min(10, (totalInv  / income) * 12 * 10);
  const goalScore = Math.min(10, (goals.length ? (goalsDone / goals.length) * 10 : 0) + goals.length);
  const debtScore = Math.max(0, 10 - Math.min(10, (totalDebt / income) * 2));
  const liqScore  = Math.min(10, (wallet.balance / ((income/12) || 1)));

  charts['health'] = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Poupança','Investimentos','Metas','Dívidas','Liquidez'],
      datasets: [
        {
          label: 'Sua saúde',
          data: [savScore, invScore, goalScore, debtScore, liqScore],
          borderColor: c.accent,
          borderWidth: 2,
          backgroundColor: alpha(c.accent, 0.15),
          pointBackgroundColor: c.accent,
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Ideal',
          data: [8,8,8,8,8],
          borderColor: alpha(c.positive, 0.4),
          borderWidth: 1,
          borderDash: [4,3],
          backgroundColor: 'transparent',
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration:900, easing:'easeInOutBack' },
      scales: {
        r: {
          min: 0, max: 10,
          grid: { color: alpha(c.border, 0.6), lineWidth: 1 },
          angleLines: { color: alpha(c.border, 0.5) },
          pointLabels: { color: c.muted, font:{ size:9, weight:'600' } },
          ticks: { display:false, stepSize:2 },
          backgroundColor: alpha(c.surface2, 0.5),
        }
      },
      plugins: {
        legend: {
          position:'bottom',
          labels:{ color:c.muted, font:{size:9}, boxWidth:8, boxHeight:8, padding:8 }
        },
        tooltip: {
          ...premiumTooltip(c),
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw.toFixed(1)}/10` }
        }
      }
    }
  });
}

// ── ATUALIZAR TODOS ───────────────────────────────────────────
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
  } catch(e) {
    console.error('Erro ao atualizar gráficos:', e);
  }
}
