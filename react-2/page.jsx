const { useMemo, useState } = React;

function RidiculousPage() {
  const [legendScore, setLegendScore] = useState(88);

  const facts = [
    "Now with 700% more majestic nonsense",
    "Trusted by 11 out of 10 interdimensional consultants",
    "Powered by premium moonbeams and suspicious confidence",
    "Winner of the 2026 Golden Parsnip for Digital Excess",
    "Certified emotionally aerodynamic",
    "Hand-whispered by artisanal algorithms",
  ];

  const tiles = [
    {
      title: "Prestige Onion(TM)",
      desc: "A multilayer luxury system for people who believe one layer of reality is simply not enough.",
      emoji: "O",
    },
    {
      title: "Turbo Whimsy Engine",
      desc: "Converts ordinary curiosity into championship-grade sparkle at mildly concerning speeds.",
      emoji: "T",
    },
    {
      title: "CEO of Vibes",
      desc: "An honorary role automatically bestowed upon anyone who clicks dramatically enough.",
      emoji: "C",
    },
    {
      title: "Hyperdeluxe Trust",
      desc: "Our page feels important because it contains gradients, statistics, and a complete lack of restraint.",
      emoji: "H",
    },
    {
      title: "Hover Majesty",
      desc: "Every card rises slightly because modern civilization demanded it.",
      emoji: "M",
    },
    {
      title: "Ethically Sourced Chaos",
      desc: "Harvested from free-range brainstorms roaming the neon foothills of imagination.",
      emoji: "E",
    },
  ];

  const testimonials = [
    {
      quote: "Before this website, I was merely a person. Now I am a concept with posture.",
      name: "Dr. Velvet Thunder",
      role: "Senior Futurist of Unnecessary Grandeur",
    },
    {
      quote: "I clicked one button and immediately felt more legend-adjacent.",
      name: "Mx. Pancake Orbit",
      role: "Chief Expansion Officer, Galactic Brunch Guild",
    },
    {
      quote: "The page looked at me first. Frankly? Respect.",
      name: "Professor Laser Apricot",
      role: "Chair of Decorative Momentum",
    },
  ];

  const proclamation = useMemo(() => {
    if (legendScore >= 110) {
      return "You are now operating at full peacock bandwidth.";
    }
    if (legendScore >= 95) {
      return "Your aura has entered premium parade territory.";
    }
    return "Legend potential remains dangerously high.";
  }, [legendScore]);

  const boosts = [
    ["14,922", "dramatic clicks"],
    ["99.98%", "prestige density"],
    ["42", "ceremonial gradients"],
    [`${legendScore}%`, "legend saturation"],
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_20%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.25),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.16),transparent_25%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:50px_50px]" />

      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Ridiculous Systems International</div>
            <div className="text-2xl font-black">The Internet's Most Unreasonable Page</div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="../" className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold bg-white/10 hover:bg-white/20 transition">
              Back to Headquarters
            </a>
            <button
              className="rounded-full border border-cyan-300/30 px-5 py-2 text-sm font-semibold bg-cyan-300/10 hover:bg-cyan-300/20 transition"
              onClick={() => setLegendScore((value) => Math.min(123, value + 7))}
            >
              Become More Legendary
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-200 mb-6 shadow-2xl">
                <span>+</span>
                <span>Now officially too much</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight">
                We Didn't Just
                <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-200 text-transparent bg-clip-text">
                  Build a Page.
                </span>
                <span className="block">We Built a Parade.</span>
              </h1>

              <p className="mt-6 text-lg md:text-2xl text-slate-200 max-w-2xl leading-relaxed">
                Behold a digital monument to excess, delight, spectacle, confidence, and several decisions that would absolutely frighten a minimalist.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  className="rounded-2xl px-6 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-white font-black shadow-glow hover:scale-105 transition-transform"
                  onClick={() => setLegendScore((value) => Math.min(123, value + 11))}
                >
                  Launch the Glory
                </button>
                <button
                  className="rounded-2xl px-6 py-4 bg-white/10 border border-white/15 font-semibold hover:bg-white/20 transition"
                  onClick={() => setLegendScore((value) => Math.max(77, value - 3))}
                >
                  Press the Fancy One
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
                      <div className="text-3xl font-black mt-2">Ridiculousness Index</div>
                    </div>
                    <div className="text-6xl">RSI</div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Legend score</span>
                      <span>{legendScore}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-200 transition-all duration-300"
                        style={{ width: `${Math.min(100, legendScore)}%` }}
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
                    <div className="mt-2 text-slate-200">This remains impossible to verify, which is precisely what makes it premium.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">Features nobody requested</div>
              <h2 className="text-4xl md:text-5xl font-black mt-2">And yet, somehow, essential</h2>
            </div>
            <div className="text-slate-300 max-w-xl text-lg">
              Every premium nonsense ecosystem needs a few modules of startling importance.
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
                <div className="mt-5 text-sm font-semibold text-yellow-200">Engage dramatically -&gt;</div>
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
                <div className="text-sm uppercase tracking-[0.3em] text-yellow-200">A premium opportunity</div>
                <h2 className="text-4xl md:text-6xl font-black mt-3 leading-tight">
                  Ready to scale your personal aura into a full multinational event?
                </h2>
                <p className="mt-5 text-lg text-slate-200 max-w-2xl leading-relaxed">
                  Join thousands of visionaries, tastemakers, decorative emperors, and accidentally magnificent interns in the movement toward a more dazzling tomorrow.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    className="rounded-2xl bg-white text-slate-950 px-6 py-4 font-black hover:scale-105 transition-transform"
                    onClick={() => setLegendScore((value) => Math.min(123, value + 5))}
                  >
                    Yes, Crown Me
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
            <div className="font-black text-white">Ridiculous Systems International</div>
            <div>Making ordinary websites feel underdressed since moments ago.</div>
          </div>
          <div className="text-sm md:text-right">
            <div>Backed by confidence, gradients, and ceremonial nonsense.</div>
            <div className="text-cyan-300">No subtlety was harmed because none was present.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RidiculousPage />);
