// ============ helpers ============
function inr(n){
  if(!isFinite(n)) return '₹0';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
function pct(n, digits){
  digits = digits === undefined ? 2 : digits;
  if(!isFinite(n)) return '0%';
  return n.toFixed(digits) + '%';
}

// future value of a monthly SIP (ordinary annuity, contribution at period start)
function sipFutureValue(P, months, annualRatePct){
  const i = annualRatePct / 12 / 100;
  if(months <= 0) return 0;
  if(i === 0) return P * months;
  return P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
}

// builds a simple line+area growth chart inside an svg, given yearly data points
function drawGrowthChart(svgEl, points){
  const w = 400, h = 130, pad = 6;
  const max = Math.max(...points, 1);
  const steps = points.length - 1;
  const stepX = steps === 0 ? 0 : w / steps;
  const linePts = points.map((v, idx) => {
    const x = idx * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y];
  });
  const lineD = 'M' + linePts.map(p => p.join(',')).join(' L');
  const areaD = lineD + ` L${w},${h} L0,${h} Z`;
  const area = svgEl.querySelector('.area-path');
  const line = svgEl.querySelector('.line-path');
  if(area) area.setAttribute('d', areaD);
  if(line) line.setAttribute('d', lineD);
}

// ============ tabs ============
(function tabs(){
  const tabButtons = document.querySelectorAll('.calc-tab');
  const panels = document.querySelectorAll('.calc-panel');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      tabButtons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.id === target));
      window.scrollTo({ top: document.getElementById('calcHub').offsetTop - 100, behavior: 'smooth' });
    });
  });
})();

// ============ 1. SIP Calculator ============
(function sipCalc(){
  const panel = document.getElementById('calc-sip');
  if(!panel) return;
  const pSlider = panel.querySelector('#sip-amount');
  const nSlider = panel.querySelector('#sip-years');
  const rSlider = panel.querySelector('#sip-rate');
  const pAmt = panel.querySelector('#sip-amount-out');
  const nAmt = panel.querySelector('#sip-years-out');
  const rAmt = panel.querySelector('#sip-rate-out');
  const investedOut = panel.querySelector('#sip-invested-out');
  const returnsOut = panel.querySelector('#sip-returns-out');
  const totalOut = panel.querySelector('#sip-total-out');
  const svg = panel.querySelector('svg');

  function render(){
    const P = +pSlider.value, years = +nSlider.value, rate = +rSlider.value;
    pAmt.textContent = inr(P);
    nAmt.textContent = years + (years === 1 ? ' Year' : ' Years');
    rAmt.textContent = rate + '%';
    const months = years * 12;
    const total = sipFutureValue(P, months, rate);
    const invested = P * months;
    investedOut.textContent = inr(invested);
    returnsOut.textContent = inr(total - invested);
    totalOut.textContent = inr(total);
    const points = [];
    for(let y = 0; y <= years; y++) points.push(sipFutureValue(P, y * 12, rate));
    drawGrowthChart(svg, points);
  }
  [pSlider, nSlider, rSlider].forEach(s => s.addEventListener('input', render));
  render();
})();

