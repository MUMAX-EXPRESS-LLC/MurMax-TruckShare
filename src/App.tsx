import "./app.css";

export default function App() {
  return (
    <div className="mx-app">
      {/* Top Bar */}
      <header className="mx-topbar">
        <div className="mx-container mx-row">
          <div className="mx-brand">
            <span className="mx-dot" /> MurMax <strong>TruckShare</strong>
          </div>
          <nav className="mx-nav">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-hero">
        <div className="mx-container">
          <h1>
            The ride-share network for <span className="mx-accent">freight</span>
          </h1>
          <p className="mx-sub">
            Connect <b>Shippers</b>, <b>Drivers</b>, and <b>Dispatch</b> in seconds.
            Instant booking. Transparent pricing. <b>No-Strings™</b>.
          </p>
          <div className="mx-cta">
            <a className="mx-btn mx-primary" href="#get-started">Get Started</a>
            <a className="mx-btn mx-secondary" href="#demo">View Demo</a>
          </div>
          <div className="mx-badges">
            <span>Live on Vercel</span> • <span>Vite + React</span> • <span>TypeScript</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-section">
        <div className="mx-container">
          <h2>Why MurMax TruckShare</h2>
          <div className="mx-grid">
            <div className="mx-card">
              <h3>Instant Loads</h3>
              <p>Post and accept loads in real time with automated notifications.</p>
            </div>
            <div className="mx-card">
              <h3>Smart Matching</h3>
              <p>Optimized suggestions by lane, equipment, RPM targets, and compliance.</p>
            </div>
            <div className="mx-card">
              <h3>No-Strings™</h3>
              <p>Clear payouts, transparent fees, and built-in performance tracking.</p>
            </div>
            <div className="mx-card">
              <h3>MurMax Ops</h3>
              <p>Dispatcher tools, driver onboarding, and one-click paperwork bundles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-section">
        <div className="mx-container mx-how">
          <div className="mx-step">
            <span className="mx-step-num">1</span>
            <h4>Create your profile</h4>
            <p>Choose Driver, Shipper, or Dispatcher and verify in minutes.</p>
          </div>
          <div className="mx-step">
            <span className="mx-step-num">2</span>
            <h4>Set your rules</h4>
            <p>Pick lanes, equipment, RPM floor, and No-Strings™ preferences.</p>
          </div>
          <div className="mx-step">
            <span className="mx-step-num">3</span>
            <h4>Book & roll</h4>
            <p>Match instantly, e-sign, and track KPIs from pickup to POD.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="mx-cta-band">
        <div className="mx-container mx-row">
          <div>
            <h2>Ready to move freight the MurMax way?</h2>
            <p>Launch your profile and get your first load today.</p>
          </div>
          <a className="mx-btn mx-primary" href="#contact">Join the Network</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-footer" id="contact">
        <div className="mx-container mx-row">
          <p>© {new Date().getFullYear()} MurMax Express®. All rights reserved.</p>
          <div className="mx-foot-links">
            <a href="https://appmurmaxexpress.com/status.html">Status</a>
            <a href="https://appmurmaxexpress.com/robots.txt">Robots</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
