import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/stadt-logo.png" 
              alt="Schieder-Schwalenberg Logo" 
              className="h-10 w-auto object-contain"
            />
          </a>
        </Link>

        {/* Legal Links */}
        <div className="flex items-center gap-4 text-sm">
          <a 
            href="https://www.schieder-schwalenberg.de/impressum/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Impressum
          </a>
          <a 
            href="https://www.schieder-schwalenberg.de/datenschutz/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Datenschutz
          </a>
        </div>
      </div>
    </header>
  );
}
