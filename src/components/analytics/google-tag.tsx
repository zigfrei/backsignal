import Script from 'next/script';

type GoogleTagProps = {
  tagId: string;
};

export function GoogleTag({ tagId }: GoogleTagProps) {
  if (!/^GT-[A-Z0-9]+$/.test(tagId)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`}
        strategy='afterInteractive'
      />
      <Script id='google-tag' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(tagId)});
        `}
      </Script>
    </>
  );
}
