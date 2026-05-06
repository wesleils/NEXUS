// ============================================================
// NEXUS - Investimentos + BRAPI (investments.js)
// ============================================================

// Lista de ações da B3 (500 principais)
const STOCKS_LIST = [
  'PETR4','VALE3','ITUB4','BBDC4','ABEV3','BBAS3','WEGE3','RENT3','MGLU3','LREN3',
  'RADL3','SUZB3','GGBR4','CSNA3','USIM5','PRIO3','CSAN3','EGIE3','TAEE11','ENGI11',
  'CMIG4','CPFL3','ELET3','ELET6','SBSP3','SAPR11','CPLE6','TRPL4','ENEV3','AURE3',
  'EMBR3','GOLL4','AZUL4','CVC3','BKBR3','HYPE3','FLRY3','HAPV3','GNDI3','QUAL3',
  'RDOR3','PNVL3','DASA3','ONCO3','AALR3','MATD3','TFCO4','SOMA3','VIVA3','CEAB3',
  'BRFS3','JBSS3','MRFG3','BEEF3','SLCE3','AGRO3','SMTO3','CAML3','TTEN3','MNPR3',
  'RAIL3','CCRO3','ECOR3','TIMS3','VIVT3','OIBR3','ALUP11','ARZZ3','PETZ3','MOVI3',
  'LWSA3','LINX3','TOTVS3','POSITIVO3','INTB3','CASH3','IRBR3','BBSE3','PSSA3','CXSE3',
  'SANB11','BRSR6','BPAC11','BMGB4','PINE4','TRAD3','BIDI11','WIZC3','SULA11','CGRA4',
  'MULT3','BRML3','LOGI3','IGTI11','BRPR3','JHSF3','EVEN3','EZTC3','LAVV3','DIRR3',
  'GFSA3','PDGR3','RLOG3','CYRE3','MRVE3','TEND3','PLPL3','TRIS3','MDNE3','BRAR3',
  'COGN3','YDUQ3','SEER3','ANIM3','ESGE3','AESB3','GPAR3','MEAL3','MDIA3','BOBR4',
  'PCAR3','ASAI3','SMFT3','ATTT3','NTCO3','VULC3','GRENDENE3','ALPK3','DTEX3','FRAS3',
  'DXCO3','KLBN11','RANI3','ELDORADO3','RCSL4','UNIP6','PMAM3','ROMI3','SOJA3','LAND3',
  'IOES3','BRAP4','MBLY3','RAIZ4','VBBR3','UGPA3','DMMO3','RECV3','ESPA3','RRRP3',
  'CMIN3','CBAV3','ZAMP3','BRAP3','FESH3','BSLI3','MTRE3','MDVL3','POSI3','MELI34',
  'NVDC34','MSFT34','AAPL34','AMZO34','GOGL34','META34','TSLA34','NFLX34','DISB34','BABA34',
  'IVVB11','SPXI11','HASH11','BOVA11','SMAL11','MATB11','GOLD11','DIVO11','MOAT11','TECK34',
  'AZEV4','MWET4','TKNO4','RPAD6','PTNT4','COCE5','REDE3','MERC4','EGIE3','NEOE3',
  'ALOS3','VLAS3','SQIA3','SOJA3','AGXY3','WEST3','ORVR3','SMAH3','APER3','BLAU3',
  'TUPY3','FRAS3','MYPK3','LEVE3','PINE4','CTNM4','DOHL4','PTBL3','RPAD3','SMLS3',
  'ALPA4','CAMB3','HBSA3','LOGG3','SIMH3','MOVIDA3','VAMO3','PAVI3','RCSL3','SEQL3',
  'AMOB3','CRPG6','GRND3','ETER3','PTNT3','FRIO3','JSLG3','KEPL3','LAME4','MILS3',
  'NATU3','ODPV3','PMAM3','RAIL3','ROMI3','SANB3','SNSY5','SOND6','SQIA3','TEKA4',
  'TTEN3','UNIP3','VIVA3','VULC3','WIZC3','WLMM4','WSON33','YDVL4','YDUQ3','ZAG11',
  'AERI3','APER3','CALI3','CSED3','EUCA4','EVTL3','FIQE3','FNAM11','FNTL11','GMAT3',
  'GRND3','HBRE3','HGPO11','HKCO11','HMOC11','HOTM3','HSML11','HUSI11','HYPE3','IFCM3',
  'IGBR3','IGBR6','IGUN3','INEP4','INNT3','INTB3','JALL3','JFEN3','JHSF3','JSRE11',
  'KCRE11','KDIF11','KFOF11','KNHY11','KNIP11','KNRE11','KNSC11','KORE11','KRYA11','LASC11',
  'LBRN11','LGCP11','LGSP11','LOFT3','LPSB3','LUPA3','LVTC3','MAPT3','MAPT4','MBRF3',
  'MCRE11','MFAI3','MFII11','MGHT11','MGLU3','MGLUY3','MHIA11','MHQA11','MIAR3','MIBR11',
  'MIFF11','MILS3','MIND3','MIND4','MINP3','MINP4','MITR3','MITR4','MORC11','MOSI3',
  'MRVE3','MTRE3','MULT3','MVRL11','MXRF11','NCHB11','NCRE11','NEXP3','NHHO3','NIAG3'
];

