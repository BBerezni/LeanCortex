'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Brain, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                  Početna
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Moduli</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <Link href="/moduli/5s" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">5S Metodologija</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Organizacija radnog prostora kroz 5 koraka
                    </p>
                  </Link>
                  <Link href="/moduli/kaizen" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Kaizen</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Kontinuirano poboljšanje procesa
                    </p>
                  </Link>
                  <Link href="/moduli/vsm" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">VSM Mapiranje</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Vrednosno mapiranje tokova
                    </p>
                  </Link>
                  <Link href="/moduli/smed" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">SMED</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Brza promena alata
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/o-nama" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  O nama
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="sm">
            Prijavi se
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
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
              Početna
            </Link>
            <div className="space-y-2">
              <div className="py-2 text-sm font-medium">Moduli</div>
              <div className="pl-4 space-y-2">
                <Link href="/moduli/5s" className="block py-1 text-sm text-muted-foreground hover:text-lean-blue">
                  5S Metodologija
                </Link>
                <Link href="/moduli/kaizen" className="block py-1 text-sm text-muted-foreground hover:text-lean-blue">
                  Kaizen
                </Link>
                <Link href="/moduli/vsm" className="block py-1 text-sm text-muted-foreground hover:text-lean-blue">
                  VSM Mapiranje
                </Link>
                <Link href="/moduli/smed" className="block py-1 text-sm text-muted-foreground hover:text-lean-blue">
                  SMED
                </Link>
              </div>
            </div>
            <Link href="/o-nama" className="block py-2 text-sm font-medium hover:text-lean-blue">
              O nama
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Podešavanja
              </Button>
              <Button size="sm" className="w-full">
                Prijavi se
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
