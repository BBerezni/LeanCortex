'use client';

import Link from 'next/link'
import { Brain, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const footerTranslations = {
  sr: {
    description: 'Obrazovna platforma za Lean tehnologije u kontekstu Industrije 4.0',
    platform: 'Platforma',
    home: 'Početna',
    modules: 'Moduli',
    about: 'O nama',
    contact: 'Kontakt',
    leanModules: 'Lean Moduli',
    methodology5s: '5S Metodologija',
    kaizen: 'Kaizen',
    vsmMapping: 'VSM Mapiranje',
    smed: 'SMED',
    contactInfo: 'Kontakt',
    author: 'Autor: Bojan Berežni',
    copyright: '© 2024 LeanCortex. Sva prava zadržana.'
  },
  en: {
    description: 'Educational platform for Lean technologies in the context of Industry 4.0',
    platform: 'Platform',
    home: 'Home',
    modules: 'Modules',
    about: 'About',
    contact: 'Contact',
    leanModules: 'Lean Modules',
    methodology5s: '5S Methodology',
    kaizen: 'Kaizen',
    vsmMapping: 'VSM Mapping',
    smed: 'SMED',
    contactInfo: 'Contact',
    author: 'Author: Bojan Berežni',
    copyright: '© 2024 LeanCortex. All rights reserved.'
  }
}

export function Footer() {
  const { language } = useLanguage()
  const t = footerTranslations[language]

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
              {t.description}
            </p>
          </div>

          {/* Brzi linkovi */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t.platform}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/moduli" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.modules}
                </Link>
              </li>
              <li>
                <Link href="/o-nama" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Moduli */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t.leanModules}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/moduli/5s" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.methodology5s}
                </Link>
              </li>
              <li>
                <Link href="/moduli/kaizen" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.kaizen}
                </Link>
              </li>
              <li>
                <Link href="/moduli/vsm" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.vsmMapping}
                </Link>
              </li>
              <li>
                <Link href="/moduli/smed" className="text-muted-foreground hover:text-lean-blue transition-colors">
                  {t.smed}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt informacije */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t.contactInfo}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>bberezni@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Novi Sad, Srbija</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <span>{t.author}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