// Lista de FIIs (500 principais)
const FIIS_LIST = [
  'MXRF11','XPML11','HGLG11','BTLG11','CSHG11','GGRC11','MALL11','HGRE11','KNRI11','VGIP11',
  'BCFF11','BCIA11','BCRI11','BPFF11','BRCO11','BRIP11','BRLG11','BTAL11','BTAG11','BTHF11',
  'BTRA11','BTSG11','BVLS11','CACR11','CALI11','CPTS11','CVBI11','DEVA11','DEVO11','DEVP11',
  'DSHS11','DVFF11','EDGA11','ELDO11','ENGI11','EQIN11','ESUD11','ETHE11','EURO11','EVBI11',
  'EVIF11','EXES11','FAED11','FAMB11','FBOI11','FCHG11','FCPE11','FCRB11','FDDM11','FDMB11',
  'FEXC11','FGAA11','FGBL11','FGCJ11','FGHB11','FHAB11','FIAM11','FIIB11','FIIP11','FIRB11',
  'FISD11','FIZP11','FMOF11','FNCS11','FNBR11','FNCI11','FNET11','FOLD11','FOVE11','FPAG11',
  'FPCB11','FRDM11','FRMO11','FRON11','FSRF11','FTCE11','FTII11','FVPQ11','FVPQ12','GCRA11',
  'GCRI11','GDSF11','GERI11','GGCP11','GGFI11','GGPS11','GHAL11','GHIG11','GISC11','GJFT11',
  'GLAB11','GLGE11','GLOG11','GLPG11','GMJR11','GNDI11','GNDI12','GNSI11','GOVB11','GPAR11',
  'GPCP11','GPNV11','GRSG11','GUAR11','HBCR11','HBTT11','HCTR11','HDBR11','HERS11','HFOF11',
  'HGBS11','HGCR11','HGFF11','HGLG11','HGPO11','HGRS11','HGRU11','HHCO11','HHFF11','HINV11',
  'HIRE11','HJJS11','HLOG11','HMOC11','HNGO11','HNRI11','HOSI11','HPNC11','HPQQ11','HQBR11',
  'HRDF11','HREC11','HRFI11','HRHB11','HRUB11','HSIA11','HSML11','HSLG11','HTCE11','HTMX11',
  'IFIX11','IFND11','IFRI11','IGBR11','IGMI11','IMBI11','IMCR11','INFD11','INFR11','INHF11',
  'INLG11','INRD11','INVA11','IOCM11','IRCP11','IRDM11','ISAE11','ITIP11','JFLL11','JIFI11',
  'JISD11','JJDF11','JLGP11','JMBS11','JRDM11','JSAF11','JSRE11','JTPR11','JULG11','JUST11',
  'KAGI11','KFOF11','KINP11','KNCA11','KNHF11','KNHY11','KNIA11','KNIC11','KNIF11','KNIL11',
  'KNIP11','KNPL11','KNRE11','KNSC11','KNSE11','KNSH11','KNSI11','KNSP11','KNUQ11','KORE11',
  'KVMC11','LARC11','LASC11','LATR11','LBRN11','LGCP11','LGIP11','LGRE11','LGSP11','LIFE11',
  'LIMC11','LINC11','LOFT11','LOGI11','LOGG11','LUGG11','LUNE11','LUSG11','LVBI11','MCCI11',
  'MCHF11','MCPB11','MCRE11','MFAI11','MFII11','MFII12','MGCR11','MGHT11','MHIA11','MHQA11',
  'MIBE11','MICP11','MIEF11','MIFF11','MIIV11','MILA11','MILP11','MIME11','MIML11','MIPT11',
  'MIRC11','MIUQ11','MIVY11','MLCR11','MLFT11','MLPA11','MORC11','MRFF11','MRFG11','MRRA11',
  'MSHE11','MSHG11','MSUS11','MTGE11','MTRA11','MXRF11','MXRR11','MYRE11','NCII11','NCHB11'
];

let allInvestments = [];
let cachedPrices = {};
let lastPriceFetch = 0;