// ============ 2. Step-Up SIP Calculator ============
(function stepUpSipCalc(){
  const panel = document.getElementById('calc-stepup');
  if(!panel) return;
  const pSlider = panel.querySelector('#step-amount');
  const stepSlider = panel.querySelector('#step-percent');
  const nSlider = panel.querySelector('#step-years');
  const rSlider = panel.querySelector('#step-rate');
  const pAmt = panel.querySelector('#step-amount-out');
  const stepAmt = panel.querySelector('#step-percent-out');
  const nAmt = panel.querySelector('#step-years-out');
  const rAmt = panel.querySelector('#step-rate-out');
  const investedOut = panel.querySelector('#step-invested-out');
  const returnsOut = panel.querySelector('#step-returns-out');
  const totalOut = panel.querySelector('#step-total-out');
  const svg = panel.querySelector('svg');

  function corpusAtYear(P0, stepPct, rate, years){
    const i = rate / 12 / 100;
    let corpus = 0;
    let invested = 0;
    const yearlyPoints = [0];
    for(let y = 0; y < years; y++){
      const monthlyAmt = P0 * Math.pow(1 + stepPct / 100, y);
      for(let m = 0; m < 12; m++){
        corpus = corpus * (1 + i) + monthlyAmt;
        invested += monthlyAmt;
      }
      yearlyPoints.push(corpus);
    }
    return { corpus, invested, yearlyPoints };
  }

  function render(){
    const P = +pSlider.value, step = +stepSlider.value, years = +nSlider.value, rate = +rSlider.value;
    pAmt.textContent = inr(P);
    stepAmt.textContent = step + '%';
    nAmt.textContent = years + (years === 1 ? ' Year' : ' Years');
    rAmt.textContent = rate + '%';
    const { corpus, invested, yearlyPoints } = corpusAtYear(P, step, rate, years);
    investedOut.textContent = inr(invested);
    returnsOut.textContent = inr(corpus - invested);
    totalOut.textContent = inr(corpus);
    drawGrowthChart(svg, yearlyPoints);
  }
  [pSlider, stepSlider, nSlider, rSlider].forEach(s => s.addEventListener('input', render));
  render();
})();

// ============ 3. Lumpsum Calculator ============
(function lumpsumCalc(){
  const panel = document.getElementById('calc-lumpsum');
  if(!panel) return;
  const pSlider = panel.querySelector('#lump-amount');
  const nSlider = panel.querySelector('#lump-years');
  const rSlider = panel.querySelector('#lump-rate');
  const pAmt = panel.querySelector('#lump-amount-out');
  const nAmt = panel.querySelector('#lump-years-out');
  const rAmt = panel.querySelector('#lump-rate-out');
  const investedOut = panel.querySelector('#lump-invested-out');
  const returnsOut = panel.querySelector('#lump-returns-out');
  const totalOut = panel.querySelector('#lump-total-out');
  const svg = panel.querySelector('svg');

  function render(){
    const P = +pSlider.value, years = +nSlider.value, rate = +rSlider.value;
    pAmt.textContent = inr(P);
    nAmt.textContent = years + (years === 1 ? ' Year' : ' Years');
    rAmt.textContent = rate + '%';
    const total = P * Math.pow(1 + rate / 100, years);
    investedOut.textContent = inr(P);
    returnsOut.textContent = inr(total - P);
    totalOut.textContent = inr(total);
    const points = [];
    for(let y = 0; y <= years; y++) points.push(P * Math.pow(1 + rate / 100, y));
    drawGrowthChart(svg, points);
  }
  [pSlider, nSlider, rSlider].forEach(s => s.addEventListener('input', render));
  render();
})();

// ============ 4. EMI Calculator ============
(function emiCalc(){
  const panel = document.getElementById('calc-emi');
  if(!panel) return;
  const pSlider = panel.querySelector('#emi-amount');
  const nSlider = panel.querySelector('#emi-years');
  const rSlider = panel.querySelector('#emi-rate');
  const pAmt = panel.querySelector('#emi-amount-out');
  const nAmt = panel.querySelector('#emi-years-out');
  const rAmt = panel.querySelector('#emi-rate-out');
  const emiOut = panel.querySelector('#emi-monthly-out');
  const interestOut = panel.querySelector('#emi-interest-out');
  const totalOut = panel.querySelector('#emi-total-out');

  function render(){
    const P = +pSlider.value, years = +nSlider.value, rate = +rSlider.value;
    pAmt.textContent = inr(P);
    nAmt.textContent = years + (years === 1 ? ' Year' : ' Years');
    rAmt.textContent = rate + '%';
    const n = years * 12;
    const i = rate / 12 / 100;
    const emi = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = emi * n;
    emiOut.textContent = inr(emi);
    interestOut.textContent = inr(total - P);
    totalOut.textContent = inr(total);
  }
  [pSlider, nSlider, rSlider].forEach(s => s.addEventListener('input', render));
  render();
})();

