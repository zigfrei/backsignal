// import BeforeAndAfter from '@/components/sections/main/before-after';
import FAQ from '@/components/sections/main/faq';
// import { faqItems } from '@/lib/faq';
import Hero from '@/components/sections/main/hero';
import ForWhat from '@/components/sections/main/for-what';
// import Numbers from '@/components/sections/main/numbers';
// import Partners from "@/components/sections/main/partners";
// import Scope from '@/components/sections/main/scope';
// import Cards from '@/components/sections/main/cards';
// import Documents from '@/components/sections/main/documents';
// import B2B from '@/components/sections/main/b2b';
// import Quiz from '@/components/sections/main/quiz';
import UIKIT from '@/components/sections/ui-kit/main';
import type { Metadata } from 'next';
import HowItWorks from '@/components/sections/main/how-it-works';
import CTA from '@/components/sections/main/cta';
import Feedback from '@/components/sections/main/feedback';

const title = 'Обратный сигнал — сервис обратной связи с клиентами';
const description =
  'Получайте обратную связь от клиентов напрямую. Создайте страницу компании, разместите QR-код и узнавайте о замечаниях, предложениях и проблемах без публичных отзывов.';
const openGraphDescription =
  'Получайте обратную связь от клиентов напрямую. Создайте страницу компании, разместите QR-код и узнавайте о замечаниях, предложениях и проблемах без публичных отзывов.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description: openGraphDescription,
    url: 'https://backsignal.tech',
    siteName: 'Обратный сигнал',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Обратный сигнал',
      },
    ],
  },
};

export default function Home() {
  // const faqSchema = {
  //   '@context': 'https://schema.org',
  //   '@type': 'FAQPage',
  //   mainEntity: faqItems.map((item) => ({
  //     '@type': 'Question',
  //     name: item.question,
  //     acceptedAnswer: {
  //       '@type': 'Answer',
  //       text: item.answer,
  //     },
  //   })),
  // };

  // const OrganizationSchema = {
  //   '@context': 'https://schema.org',
  //   '@type': 'Organization',
  //   name: 'Общество с ограниченной ответственностью "ПроффХим"',
  //   alternateName: 'ПроффХим, Профф',
  //   url: 'https://proffhim.by',
  //   logo: 'https://proffhim.by/logo.png',
  //   contactPoint: [
  //     {
  //       '@type': 'ContactPoint',
  //       telephone: '+375296729520',
  //       email: 'proffhimsale@mail.ru',
  //       contactType: 'sales',
  //       areaServed: ['BY', 'RU'],
  //       availableLanguage: 'Russian',
  //     },
  //   ],
  //   sameAs: [
  //     'https://www.instagram.com/proffhim.by/',
  //     'https://vk.com/public182349785',
  //   ],
  //   address: {
  //     '@type': 'PostalAddress',
  //     streetAddress: 'д. Подлипки, строение 7',
  //     addressLocality: 'Гродненский район, Одельский сельсовет',
  //     addressRegion: 'Гродненская область',
  //     postalCode: '231731',
  //     addressCountry: 'BY',
  //   },
  //   areaServed: [
  //     {
  //       '@type': 'Country',
  //       name: 'BY',
  //     },
  //     {
  //       '@type': 'Country',
  //       name: 'RU',
  //     },
  //     {
  //       '@type': 'Country',
  //       name: 'KZ',
  //     },
  //   ],
  // };

  return (
    <>
      {/* <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, OrganizationSchema]).replace(
            /</g,
            '\\u003c',
          ),
        }}
      /> */}
      <main className='flex flex-col items-center justify-center w-full pt-20'>
        <Hero />
        <ForWhat />
        <HowItWorks />
        <CTA />
        <FAQ />
        <Feedback />

        {/* <UIKIT /> */}
        {/* 
        <Numbers />
        <Scope />
        <Documents />
        <Quiz /> */}
        {/* <Partners /> */}
        {/* <BeforeAndAfter />
        <Cards />
        <B2B />
        
         */}
      </main>
    </>
  );
}