// Buscar cotações da BRAPI (máx 50 tickers por request no plano free)
async function fetchBRAPIQuotes(tickers) {
  if (!tickers.length) return {};
  const chunk = tickers.slice(0, 50).join(',');
  try {
    const url = `${NEXUS_CONFIG.brapi.baseUrl}/quote/${chunk}?fundamental=false`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const json = await res.json();
    const prices = {};
    (json.results || []).forEach(item => {
      prices[item.symbol] = {
        price: item.regularMarketPrice,
        change: item.regularMarketChangePercent,
        name: item.longName || item.shortName || item.symbol
      };
    });
    return prices;
  } catch { return {}; }
}

// Buscar cotações dos investimentos do usuário (com cache de 15min)
async function refreshInvestmentPrices() {
  const now = Date.now();
  if (now - lastPriceFetch < 15 * 60 * 1000) return; // 15min cache
  lastPriceFetch = now;

  const tickers = allInvestments.map(i => i.ticker);
  if (!tickers.length) return;

  const prices = await fetchBRAPIQuotes(tickers);
  cachedPrices = { ...cachedPrices, ...prices };

  // Atualizar preços no banco
  for (const inv of allInvestments) {
    const p = prices[inv.ticker];
    if (p) {
      await DB.updateInvestmentPrice(inv.id, p.price);
      inv.current_price = p.price;
    }
  }
  renderInvestments();
}

// Buscar lista de ativos para o modal de busca
async function searchAsset(query, type) {
  query = query.toUpperCase().trim();
  if (!query) return [];

  const list = type === 'fii' ? FIIS_LIST : STOCKS_LIST;
  const localMatches = list.filter(t => t.includes(query)).slice(0, 20);

  // Tentar buscar na BRAPI também
  try {
    const res = await fetch(`${NEXUS_CONFIG.brapi.baseUrl}/quote/list?search=${query}&limit=20`);
    if (res.ok) {
      const json = await res.json();
      const apiMatches = (json.stocks || []).map(s => s.stock);
      return [...new Set([...localMatches, ...apiMatches])].slice(0, 30);
    }
  } catch {}
  return localMatches;
}

// Carregar investimentos
async function loadInvestments() {
  allInvestments = await DB.getInvestments();
  refreshInvestmentPrices();
  renderInvestments();
  renderAssetSearch();
}

// Renderizar lista de investimentos
function renderInvestments() {
  const container = document.getElementById('investments-list');
  if (!container) return;

  if (!allInvestments.length) {
    container.innerHTML = '<div class="empty-state">Nenhum investimento cadastrado</div>';
    return;
  }

  let totalInvested = 0, totalCurrent = 0;

  container.innerHTML = allInvestments.map(inv => {
    const currentPrice = inv.current_price || inv.avg_price;
    const currentTotal = currentPrice * inv.quantity;
    const invested = inv.total_invested;
    const gain = currentTotal - invested;
    const gainPct = invested ? (gain / invested) * 100 : 0;
    const gainSign = gain >= 0 ? '+' : '';
    const gainCls = gain >= 0 ? 'positive' : 'negative';
    const typLabel = inv.type === 'stock' ? 'Ação' : inv.type === 'fii' ? 'FII' : 'Outro';

    totalInvested += invested;
    totalCurrent += currentTotal;

    return '<div class="list-item">'
      + '<div class="item-icon" style="background:var(--accent)18;color:var(--accent);font-family:var(--font-mono);font-size:11px;font-weight:700;width:54px;flex-shrink:0">' + inv.ticker + '</div>'
      + '<div class="item-info">'
      + '<div class="item-name">' + (inv.name || inv.ticker) + ' <span class="badge badge-' + inv.type + '">' + typLabel + '</span></div>'
      + '<div class="item-sub">' + inv.quantity + ' cotas · Preço médio: ' + formatCurrency(inv.avg_price) + '</div>'
      + '</div>'
      + '<div style="text-align:right;min-width:100px">'
      + '<div style="font-family:var(--font-mono);font-size:13px;font-weight:700">' + formatCurrency(currentPrice) + '</div>'
      + '<div class="' + gainCls + '" style="font-size:11px">' + formatPercent(gainPct) + '</div>'
      + '</div>'
      + '<div style="text-align:right;min-width:110px">'
      + '<div style="font-family:var(--font-mono);font-size:13px;font-weight:700">' + formatCurrency(currentTotal) + '</div>'
      + '<div class="' + gainCls + '" style="font-size:11px">' + gainSign + formatCurrency(gain) + '</div>'
      + '</div>'
      + '<button class="btn-icon" onclick="openEditInvestment(\'' + inv.id + '\')" title="Editar">✏️</button>'
      + '<button class="btn-icon" onclick="deleteInvestment(\'' + inv.id + '\')" title="Remover">🗑</button>'
      + '</div>';
  }).join('');

  // Atualizar totais no header
  const totalGain = totalCurrent - totalInvested;
  const el = document.getElementById('inv-summary');
  if (el) {
    const cls = totalGain >= 0 ? 'positive' : 'negative';
    el.innerHTML = '<span>Investido: <strong>' + formatCurrency(totalInvested) + '</strong></span>'
      + '<span>Valor atual: <strong>' + formatCurrency(totalCurrent) + '</strong></span>'
      + '<span class="' + cls + '">' + (totalGain >= 0 ? '+' : '') + formatCurrency(totalGain) + ' (' + formatPercent(totalGain / (totalInvested || 1) * 100) + ')</span>';
  }
}

