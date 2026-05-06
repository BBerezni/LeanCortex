import { MainLayout } from '@/components/layout/main-layout'
import { HeroSection } from '@/components/sections/hero-section'
import { ModulesSection } from '@/components/sections/modules-section'
import { FeaturesSection } from '@/components/sections/features-section'

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <ModulesSection />
      <FeaturesSection />
    </MainLayout>
  )
}
