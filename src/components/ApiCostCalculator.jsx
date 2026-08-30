import React, { useState, useMemo } from 'react';

// ============================================================================
// CALCULATION CONSTANTS & RULES (Source of Truth: 10x-cost-bento-v9.html)
// ============================================================================
const CALCULATOR_CONFIG = {
  inUSD: 0.075,      // $0.075 per 1M input tokens
  outUSD: 0.30,       // $0.30 per 1M output tokens
  fx: 95,             // ₹95 to the dollar (August 2026)
  qIn: 800,           // 800 input tokens per request
  qOut: 200,          // 200 output tokens per request
  docAdd: 3000,       // 3000 tokens for attached domain records
  days: 365,          // 365 days a year
  defaultUsers: 20000,
  defaultTokens: 600, // 600 Million tokens a month
};

// What each exchange adds to the running conversation history (800 + 200 = 1,000 tokens)
const TURN = CALCULATOR_CONFIG.qIn + CALCULATOR_CONFIG.qOut;

// One person's daily cost for n requests inside one running session
function calculateDayCost(n, docs = false) {
  let tin = 0;
  let tout = 0;
  for (let i = 0; i < n; i++) {
    // History carried forward from previous turns, plus this request
    tin += i * TURN + CALCULATOR_CONFIG.qIn + (docs ? CALCULATOR_CONFIG.docAdd : 0);
    tout += CALCULATOR_CONFIG.qOut;
  }
  return ((tin / 1e6) * CALCULATOR_CONFIG.inUSD + (tout / 1e6) * CALCULATOR_CONFIG.outUSD) * CALCULATOR_CONFIG.fx;
}