// Busca de ativos no painel
function renderAssetSearch() {
  const stocksEl = document.getElementById('stocks-quicklist');
  const fiisEl = document.getElementById('fiis-quicklist');

  // Mostrar ativos do usuário + atalhos comuns
  const userStocks = allInvestments.filter(i => i.type === 'stock').map(i => i.ticker);
  const userFiis = allInvestments.filter(i => i.type === 'fii').map(i => i.ticker);

  const topStocks = [...new Set([...userStocks, ...STOCKS_LIST.slice(0, 20)])].slice(0, 25);
  const topFiis = [...new Set([...userFiis, ...FIIS_LIST.slice(0, 20)])].slice(0, 25);

  if (stocksEl) stocksEl.innerHTML = renderTickerChips(topStocks, 'stock');
  if (fiisEl) fiisEl.innerHTML = renderTickerChips(topFiis, 'fii');
}

function renderTickerChips(tickers, type) {
  return tickers.map(t => {
    const cp = cachedPrices[t];
    const isOwned = allInvestments.some(i => i.ticker === t);
    return `
      <div class="ticker-chip ${isOwned ? 'owned' : ''}" onclick="openInvestmentModal('${t}', '${type}')">
        <span class="chip-ticker">${t}</span>
        ${cp ? `<span class="chip-price ${cp.change >= 0 ? 'positive' : 'negative'}">${formatPercent(cp.change)}</span>` : ''}
      </div>
    `;
  }).join('');
}

// Abrir modal de investimento
async function openInvestmentModal(ticker, type) {
  document.getElementById('inv-ticker').value = ticker;
  document.getElementById('inv-type').value = type;
  document.getElementById('inv-modal-title').textContent = `Investir em ${ticker}`;

  // Buscar preço atual
  const prices = await fetchBRAPIQuotes([ticker]);
  const p = prices[ticker];
  if (p) {
    document.getElementById('inv-current-price').textContent = `Cotação atual: ${formatCurrency(p.price)}`;
    document.getElementById('inv-avg-price').value = p.price.toFixed(2);
    document.getElementById('inv-name').value = p.name || ticker;
  }
  openModal('modal-investment');
}

// Salvar investimento
async function saveInvestment() {
  const ticker = document.getElementById('inv-ticker').value.trim().toUpperCase();
  const name = document.getElementById('inv-name').value.trim();
  const type = document.getElementById('inv-type').value;
  const qty = parseFloat(document.getElementById('inv-qty').value);
  const avgPrice = parseFloat(document.getElementById('inv-avg-price').value);
  const date = document.getElementById('inv-date').value;
  const notes = document.getElementById('inv-notes').value;

  if (!ticker || !qty || !avgPrice || !date) {
    showToast('Preencha todos os campos obrigatórios', 'error'); return;
  }

  try {
    await DB.addInvestment(ticker, name, type, qty, avgPrice, date, notes);
    await loadInvestments();
    closeModal('modal-investment');
    showToast(`${ticker} adicionado aos investimentos!`);
    await updateDashboardSummary();
  } catch (e) {
    showToast(e.message || 'Erro ao salvar investimento', 'error');
  }
}

// Excluir investimento (devolve valor para carteira)
async function deleteInvestment(id) {
  if (!confirm('Remover investimento? O valor investido voltará para sua carteira.')) return;
  try {
    await DB.deleteInvestment(id);
    await loadInvestments();
    showToast('Investimento removido, valor devolvido à carteira');
    await updateDashboardSummary();
  } catch (e) {
    showToast(e.message || 'Erro ao remover', 'error');
  }
}

// Busca livre de ticker
let searchDebounce;
async function handleAssetSearch(query, type) {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(async () => {
    if (!query.trim()) { renderAssetSearch(); return; }
    const results = await searchAsset(query, type);
    const el = type === 'stock' ? document.getElementById('stocks-quicklist') : document.getElementById('fiis-quicklist');
    if (el) el.innerHTML = renderTickerChips(results, type);
  }, 400);
}

// Auto-refresh a cada 15min
setInterval(() => {
  lastPriceFetch = 0; // forçar refresh
  refreshInvestmentPrices();
}, 15 * 60 * 1000);
