import Link from 'next/link'
import { Brain, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo i opis */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-lean-blue" />
              <span className="text-lg font-bold">LeanCortex</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Obrazovna platforma za Lean tehnologije u kontekstu Industrije 4.0
            </p>
          </div>

          {/* Brzi linkovi */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Platforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  Početna
                </Link>
              </li>
              <li>
                <Link href="/moduli" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  Moduli
                </Link>
              </li>
              <li>
                <Link href="/o-nama" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  O nama
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Moduli */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Lean Moduli</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/moduli/5s" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  5S Metodologija
                </Link>
              </li>
              <li>
                <Link href="/moduli/kaizen" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  Kaizen
                </Link>
              </li>
              <li>
                <Link href="/moduli/vsm" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  VSM Mapiranje
                </Link>
              </li>
              <li>
                <Link href="/moduli/smed" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  SMED
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt informacije */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@leancortex.rs</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+381 11 123 456</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Beograd, Srbija</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 LeanCortex. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  )
}