// ============ 5. Fixed Deposit (FD) Calculator ============
(function fdCalc(){
  const panel = document.getElementById('calc-fd');
  if(!panel) return;
  const pSlider = panel.querySelector('#fd-amount');
  const nSlider = panel.querySelector('#fd-years');
  const rSlider = panel.querySelector('#fd-rate');
  const pAmt = panel.querySelector('#fd-amount-out');
  const nAmt = panel.querySelector('#fd-years-out');
  const rAmt = panel.querySelector('#fd-rate-out');
  const investedOut = panel.querySelector('#fd-invested-out');
  const returnsOut = panel.querySelector('#fd-returns-out');
  const totalOut = panel.querySelector('#fd-total-out');

  function render(){
    const P = +pSlider.value, years = +nSlider.value, rate = +rSlider.value;
    pAmt.textContent = inr(P);
    nAmt.textContent = years + (years === 1 ? ' Year' : ' Years');
    rAmt.textContent = rate + '%';
    const n = 4; // quarterly compounding, standard for Indian FDs
    const total = P * Math.pow(1 + rate / (n * 100), n * years);
    investedOut.textContent = inr(P);
    returnsOut.textContent = inr(total - P);
    totalOut.textContent = inr(total);
  }
  [pSlider, nSlider, rSlider].forEach(s => s.addEventListener('input', render));
  render();
})();

// ============ 6. Recurring Deposit (RD) Calculator ============
(function rdCalc(){
  const panel = document.getElementById('calc-rd');
  if(!panel) return;
  const pSlider = panel.querySelector('#rd-amount');
  const nSlider = panel.querySelector('#rd-months');
  const rSlider = panel.querySelector('#rd-rate');
  const pAmt = panel.querySelector('#rd-amount-out');
  const nAmt = panel.querySelector('#rd-months-out');
  const rAmt = panel.querySelector('#rd-rate-out');
  const investedOut = panel.querySelector('#rd-invested-out');
  const returnsOut = panel.querySelector('#rd-returns-out');
  const totalOut = panel.querySelector('#rd-total-out');

  function render(){
    const P = +pSlider.value, months = +nSlider.value, rate = +rSlider.value;
    pAmt.textContent = inr(P);
    nAmt.textContent = months + ' Months';
    rAmt.textContent = rate + '%';
    const total = sipFutureValue(P, months, rate);
    const invested = P * months;
    investedOut.textContent = inr(invested);
    returnsOut.textContent = inr(total - invested);
    totalOut.textContent = inr(total);
  }
  [pSlider, nSlider, rSlider].forEach(s => s.addEventListener('input', render));
  render();
})();

// ============ 7. PPF Calculator ============
(function ppfCalc(){
  const panel = document.getElementById('calc-ppf');
  if(!panel) return;
  const pSlider = panel.querySelector('#ppf-amount');
  const nSlider = panel.querySelector('#ppf-years');
  const rSlider = panel.querySelector('#ppf-rate');
  const pAmt = panel.querySelector('#ppf-amount-out');
  const nAmt = panel.querySelector('#ppf-years-out');
  const rAmt = panel.querySelector('#ppf-rate-out');
  const investedOut = panel.querySelector('#ppf-invested-out');
  const returnsOut = panel.querySelector('#ppf-returns-out');
  const totalOut = panel.querySelector('#ppf-total-out');
  const svg = panel.querySelector('svg');

  function fvAnnual(P, years, rate){
    const r = rate / 100;
    if(years <= 0) return 0;
    if(r === 0) return P * years;
    return P * ((Math.pow(1 + r, years) - 1) / r) * (1 + r);
  }

  function render(){
    const P = +pSlider.value, years = +nSlider.value, rate = +rSlider.value;
    pAmt.textContent = inr(P);
    nAmt.textContent = years + (years === 1 ? ' Year' : ' Years');
    rAmt.textContent = rate + '%';
    const total = fvAnnual(P, years, rate);
    const invested = P * years;
    investedOut.textContent = inr(invested);
    returnsOut.textContent = inr(total - invested);
    totalOut.textContent = inr(total);
    const points = [];
    for(let y = 0; y <= years; y++) points.push(fvAnnual(P, y, rate));
    drawGrowthChart(svg, points);
  }
  [pSlider, nSlider, rSlider].forEach(s => s.addEventListener('input', render));
  render();
})();

