# LeanCortex - Lean Obrazovna Platforma

LeanCortex je napredna obrazovna i simulaciona platforma za Lean tehnologije u kontekstu Industrije 4.0. Platforma omogućava interaktivno učenje i primenu Lean metodologija kroz moderne web tehnologije.

## 🚀 Funkcionalnosti

### 🎯 Lean Moduli
- **5S Metodologija** - Organizacija radnog prostora kroz 5 principa
- **Kaizen** - Kontinuirano poboljšanje procesa
- **VSM Mapiranje** - Vrednosno mapiranje tokova
- **SMED** - Brza promena alata
- **Poka Yoke** - Sprečavanje grešaka
- **Heijunka** - Balansiranje produkcije
- **OEE** - Ukupna efikasnost opreme

### 🌟 Mogućnosti
- **Interaktivne simulacije** - Realni scenariji iz industrije
- **Modularna arhitektura** - Lako dodavanje novih modula
- **Responsive dizajn** - Radi na svim uređajima
- **PWA podrška** - Instalacija kao aplikacija
- **Srpski jezik** - Kompletan lokalizovani interfejs
- **Napredna analitika** - Praćenje napretka i rezultata

## 🛠 Tehnologije

### Frontend
- **Next.js 14** - React framework sa App Router
- **TypeScript** - Tip siguran kod
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Moderni UI komponente
- **Framer Motion** - Animacije i tranzicije

### Backend
- **Next.js API Routes** - Serverless API
- **Supabase** - PostgreSQL baza, auth i storage
- **FastAPI (buduće)** - Python backend za analitiku

### Deployment
- **Vercel** - Cloud hosting platforma
- **PWA** - Progressive Web App podrška

## 📋 Zahtevi

- Node.js 18+ 
- npm ili yarn
- Supabase nalog (za development)

## 🚀 Instalacija

1. **Klonirajte repozitorijum**
```bash
git clone <repository-url>
cd lean-cortex
```

2. **Instalirajte zavisnosti**
```bash
npm install
```

3. **Postavite environment varijable**
```bash
cp .env.example .env.local
```

4. **Konfigurišite Supabase**
- Kreirajte novi projekat na [Supabase](https://supabase.com)
- Dodajte URL i anon key u `.env.local`
- Pokrenite SQL migracije

5. **Pokrenite development server**
```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

## 🏗️ Projektna Struktura

```
lean-cortex/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # Globalni stilovi
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Početna stranica
│   ├── components/          # React komponente
│   │   ├── ui/            # shadcn/ui komponente
│   │   ├── layout/        # Header, Footer, Layout
│   │   ├── sections/      # Sekcije početne stranice
│   │   └── modules/       # Lean moduli
│   ├── lib/               # Pomoćne funkcije
│   ├── types/             # TypeScript tipovi
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility funkcije
├── public/               # Staticki fajlovi
├── docs/                 # Dokumentacija
└── tests/                # Testovi
```

## 🎨 Dizajn Principi

### Modularna Arhitektura
Svaki Lean alat je implementiran kao zaseban modul:
- Nezavisna komponenta
- Sopstveni routing
- Izolovana stanja
- Lako testiranje

### Responsive Dizajn
- Mobile-first pristup
- Adaptivni layout
- Optimizano za sve uređaje

### Korisničko Iskustvo
- Intuitivna navigacija
- Glatke animacije
- Brzo učitavanje
- Puni pristupnost

## 🌐 Jezici

- **Srpski (sr)** - Primarni jezik interfejsa
- **Engleski (en)** - Kod i dokumentacija

## 📱 PWA Mogućnosti

- **Offline pristup** - Osnovne funkcionalnosti rade bez interneta
- **Installable** - Moguće instalirati kao aplikaciju
- **Push notifikacije** - Podsetnici i obaveštenja
- **App manifest** - Ikone i tema

## 🔧 Development

### Dodavanje Novog Modula

1. **Kreirajte strukturu modula**
```bash
mkdir src/components/modules/[module-name]
mkdir src/app/moduli/[module-name]
```

2. **Implementirajte komponentu**
```typescript
// src/components/modules/[module-name]/[module-name]-module.tsx
export function ModuleNameModule() {
  // Implementacija modula
}
```

3. **Dodajte routing**
```typescript
// src/app/moduli/[module-name]/page.tsx
import { ModuleNameModule } from '@/components/modules/[module-name]/[module-name]-module'

export default function ModulePage() {
  return <ModuleNameModule />
}
```

4. **Ažurirajte navigaciju**
Dodajte link u header komponentu.

### Code Style

- **TypeScript** za tip sigurnost
- **ESLint** za code quality
- **Prettier** za formatiranje
- **Conventional Commits** za verzionisanje

## 🧪 Testiranje

```bash
# Unit testovi
npm run test

# E2E testovi
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Build i Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deployment na Vercel
```bash
npm run build
vercel --prod
```

## 🤝 Doprinos

1. Fork-ujte repozitorijum
2. Kreirajte feature branch (`git checkout -b feature/amazing-feature`)
3. Commit-ujte promene (`git commit -m 'Add amazing feature'`)
4. Push-ujte na branch (`git push origin feature/amazing-feature`)
5. Otvorite Pull Request

## 📄 Licenca

Ovaj projekat je licenciran pod MIT licencom - pogledajte [LICENSE](LICENSE) fajl za detalje.

## 📞 Kontakt

- **Email**: info@leancortex.rs
- **Web**: [leancortex.rs](https://leancortex.rs)
- **Adresa**: Beograd, Srbija

## 🙏 Zahvalnice

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI komponente
- [Supabase](https://supabase.com/) - Backend kao servis
- [Framer Motion](https://www.framer.com/motion/) - Animacije

---

**LeanCortex** - Transformišite poslovanje kroz Lean metodologiju! 🚀