// Indian Rupee number formatting matching HTML source of truth
function inr(n) {
  if (!n || isNaN(n) || n <= 0) return '₹0';
  if (n >= 1e7) {
    const val = n / 1e7;
    return '₹' + val.toFixed(val >= 100 ? 0 : val >= 10 ? 1 : 2) + ' Cr';
  }
  if (n >= 1e5) {
    const val = n / 1e5;
    return '₹' + val.toFixed(val >= 10 ? 1 : 2) + ' L';
  }
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function inrMonthly(n) {
  if (!n || isNaN(n) || n <= 0) return '₹0';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

const ApiCostCalculator = () => {
  const [mode, setMode] = useState('u'); // 'u' = headcount / people, 't' = million tokens / month
  const [userCount, setUserCount] = useState(CALCULATOR_CONFIG.defaultUsers);
  const [tokenCount, setTokenCount] = useState(CALCULATOR_CONFIG.defaultTokens);
  const [rawInputValue, setRawInputValue] = useState(CALCULATOR_CONFIG.defaultUsers.toLocaleString('en-IN'));

  // Calculate live outputs according to the exact HTML formulas
  const calculations = useMemo(() => {
    let yr = 0;
    let y5 = 0;
    let y10 = 0;
    let y20 = 0;

    if (mode === 'u') {
      const n = userCount;
      yr = n * CALCULATOR_CONFIG.days * calculateDayCost(1, false);
      y5 = n * CALCULATOR_CONFIG.days * calculateDayCost(5, false);
      y10 = n * CALCULATOR_CONFIG.days * calculateDayCost(10, false);
      y20 = n * CALCULATOR_CONFIG.days * calculateDayCost(20, false);
    } else {
      const n = tokenCount;
      const blend = ((CALCULATOR_CONFIG.qIn * CALCULATOR_CONFIG.inUSD) + (CALCULATOR_CONFIG.qOut * CALCULATOR_CONFIG.outUSD)) / (TURN * 1e6) * CALCULATOR_CONFIG.fx;
      yr = n * 1e6 * 12 * blend;
      y5 = yr * 2;
      y10 = yr * 5;
      y20 = yr * 10;
    }

    const monthly = yr / 12;

    return {
      yr,
      monthly,
      y5,
      y10,
      y20,
    };
  }, [mode, userCount, tokenCount]);

  // Handle user input changes
  const handleUserInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setRawInputValue('');
      if (mode === 'u') setUserCount(0);
      else setTokenCount(0);
      return;
    }
    const num = parseInt(val, 10);
    if (mode === 'u') {
      setUserCount(num);
      setRawInputValue(num.toLocaleString('en-IN'));
    } else {
      setTokenCount(num);
      setRawInputValue(num.toLocaleString('en-IN'));
    }
  };

  // Toggle between headcount and token volume
  const handleModeSwap = () => {
    if (mode === 'u') {
      setMode('t');
      setTokenCount(CALCULATOR_CONFIG.defaultTokens);
      setRawInputValue(CALCULATOR_CONFIG.defaultTokens.toLocaleString('en-IN'));
    } else {
      setMode('u');
      setUserCount(CALCULATOR_CONFIG.defaultUsers);
      setRawInputValue(CALCULATOR_CONFIG.defaultUsers.toLocaleString('en-IN'));
    }
  };

  return (
    <section 
      id="cost-calculator" 
      className="relative w-full pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-5 bg-[#000000] text-white z-10 overflow-hidden flex flex-col justify-center scroll-mt-20"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-4 sm:mb-5 text-left">
          <span 
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/50 font-normal mb-1.5 block"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            WHAT IT COSTS
          </span>

          <h2 
            className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] font-semibold tracking-tight text-white leading-[1.2]"
            style={{ fontFamily: "'REM', sans-serif" }}
          >
            Renting AI is billed by the request.<br />
            <span 
              className="font-semibold tracking-tight"
              style={{
                backgroundImage: 'linear-gradient(135deg, #C084FC 0%, #A855F7 50%, #9333EA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Owning it is not.
            </span>
          </h2>
        </div>

        {/* 2x2 Bento Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4.5 w-full items-stretch">
          
          {/* ========================================================================= */}
          {/* CARD 1: INPUT CARD (Top-Left, 5 cols)                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-[#09090b] border border-white/10 hover:border-white/20 rounded-[20px] p-4.5 sm:p-5 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[160px]">
            <div>
              <div className="text-white/70 text-xs sm:text-[13px] font-normal mb-2.5 sm:mb-3">
                {mode === 'u' ? 'People in your organisation' : 'Million tokens a month'}
              </div>

              <div className="relative flex flex-col gap-1.5">
                <div className="relative flex items-center border-b border-white/20 focus-within:border-[#A855F7] transition-all pb-1">
                  <input
                    type="text"
                    value={rawInputValue}
                    onChange={handleUserInputChange}
                    placeholder="0"
                    className="w-full bg-transparent text-2xl sm:text-3xl md:text-[34px] font-bold text-white tracking-tight focus:outline-none placeholder:text-white/20"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  />
                  {mode === 't' && (
                    <span className="text-white/40 text-xs sm:text-sm ml-2" style={{ fontFamily: "'REM', sans-serif" }}>M Tokens</span>
                  )}
                </div>

                {/* Preset quick selection pills for easy live interaction */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {mode === 'u' ? (
                    [5000, 10000, 20000, 50000, 100000].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setUserCount(count);
                          setRawInputValue(count.toLocaleString('en-IN'));
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                          userCount === count 
                            ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#C084FC]' 
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                        style={{ fontFamily: "'REM', sans-serif" }}
                      >
                        {count >= 1000 ? `${count / 1000}k` : count}
                      </button>
                    ))
                  ) : (
                    [100, 300, 600, 1000, 2000].map((mTok) => (
                      <button
                        key={mTok}
                        type="button"
                        onClick={() => {
                          setTokenCount(mTok);
                          setRawInputValue(mTok.toLocaleString('en-IN'));
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                          tokenCount === mTok 
                            ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#C084FC]' 
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                        style={{ fontFamily: "'REM', sans-serif" }}
                      >
                        {mTok}M
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom link toggle */}
            <div className="mt-3 pt-0.5">
              <button
                type="button"
                onClick={handleModeSwap}
                className="text-xs font-medium text-[#A855F7] hover:text-[#C084FC] hover:underline transition-all cursor-pointer text-left"
              >
                {mode === 'u' ? 'Enter tokens instead' : 'Enter headcount instead'}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 2: MAIN COMPARISON / METERED API BILL (Top-Right, 7 cols)            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-[#09090b] border border-white/10 hover:border-white/20 rounded-[20px] p-4.5 sm:p-5 flex flex-col justify-center shadow-2xl transition-all duration-300 min-h-[160px]">
            <div>
              <div className="text-white/70 text-xs sm:text-[13px] font-normal mb-1.5">
                What a metered API bills you
              </div>

              {/* Big Yearly Metric Display */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span 
                  className="text-3xl sm:text-4xl md:text-[38px] font-bold tracking-tight text-white transition-all duration-200"
                  style={{ fontFamily: "'REM', sans-serif" }}
                >
                  {inr(calculations.yr)}
                </span>
                <span 
                  className="text-white/40 text-xs sm:text-[13px] tracking-wide"
                  style={{ fontFamily: "'REM', sans-serif" }}
                >
                  / per year
                </span>
              </div>

              {/* Context Note */}
              <p className="mt-2 text-[11px] sm:text-xs text-white/50 font-light leading-snug">
                {mode === 'u' 
                  ? 'Even with the cheapest API in market. Just one request, per person, per day.' 
                  : 'On the cheapest public API rate, input and output combined.'}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 3: WITH 10X TECHNOLOGIES (Bottom-Left, 5 cols)                       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-[#09090b] border border-white/10 hover:border-amber-200/30 rounded-[20px] p-4.5 sm:p-5 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[205px]">
            <div>
              <div className="text-white/80 text-xs sm:text-[13px] font-semibold mb-2 tracking-tight flex items-center justify-between">
                <span>With 10X Technologies</span>
              </div>

              {/* Clean Premium Golden Infinity Symbol */}
              <div className="flex items-center gap-2.5 my-2 sm:my-2.5">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7 sm:w-8 sm:h-8 select-none shrink-0 overflow-visible"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(245, 175, 45, 0.45))' }}
                  aria-label="Unlimited requests forever"
                >
                  <defs>
                    <linearGradient id="cleanGoldInfinityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF4D0" />
                      <stop offset="35%" stopColor="#F5BF50" />
                      <stop offset="70%" stopColor="#E59E28" />
                      <stop offset="100%" stopColor="#BF7314" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"
                    fill="none"
                    stroke="url(#cleanGoldInfinityGrad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span 
                  className="text-white/40 text-xs sm:text-[12px] font-mono tracking-wide"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  / requests, forever
                </span>
              </div>

              {/* Metric rows */}
              <div className="flex flex-col text-xs sm:text-[13px] divide-y divide-white/[0.06]">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-white/70 font-light">People who can use it</span>
                  <span className="text-[#A855F7] font-semibold">Unlimited</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-white/70 font-light">Requests they can make</span>
                  <span className="text-[#A855F7] font-semibold">Unlimited</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-white/70 font-light">Cost per request</span>
                  <span className="text-[#A855F7] font-bold text-sm sm:text-base" style={{ fontFamily: "'REM', sans-serif" }}>₹0</span>
                </div>
              </div>
            </div>

            {/* Bottom Callout Pill / Badge */}
            <div className="mt-2.5 pt-0.5">
              <div className="bg-gradient-to-r from-[#17102e] to-[#0d0a1a] border border-[#A855F7]/30 rounded-xl px-3 py-2 sm:py-2.5 shadow-[0_4px_16px_rgba(168,85,247,0.12)] flex items-center">
                <p className="text-[11px] sm:text-xs text-white/75 leading-snug font-light">
                  One licence, paid once.{' '}
                  <strong className="text-white font-semibold">Your own model, on your own server.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 4: COMPARISON TABLE (Bottom-Right, 7 cols)                           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-[#09090b] border border-white/10 hover:border-white/20 rounded-[20px] p-4.5 sm:p-5 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[205px]">
            <div>
              <div className="text-white/70 text-xs sm:text-[13px] font-normal mb-2">
                {mode === 'u' ? 'The same people, asking more often' : 'Scaling with volume'}
              </div>

              {/* Comparison Table */}
              <div className="w-full flex flex-col">
                
                {/* Table Header */}
                <div 
                  className="grid grid-cols-12 pb-1.5 border-b border-white/[0.08] text-[9px] sm:text-[10.5px] uppercase tracking-wider text-white/40 items-center"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <div className="col-span-4 text-left">{mode === 'u' ? 'REQUESTS PER DAY' : 'VOLUME'}</div>
                  <div className="col-span-4 text-right pr-3.5 border-r border-white/[0.08]">CHEAPEST API, PER YEAR</div>
                  <div className="col-span-4 text-right pl-3.5 text-[#A855F7] font-medium">10X LICENCE</div>
                </div>

                {/* Row 1: 5 a day / 2x volume */}
                <div className="grid grid-cols-12 py-2 border-b border-white/[0.06] items-center text-xs sm:text-[13px]">
                  <div className="col-span-4 text-left text-white/90">
                    {mode === 'u' ? (
                      <>
                        <span className="font-bold text-white text-xs sm:text-sm mr-1" style={{ fontFamily: "'REM', sans-serif" }}>5</span> a day
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-white text-xs sm:text-sm mr-1" style={{ fontFamily: "'REM', sans-serif" }}>2×</span> the volume
                      </>
                    )}
                  </div>
                  <div 
                    className="col-span-4 text-right pr-3.5 border-r border-white/[0.08] font-bold text-white text-xs sm:text-sm tracking-tight"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    {inr(calculations.y5)}
                  </div>
                  <div className="col-span-4 text-right pl-3.5 font-medium text-[#A855F7]">
                    Always fixed
                  </div>
                </div>

                {/* Row 2: 10 a day / 5x volume */}
                <div className="grid grid-cols-12 py-2 border-b border-white/[0.06] items-center text-xs sm:text-[13px]">
                  <div className="col-span-4 text-left text-white/90">
                    {mode === 'u' ? (
                      <>
                        <span className="font-bold text-white text-xs sm:text-sm mr-1" style={{ fontFamily: "'REM', sans-serif" }}>10</span> a day
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-white text-xs sm:text-sm mr-1" style={{ fontFamily: "'REM', sans-serif" }}>5×</span> the volume
                      </>
                    )}
                  </div>
                  <div 
                    className="col-span-4 text-right pr-3.5 border-r border-white/[0.08] font-bold text-white text-xs sm:text-sm tracking-tight"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    {inr(calculations.y10)}
                  </div>
                  <div className="col-span-4 text-right pl-3.5 font-medium text-[#A855F7]">
                    Always fixed
                  </div>
                </div>

                {/* Row 3: 20 a day / 10x volume */}
                <div className="grid grid-cols-12 py-2 items-center text-xs sm:text-[13px]">
                  <div className="col-span-4 text-left text-white/90">
                    {mode === 'u' ? (
                      <>
                        <span className="font-bold text-white text-xs sm:text-sm mr-1" style={{ fontFamily: "'REM', sans-serif" }}>20</span> a day
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-white text-xs sm:text-sm mr-1" style={{ fontFamily: "'REM', sans-serif" }}>10×</span> the volume
                      </>
                    )}
                  </div>
                  <div 
                    className="col-span-4 text-right pr-3.5 border-r border-white/[0.08] font-bold text-white text-xs sm:text-sm tracking-tight"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    {inr(calculations.y20)}
                  </div>
                  <div className="col-span-4 text-right pl-3.5 font-medium text-[#A855F7]">
                    Always fixed
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Footnote Note */}
            <div className="mt-2.5 pt-0.5">
              <p className="text-[10px] sm:text-[11px] text-white/50 font-light leading-relaxed">
                Ten requests cost more than ten times one. Each one carries the whole conversation back to the model, so <strong className="text-white/90 font-medium">the last request of the day pays for every request before it.</strong>
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ApiCostCalculator;
