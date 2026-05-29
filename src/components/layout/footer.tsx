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
    contactInfo: 'Kontakt',
    author: 'Autor: Bojan Berežni',
    copyright: '© {year} LeanCortex. Sva prava zadržana.'
  },
  en: {
    description: 'Educational platform for Lean technologies in the context of Industry 4.0',
    platform: 'Platform',
    home: 'Home',
    modules: 'Modules',
    about: 'About',
    contact: 'Contact',
    contactInfo: 'Contact',
    author: 'Author: Bojan Berežni',
    copyright: '© {year} LeanCortex. All rights reserved.'
  }
}

export function Footer() {
  const { language } = useLanguage()
  const t = footerTranslations[language]

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-12">
          {/* Logo i opis - Brand column with more visual weight */}
          <div className="md:w-5/12 lg:w-4/12 space-y-4 mb-8 md:mb-0">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-lean-blue" />
              <span className="text-lg font-bold">LeanCortex</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Right side columns container */}
          <div className="flex flex-col sm:flex-row sm:gap-12 md:gap-16">
            {/* Brzi linkovi */}
            <div className="space-y-4 min-w-[140px]">
              <h3 className="text-sm font-semibold">{t.platform}</h3>
              <ul className="space-y-3 text-sm">
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

            {/* Kontakt informacije */}
            <div className="space-y-4 min-w-[140px]">
              <h3 className="text-sm font-semibold">{t.contactInfo}</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>bberezni@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>Novi Sad, Srbija</span>
                </li>
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <span>{t.author}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{t.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  )
}
