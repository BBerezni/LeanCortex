'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { useLanguage } from '@/context/LanguageContext';

const content = {
  sr: {
    pageTitle: 'O Autoru',
    role: 'Mašinski inženjer, Inovator & Kreator LeanCortex-a',
    intro: 'Ja sam Bojan Berežni, master student Inženjerskog menadžmenta na FTN-u u Novom Sadu (modul: Organizacija i upravljanje preduzećem) i Glavni specijalista HDM u NIS-u. Sa preko 11 godina iskustva u naftnoj industriji, vođenju timova od skoro 70 ljudi i strateškoj optimizaciji poslovnih procesa, moj cilj je spajanje inženjerske preciznosti sa modernim digitalnim rešenjima.',
    visionTitle: 'Vizija iza aplikacije',
    visionText: 'Verujem da učenje ne sme biti svedeno na suvu teoriju. Kroz dubinsku analizu poslovanja i implementaciju Lean tehnologija u praksi, shvatio sam da se apstraktni industrijski koncepti najbolje usvajaju kroz interakciju. LeanCortex je nastao kao moja master teza – edukativna platforma koja vizuelizuje gubitke, simulira proizvodne linije i pretvara Industriju 4.0 u opipljivo, interaktivno iskustvo.',
    skillsTitle: 'Multidisciplinarni pristup',
    skillsText: 'Moj rad se nalazi na preseku industrijskog inženjeringa, digitalnih tehnologija i kreativnosti. Umesto uskog fokusiranja na pojedinačne alate, verujem u sagledavanje šire slike — bilo da je reč o rešavanju operativnih izazova na terenu, dizajniranju softverske logike ili pisanju originalnih narativnih tekstova. U slobodno vreme inspiraciju pronalazim u strateškim i trkačkim (racing) igrama, uvek tražeći nove uglove za pristup kompleksnim problemima.',
    dedicationTitle: 'Posebna zahvalnost',
    dedicationText: 'Ovaj projekat nosi moje ime, ali iza njega stoji neizmerna podrška moje supruge Sanje. Hvala joj što je bila moj oslonac i vetar u leđa tokom svih neprospavanih noći koje sam balansirao između NIS-a, ispita na FTN-u i kucanja koda za LeanCortex, dok su naše dve devojčice spavale i sanjale u susednoj sobi.',
  },
  en: {
    pageTitle: 'About the Author',
    role: 'Mechanical Engineer, Innovator & Creator of LeanCortex',
    intro: "I'm Bojan Berežni, a Master's student in Engineering Management (module: Organization and Enterprise Management) at FTN Novi Sad and a Lead Well Testing Specialist at NIS. With over 11 years of experience in the oil and gas industry, managing large teams, and driving strategic business process optimization, my goal is to bridge engineering precision with modern digital solutions.",
    visionTitle: 'The Vision',
    visionText: 'I believe learning shouldn\'t be confined to dry theory. Through deep business analysis and hands-on Lean implementation, I realized that abstract industrial concepts are best absorbed through interaction. LeanCortex was born as my Master\'s thesis—an educational platform that visualizes waste, simulates production lines, and turns Industry 4.0 into a tangible, interactive experience.',
    skillsTitle: 'Multidisciplinary Approach',
    skillsText: 'My work sits at a unique intersection of industrial engineering, digital technologies, and creativity. Rather than focusing narrowly on individual tools, I believe in seeing the bigger picture—whether it\'s solving complex field operations, designing software logic, or creative storytelling. In my free time, I find inspiration in strategic and racing games, always seeking creative ways to approach challenges.',
    dedicationTitle: 'Special Thanks',
    dedicationText: 'While this project bears my name, it was built on the immense support of my wife, Sanja. Thank you for being my rock and for your unwavering patience through all the sleepless nights balanced between my job at NIS, Master\'s studies, and building LeanCortex, while our two little girls were dreaming in the next room.',
  },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <MainLayout>
      <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              {t.pageTitle}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-light">
              {t.role}
            </p>
          </header>

          {/* Intro */}
          <section className="mb-16">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t.intro}
            </p>
          </section>

          {/* Two-column grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Vision */}
            <section className="bg-card/50 rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                {t.visionTitle}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t.visionText}
              </p>
            </section>

            {/* Skills */}
            <section className="bg-card/50 rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                {t.skillsTitle}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t.skillsText}
              </p>
            </section>
          </div>

          {/* Dedication */}
          <hr className="border-border/30 mb-8" />
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t.dedicationTitle}
            </h2>
            <p className="text-lg italic text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.dedicationText}
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
