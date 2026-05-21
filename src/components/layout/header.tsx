'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { useLanguage } from '@/context/LanguageContext'

// Language dictionary for header
const headerTranslations = {
  sr: {
    home: 'Početna',
    modules: 'Moduli',
    about: 'O nama'
  },
  en: {
    home: 'Home',
    modules: 'Modules',
    about: 'About Us'
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, toggleLanguage } = useLanguage()
  const t = headerTranslations[language]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-lean-blue" />
          <span className="text-xl font-bold text-foreground">LeanCortex</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  {t.home}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/moduli" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  {t.modules}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/o-nama" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  {t.about}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="hidden md:flex border-slate-600 bg-slate-800/50 text-gray-300 hover:bg-slate-700 hover:text-white"
        >
          {language === 'sr' ? 'EN' : 'SR'}
        </Button>


        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="border-slate-600 bg-slate-800/50 text-gray-300 hover:bg-slate-700 hover:text-white"
          >
            {language === 'sr' ? 'EN' : 'SR'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t bg-background"
        >
          <div className="container py-4 space-y-3">
            <Link href="/" className="block py-2 text-sm font-medium hover:text-lean-blue">
              {t.home}
            </Link>
            <Link href="/moduli" className="block py-2 text-sm font-medium hover:text-lean-blue">
              {t.modules}
            </Link>
            <Link href="/o-nama" className="block py-2 text-sm font-medium hover:text-lean-blue">
              {t.about}
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}