// ============ 8. CAGR Calculator ============
(function cagrCalc(){
  const panel = document.getElementById('calc-cagr');
  if(!panel) return;
  const initial = panel.querySelector('#cagr-initial');
  const final = panel.querySelector('#cagr-final');
  const years = panel.querySelector('#cagr-years');
  const cagrOut = panel.querySelector('#cagr-result-out');
  const gainOut = panel.querySelector('#cagr-gain-out');

  function render(){
    const P = +initial.value || 0;
    const F = +final.value || 0;
    const y = +years.value || 0;
    if(P <= 0 || y <= 0){
      cagrOut.textContent = '—';
      gainOut.textContent = '—';
      return;
    }
    const cagr = (Math.pow(F / P, 1 / y) - 1) * 100;
    cagrOut.textContent = pct(cagr);
    gainOut.textContent = inr(F - P);
  }
  [initial, final, years].forEach(el => el.addEventListener('input', render));
  render();
})();

// ============ 9. Retirement Corpus Calculator ============
(function retirementCalc(){
  const panel = document.getElementById('calc-retirement');
  if(!panel) return;
  const currentAge = panel.querySelector('#ret-current-age');
  const retireAge = panel.querySelector('#ret-retire-age');
  const lifeExpectancy = panel.querySelector('#ret-life-expectancy');
  const monthlyExpense = panel.querySelector('#ret-monthly-expense');
  const inflation = panel.querySelector('#ret-inflation');
  const postReturn = panel.querySelector('#ret-post-return');
  const currentAgeOut = panel.querySelector('#ret-current-age-out');
  const retireAgeOut = panel.querySelector('#ret-retire-age-out');
  const inflationOut = panel.querySelector('#ret-inflation-out');
  const postReturnOut = panel.querySelector('#ret-post-return-out');
  const futureExpenseOut = panel.querySelector('#ret-future-expense-out');
  const corpusOut = panel.querySelector('#ret-corpus-out');
  const monthlySipOut = panel.querySelector('#ret-monthly-sip-out');
  const preReturn = panel.querySelector('#ret-pre-return');
  const preReturnOut = panel.querySelector('#ret-pre-return-out');

  function render(){
    const ca = +currentAge.value, ra = +retireAge.value, le = +lifeExpectancy.value;
    const me = +monthlyExpense.value, infl = +inflation.value, pr = +postReturn.value, prer = +preReturn.value;
    currentAgeOut.textContent = ca + ' yrs';
    retireAgeOut.textContent = ra + ' yrs';
    inflationOut.textContent = infl + '%';
    postReturnOut.textContent = pr + '%';
    preReturnOut.textContent = prer + '%';

    const yearsToRetire = Math.max(ra - ca, 0);
    const yearsInRetirement = Math.max(le - ra, 1);
    const futureMonthlyExpense = me * Math.pow(1 + infl / 100, yearsToRetire);
    const futureAnnualExpense = futureMonthlyExpense * 12;

    // real rate of return during retirement (post-return adjusted for inflation)
    const realRate = ((1 + pr / 100) / (1 + infl / 100)) - 1;
    let corpus;
    if(Math.abs(realRate) < 0.0001){
      corpus = futureAnnualExpense * yearsInRetirement;
    } else {
      corpus = futureAnnualExpense * (1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate * (1 + realRate);
    }

    futureExpenseOut.textContent = inr(futureMonthlyExpense) + ' / month';
    corpusOut.textContent = inr(corpus);

    // required monthly SIP during accumulation phase to reach that corpus
    const months = yearsToRetire * 12;
    const i = prer / 12 / 100;
    let requiredSip;
    if(months <= 0){
      requiredSip = 0;
    } else if(i === 0){
      requiredSip = corpus / months;
    } else {
      requiredSip = corpus / (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
    }
    monthlySipOut.textContent = inr(requiredSip);
  }
  [currentAge, retireAge, lifeExpectancy, monthlyExpense, inflation, postReturn, preReturn].forEach(el => el.addEventListener('input', render));
  render();
})();

// ============ 10. Goal-Based SIP Calculator ============
(function goalSipCalc(){
  const panel = document.getElementById('calc-goal');
  if(!panel) return;
  const target = panel.querySelector('#goal-target');
  const years = panel.querySelector('#goal-years');
  const rate = panel.querySelector('#goal-rate');
  const yearsOut = panel.querySelector('#goal-years-out');
  const rateOut = panel.querySelector('#goal-rate-out');
  const requiredSipOut = panel.querySelector('#goal-sip-out');
  const investedOut = panel.querySelector('#goal-invested-out');
  const returnsOut = panel.querySelector('#goal-returns-out');

  function render(){
    const T = +target.value || 0, y = +years.value, r = +rate.value;
    yearsOut.textContent = y + (y === 1 ? ' Year' : ' Years');
    rateOut.textContent = r + '%';
    const months = y * 12;
    const i = r / 12 / 100;
    const denom = i === 0 ? months : ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    const requiredSip = denom === 0 ? 0 : T / denom;
    requiredSipOut.textContent = inr(requiredSip);
    const invested = requiredSip * months;
    investedOut.textContent = inr(invested);
    returnsOut.textContent = inr(T - invested);
  }
  [target, years, rate].forEach(el => el.addEventListener('input', render));
  render();
})();

// ============ 11. Simple / Compound Interest Calculator ============
(function interestCalc(){
  const panel = document.getElementById('calc-interest');
  if(!panel) return;
  const principal = panel.querySelector('#int-principal');
  const rate = panel.querySelector('#int-rate');
  const time = panel.querySelector('#int-time');
  const freq = panel.querySelector('#int-freq');
  const simpleOut = panel.querySelector('#int-simple-out');
  const compoundOut = panel.querySelector('#int-compound-out');
  const diffOut = panel.querySelector('#int-diff-out');

  function render(){
    const P = +principal.value || 0, r = +rate.value || 0, t = +time.value || 0;
    const n = +freq.value;
    const si = P * r * t / 100;
    const ci = P * Math.pow(1 + r / (n * 100), n * t) - P;
    simpleOut.textContent = inr(P + si);
    compoundOut.textContent = inr(P + ci);
    diffOut.textContent = inr(ci - si);
  }
  [principal, rate, time, freq].forEach(el => el.addEventListener('input', render));
  render();
})();

// ============ 12. Inflation Impact Calculator ============
(function inflationCalc(){
  const panel = document.getElementById('calc-inflation');
  if(!panel) return;
  const cost = panel.querySelector('#infl-cost');
  const rate = panel.querySelector('#infl-rate');
  const years = panel.querySelector('#infl-years');
  const rateOut = panel.querySelector('#infl-rate-out');
  const yearsOut = panel.querySelector('#infl-years-out');
  const futureCostOut = panel.querySelector('#infl-future-cost-out');
  const purchasingPowerOut = panel.querySelector('#infl-purchasing-power-out');

  function render(){
    const C = +cost.value || 0, r = +rate.value, y = +years.value;
    rateOut.textContent = r + '%';
    yearsOut.textContent = y + (y === 1 ? ' Year' : ' Years');
    const futureCost = C * Math.pow(1 + r / 100, y);
    const purchasingPower = C / Math.pow(1 + r / 100, y);
    futureCostOut.textContent = inr(futureCost);
    purchasingPowerOut.textContent = inr(purchasingPower);
  }
  [cost, rate, years].forEach(el => el.addEventListener('input', render));
  render();
})();
