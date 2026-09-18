import { Document, Font, Line, Page, Path, Svg, Text, View } from '@react-pdf/renderer';
import { printFormats, qrVector, type MaterialOptions } from '@/lib/qr-materials';
import QRCode from 'qrcode';
import { QrPrintLogo } from './qr-print-logo';

Font.register({ family: 'PrintInter', fonts: [
  { src: '/fonts/inter/Inter-Regular.woff', fontWeight: 400 },
  { src: '/fonts/inter/Inter-Bold.woff', fontWeight: 700 },
] });
Font.registerHyphenationCallback((word) => [word]);

export function QrMaterialDocument({ options }: { options: MaterialOptions }) {
  const [width, height] = printFormats[options.format];
  const mm = 72 / 25.4;
  const card = options.format === 'CARD';
  const scale = card ? 1 : width / 105;
  const vector = qrVector(QRCode.create(options.url, { errorCorrectionLevel: 'M' }).modules);
  if (options.format === 'PYRAMID') {
    const locale = options.locale ?? 'ru';
    // A4 landscape: 10 mm glue flap + three 90 × 190 mm faces.
    const left = 8.5;
    const top = 10;
    const panelWidth = 90;
    const panelHeight = 190;
    const flap = 10;
    return (
      <Document title={options.name} author='Backsignal'>
        <Page size={[width * mm, height * mm]} style={{ fontFamily: 'PrintInter', color: '#0F2D2E', backgroundColor: '#FFFFFF' }}>
          <View style={{ position: 'absolute', left: left * mm, top: top * mm, width: flap * mm, height: panelHeight * mm, backgroundColor: '#E6E9EB', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 7, transform: 'rotate(-90deg)', width: 110, textAlign: 'center', color: '#475569' }}>{locale === 'en' ? 'Glue flap' : 'Место склейки'}</Text>
          </View>
          {[0, 1, 2].map((index) => (
            <View key={index} style={{ position: 'absolute', left: (left + flap + index * panelWidth) * mm, top: top * mm, width: panelWidth * mm, height: panelHeight * mm, padding: 8 * mm, backgroundColor: '#F0FAF8', alignItems: 'center', justifyContent: 'space-between' }}>
              <QrPrintLogo locale={locale} width={45 * mm} />
              <View style={{ width: '100%', alignItems: 'center', gap: 6 * mm }}>
                <Text style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', maxLines: 3, textOverflow: 'ellipsis' }}>{options.name}</Text>
                <Text style={{ fontSize: 14, textAlign: 'center', maxLines: 5, textOverflow: 'ellipsis' }}>{options.prompt}</Text>
              </View>
              <View style={{ backgroundColor: '#FFFFFF', padding: 2 * mm }}>
                <Svg width={60 * mm} height={60 * mm} viewBox={`0 0 ${vector.size} ${vector.size}`}><Path d={vector.path} fill='#0F2D2E' /></Svg>
              </View>
              <Text style={{ fontSize: 10, textAlign: 'center', color: '#475569' }}>{options.caption}</Text>
            </View>
          ))}
          <Svg width={width * mm} height={height * mm} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', left: 0, top: 0 }}>
            <Path d={`M${left},${top}H${left + flap + 3 * panelWidth}V${top + panelHeight}H${left}Z`} fill='none' stroke='#94A3B8' strokeWidth={0.2} />
            {[0, 1, 2].map((index) => <Line key={index} x1={left + flap + index * panelWidth} y1={top} x2={left + flap + index * panelWidth} y2={top + panelHeight} stroke='#94A3B8' strokeWidth={0.2} strokeDasharray='2 2' />)}
          </Svg>
        </Page>
      </Document>
    );
  }
  const qrSize = (card ? 36 : 56 * scale) * mm;
  const qr = <Svg width={qrSize} height={qrSize} viewBox={`0 0 ${vector.size} ${vector.size}`}><Path d={vector.path} fill='#0F2D2E' /></Svg>;
  return (
    <Document title={options.name} author='Backsignal'>
      <Page size={[width * mm, height * mm]} style={{ fontFamily: 'PrintInter', color: '#0F2D2E', backgroundColor: '#FFFFFF', padding: (card ? 4 : 8 * scale) * mm, flexDirection: card ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: card ? 44 * mm : '100%', alignItems: card ? 'flex-start' : 'center', gap: (card ? 2 : 3 * scale) * mm }}>
          <QrPrintLogo locale={options.locale ?? 'ru'} width={(card ? 24 : 36 * scale) * mm} />
          <Text style={{ fontSize: (card ? 10 : 17 * scale), fontWeight: 700, textAlign: card ? 'left' : 'center', maxLines: card ? 2 : 3, textOverflow: 'ellipsis' }}>{options.name}</Text>
          <Text style={{ fontSize: (card ? 7 : 11 * scale), textAlign: card ? 'left' : 'center', maxLines: card ? 3 : 4, textOverflow: 'ellipsis' }}>{options.prompt}</Text>
          {card && <Text style={{ fontSize: 6, color: '#475569' }}>{options.caption}</Text>}
        </View>
        {qr}
        {!card && <Text style={{ fontSize: 10 * scale, color: '#475569', textAlign: 'center' }}>{options.caption}</Text>}
      </Page>
    </Document>
  );
}
