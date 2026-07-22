import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-8 h-px bg-accent mb-8"></div>
      <h1 className="text-8xl font-display font-light text-white mb-6 tracking-tighter">
        404
      </h1>
      <p className="text-xl font-display text-white/50 mb-12">
        Page not found.
      </p>
      <Link to="/">
        <button className="text-sm font-sans tracking-widest uppercase px-12 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500">
          Return Home
        </button>
      </Link>
    </div>
  );
}
