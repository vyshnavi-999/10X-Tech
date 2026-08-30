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
      className="relative w-full pt-8 sm:pt-12 md:pt-14 pb-12 sm:pb-14 bg-[#000000] text-white z-10 overflow-hidden flex flex-col justify-center scroll-mt-20"
    >
      <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-5 sm:mb-6 text-left">
          <span 
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/50 font-normal mb-2 block"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            WHAT IT COSTS
          </span>

          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-semibold tracking-tight text-white leading-[1.2]"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full items-stretch">
          
          {/* ========================================================================= */}
          {/* CARD 1: INPUT CARD (Top-Left, 5 cols)                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-[#09090b] border border-white/10 hover:border-white/20 rounded-[20px] p-4.5 sm:p-5.5 md:p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[170px] sm:min-h-[180px]">
            <div>
              <div className="text-white/70 text-xs sm:text-[13px] font-normal mb-3 sm:mb-4">
                {mode === 'u' ? 'People in your organisation' : 'Million tokens a month'}
              </div>

              <div className="relative flex flex-col gap-1.5">
                <div className="relative flex items-center border-b border-white/20 focus-within:border-[#A855F7] transition-all pb-1">
                  <input
                    type="text"
                    value={rawInputValue}
                    onChange={handleUserInputChange}
                    placeholder="0"
                    className="w-full bg-transparent text-2xl sm:text-3xl md:text-[36px] font-bold text-white tracking-tight focus:outline-none placeholder:text-white/20"
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

            {/* Bottom link toggle: Enter tokens instead / Enter headcount instead */}
            <div className="mt-4 pt-1">
              <button
                type="button"
                onClick={handleModeSwap}
                className="text-[11px] sm:text-xs font-medium text-[#A855F7] hover:text-[#C084FC] hover:underline transition-all cursor-pointer text-left"
              >
                {mode === 'u' ? 'Enter tokens instead' : 'Enter headcount instead'}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 2: MAIN COMPARISON / METERED API BILL (Top-Right, 7 cols)            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-[#09090b] border border-white/10 hover:border-white/20 rounded-[20px] p-4.5 sm:p-5.5 md:p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[170px] sm:min-h-[180px]">
            <div>
              <div className="text-white/70 text-xs sm:text-[13px] font-normal mb-2">
                What a metered API bills you
              </div>

              {/* Big Yearly Metric Display */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span 
                  className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-white transition-all duration-200"
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

              {/* Monthly Subtitle */}
              <div 
                className="mt-1.5 text-xs sm:text-sm md:text-[15px] font-semibold text-white/90"
                style={{ fontFamily: "'REM', sans-serif" }}
              >
                {inrMonthly(calculations.monthly)} <span className="font-normal text-white/60">per month</span>
              </div>

              {/* Context Note */}
              <p className="mt-1 text-[11px] sm:text-xs text-white/50 font-light leading-relaxed">
                {mode === 'u' 
                  ? 'On the cheapest public API, at one request each per day.' 
                  : 'On the cheapest public API rate, input and output combined.'}
              </p>
            </div>

            {/* Bottom 10X Licence Highlight */}
            <div className="mt-4 pt-1">
              <span className="text-xs sm:text-sm font-medium text-[#A855F7] tracking-tight block">
                One 10X licence. The same figure.
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 3: THE RATE USED (Bottom-Left, 5 cols)                               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-[#09090b] border border-white/10 hover:border-white/20 rounded-[20px] p-4.5 sm:p-5.5 md:p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[170px] sm:min-h-[180px]">
            <div>
              <div className="text-white/70 text-xs sm:text-[13px] font-normal mb-3 sm:mb-4">
                The rate used
              </div>

              {/* Rates Display */}
              <div className="flex flex-col gap-1.5" style={{ fontFamily: "'REM', sans-serif" }}>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white font-bold text-sm sm:text-base">
                    ${CALCULATOR_CONFIG.inUSD.toFixed(3)}
                  </span>
                  <span className="text-white/40 text-[11px] sm:text-xs">per 1M in</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white font-bold text-sm sm:text-base">
                    ${CALCULATOR_CONFIG.outUSD.toFixed(2)}
                  </span>
                  <span className="text-white/40 text-[11px] sm:text-xs">per 1M out</span>
                </div>
              </div>
            </div>

            {/* Footnote Explanation */}
            <p className="mt-4 text-[11px] sm:text-xs text-white/50 font-light leading-relaxed">
              The cheapest published rate on the market. Converted at ₹{CALCULATOR_CONFIG.fx} to the dollar. A premium model costs ten to thirty times more.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* CARD 4: COMPARISON TABLE (Bottom-Right, 7 cols)                           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-[#09090b] border border-white/10 hover:border-white/20 rounded-[20px] p-4.5 sm:p-5.5 md:p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[170px] sm:min-h-[180px]">
            <div>
              <div className="text-white/70 text-xs sm:text-[13px] font-normal mb-3">
                {mode === 'u' ? 'The same people, asking more often' : 'Scaling with volume'}
              </div>

              {/* Comparison Table */}
              <div className="w-full flex flex-col">
                
                {/* Table Header */}
                <div 
                  className="grid grid-cols-12 pb-2 border-b border-white/[0.08] text-[9px] sm:text-[11px] uppercase tracking-wider text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <div className="col-span-5 text-left">{mode === 'u' ? 'REQUESTS PER DAY' : 'VOLUME'}</div>
                  <div className="col-span-4 text-right">CHEAPEST API, PER YEAR</div>
                  <div className="col-span-3 text-right text-[#A855F7] font-medium">10X LICENCE</div>
                </div>

                {/* Row 1: 5 a day / 2x volume */}
                <div className="grid grid-cols-12 py-2 border-b border-white/[0.06] items-center text-xs sm:text-[13px]">
                  <div className="col-span-5 text-left text-white/90">
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
                    className="col-span-4 text-right font-bold text-white text-xs sm:text-sm tracking-tight"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    {inr(calculations.y5)}
                  </div>
                  <div className="col-span-3 text-right font-medium text-[#A855F7]">
                    Same
                  </div>
                </div>

                {/* Row 2: 10 a day / 5x volume */}
                <div className="grid grid-cols-12 py-2 border-b border-white/[0.06] items-center text-xs sm:text-[13px]">
                  <div className="col-span-5 text-left text-white/90">
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
                    className="col-span-4 text-right font-bold text-white text-xs sm:text-sm tracking-tight"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    {inr(calculations.y10)}
                  </div>
                  <div className="col-span-3 text-right font-medium text-[#A855F7]">
                    Same
                  </div>
                </div>

                {/* Row 3: 20 a day / 10x volume */}
                <div className="grid grid-cols-12 py-2 items-center text-xs sm:text-[13px]">
                  <div className="col-span-5 text-left text-white/90">
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
                    className="col-span-4 text-right font-bold text-white text-xs sm:text-sm tracking-tight"
                    style={{ fontFamily: "'REM', sans-serif" }}
                  >
                    {inr(calculations.y20)}
                  </div>
                  <div className="col-span-3 text-right font-medium text-[#A855F7]">
                    Same
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ApiCostCalculator;
