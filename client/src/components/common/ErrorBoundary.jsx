import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🛟</div>
          <h2 className="font-fredoka text-2xl text-navy mb-2">Something went off-route</h2>
          <p className="text-navy/60 mb-6">
            We hit a snag loading this page. Try again, or head back home.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.reset}
              className="px-5 py-2.5 rounded-2xl bg-brand-orange text-white font-semibold border-2 border-navy shadow-retro"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-5 py-2.5 rounded-2xl bg-white text-navy font-semibold border-2 border-navy shadow-retro"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
