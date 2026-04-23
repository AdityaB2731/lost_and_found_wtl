import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-14 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <Header />
      <main className="relative container mx-auto px-4 py-10">
        {children}
      </main>
      <footer className="relative mt-10 border-t border-blue-100/80 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-5 text-center text-sm font-medium tracking-wide text-blue-900/90">
          <p>&copy; 2026 Lost & Found. Reconnect faster, together.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;