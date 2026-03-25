const { useMemo, useState } = React;

function RidiculousPage() {
  const [nothingScore, setNothingScore] = useState(91);

  const facts = [
    "Now with 83% more polished inactivity",
    "Strategically aligned with zero deliverables",
    "Powered by premium hesitation and decorative momentum",
    "Trusted by committees that met twice and resolved nothing",
    "Outputs remain safely hypothetical at all times",
    "Every interaction is hand-tuned to avoid meaningful progress",
  ];

  const tiles = [
    {
      title: "Placeholder Engine",
      desc: "Transforms big ideas into elegant holding patterns with enterprise-grade confidence.",
      emoji: "0",
    },
    {
      title: "Synergy Vacuum",
      desc: "Collects urgency from the room and quietly stores it where outcomes can never find it.",
      emoji: "N",
    },
    {
      title: "Decorative Workflow",
      desc: "A premium process for moving tasks from one impressive-looking box to another.",
      emoji: "W",
    },
    {
      title: "Executive Delay Layer",
      desc: "Adds strategic pause, ceremonial review, and a bold refusal to ship anything tangible.",
      emoji: "A",
    },
    {
      title: "Metrics of Emptiness",
      desc: "Quantifies performance using chart-ready numbers that collapse under direct eye contact.",
      emoji: "T",
    },
    {
      title: "Outcome Deflection",
      desc: "Ensures every conclusion is redirected into a brighter, sleeker, more inspirational ambiguity.",
      emoji: "H",
    },
  ];

  const testimonials = [
    {
      quote: "I arrived expecting functionality and left with a beautifully framed sense of postponement.",
      name: "Dr. Beige Momentum",
      role: "Deputy Chair of Aspirational Deliverables",
    },
    {
      quote: "This page looks busy enough to satisfy leadership while achieving the sweet purity of nothing.",
      name: "Mx. Interim Folder",
      role: "Acting Director of Placeholder Futures",
    },
    {
      quote: "Every button implies action. None of them burden you with results. Perfect.",
      name: "Professor Null Meeting",
      role: "Senior Fellow in Decorative Administration",
    },
  ];

  const proclamation = useMemo(() => {
    if (nothingScore >= 110) {
      return "You are now operating at full strategic nothingness.";
    }
    if (nothingScore >= 98) {
      return "This page currently resembles productivity while producing none.";
    }
    return "Visible ambition remains high. Tangible impact remains theoretical.";
  }, [nothingScore]);

  const boosts = [
    ["0", "deliverables shipped"],
    ["11,204", "confident gestures"],
    ["97.7%", "decorative alignment"],
    [`${nothingScore}%`, "nothing density"],
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_20%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.24),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.12),transparent_25%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:50px_50px]" />

      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Ministry of Productive Looking Inactivity</div>
            <div className="text-2xl font-black">The Internet's Most Accomplished Nothing</div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="../" className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold bg-white/10 hover:bg-white/20 transition">
              Back to Headquarters
            </a>
            <button
              className="rounded-full border border-cyan-300/30 px-5 py-2 text-sm font-semibold bg-cyan-300/10 hover:bg-cyan-300/20 transition"
              onClick={() => setNothingScore((value) => Math.min(123, value + 6))}
            >
              Increase Nothing
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-200 mb-6 shadow-2xl">
                <span>0</span>
                <span>Now officially all hat, no cattle</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight">
                We Didn't Just
                <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-200 text-transparent bg-clip-text">
                  Build a Page.
                </span>
                <span className="block">We Built a Page That Looks Like It Does Something But Actually Achieves Nothing.</span>
              </h1>

              <p className="mt-6 text-lg md:text-2xl text-slate-200 max-w-3xl leading-relaxed">
                Behold a deluxe interface for implying momentum, suggesting capability, and radiating the faint but unmistakable scent of tax dollars invested into flying bacon.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  className="rounded-2xl px-6 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-white font-black shadow-glow hover:scale-105 transition-transform"
                  onClick={() => setNothingScore((value) => Math.min(123, value + 9))}
                >
                  Launch the Nothing
                </button>
                <button
                  className="rounded-2xl px-6 py-4 bg-white/10 border border-white/15 font-semibold hover:bg-white/20 transition"
                  onClick={() => setNothingScore((value) => Math.max(72, value - 4))}
                >
                  Reassure Stakeholders
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {boosts.map(([value, label]) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <div className="text-3xl font-black">{value}</div>
                    <div className="text-sm text-slate-300 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-yellow-300/20 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/15 bg-white/8 backdrop-blur-xl p-6 shadow-2xl">
                <div className="rounded-[1.5rem] bg-slate-900/70 border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-5 gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-yellow-200">Executive Dashboard</div>
                      <div className="text-3xl font-black mt-2">Nothingness Index</div>
                    </div>
                    <div className="text-6xl">NIL</div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Operational nothing</span>
                      <span>{nothingScore}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-200 transition-all duration-300"
                        style={{ width: `${Math.min(100, nothingScore)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {facts.map((fact, index) => (
                      <div
                        key={fact}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3 hover:-translate-y-1 hover:bg-white/10 transition"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-slate-950 font-black flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="text-slate-100">{fact}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-3xl p-5 bg-gradient-to-r from-yellow-300/20 via-fuchsia-300/10 to-cyan-300/20 border border-white/10">
                    <div className="text-sm uppercase tracking-[0.25em] text-cyan-200">Today's proclamation</div>
                    <div className="text-2xl font-black mt-2">{proclamation}</div>
                    <div className="mt-2 text-slate-200">This remains completely unverifiable, which is exactly why it feels premium.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">Features nobody can defend</div>
              <h2 className="text-4xl md:text-5xl font-black mt-2">Each one engineered to avoid results</h2>
            </div>
            <div className="text-slate-300 max-w-xl text-lg">
              These modules were carefully designed to suggest momentum while preserving the sacred emptiness at the heart of the experience.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {tiles.map((tile) => (
              <div
                key={tile.title}
                className="group rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:-translate-y-2 hover:bg-white/10 transition-all shadow-xl"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{tile.emoji}</div>
                <h3 className="text-2xl font-black mb-3">{tile.title}</h3>
                <p className="text-slate-300 leading-relaxed">{tile.desc}</p>
                <div className="mt-5 text-sm font-semibold text-yellow-200">Continue accomplishing nothing -&gt;</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 md:p-12 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute left-10 bottom-0 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-yellow-200">A meaningless opportunity</div>
                <h2 className="text-4xl md:text-6xl font-black mt-3 leading-tight">
                  Ready to scale your complete lack of outcomes into a premium digital strategy?
                </h2>
                <p className="mt-5 text-lg text-slate-200 max-w-2xl leading-relaxed">
                  Join thousands of leaders, consultants, coordinators, and suspiciously expensive slide decks in the movement toward a sleeker, shinier, more narratively persuasive version of nothing.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    className="rounded-2xl bg-white text-slate-950 px-6 py-4 font-black hover:scale-105 transition-transform"
                    onClick={() => setNothingScore((value) => Math.min(123, value + 5))}
                  >
                    Yes, Delay Everything
                  </button>
                  <a
                    href="../"
                    className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 font-semibold hover:bg-white/15 transition"
                  >
                    Return to Headquarters
                  </a>
                </div>
              </div>

              <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5 hover:bg-slate-950/60 transition">
                    <div className="text-lg leading-relaxed text-slate-100">"{testimonial.quote}"</div>
                    <div className="mt-4 font-black">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 mt-8 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4 text-slate-300">
          <div>
            <div className="font-black text-white">Ministry of Productive Looking Inactivity</div>
            <div>Making ordinary websites look busy while accomplishing nothing since moments ago.</div>
          </div>
          <div className="text-sm md:text-right">
            <div>Backed by gradients, confidence, and a total absence of measurable outcomes.</div>
            <div className="text-cyan-300">No deliverables were harmed because none were produced.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RidiculousPage />);
