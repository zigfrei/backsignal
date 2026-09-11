'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactifiedModule } from '@yandex/ymaps3-types/reactify/reactify';
import { LOCATION } from '@/features/map/variables';
import MapPointer from '@/assets/icons/map-pointer.svg';
import mapPointer from '@/assets/icons/map-pointer.svg';
import type { YMapLocationRequest } from '@yandex/ymaps3-types';
import { YMapDefaultSchemeLayerProps } from '@yandex/ymaps3-types';
import { m } from 'motion/react';

type ReactifiedApi = ReactifiedModule<typeof ymaps3>;
export type MapProps = {
  customization?: YMapDefaultSchemeLayerProps['customization'];
};

const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';
const YANDEX_MAPS_SCRIPT_ID = 'yandex-maps-v3-script';
const YANDEX_MAPS_SCRIPT_SRC = `https://api-maps.yandex.ru/v3/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;

const getYmaps3Api = () =>
  (window as Window & { ymaps3?: typeof ymaps3 }).ymaps3;

const loadYandexMapsScript = () => {
  const existingApi = getYmaps3Api();

  if (!YANDEX_MAPS_API_KEY) {
    return Promise.reject(new Error('Yandex Maps API key is not configured.'));
  }

  if (existingApi) {
    return Promise.resolve(existingApi);
  }

  return new Promise<typeof ymaps3>((resolve, reject) => {
    const existingScript = document.getElementById(
      YANDEX_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    const handleLoad = () => {
      const loadedApi = getYmaps3Api();

      if (!loadedApi) {
        reject(new Error('Yandex Maps API loaded, but ymaps3 is unavailable.'));
        return;
      }

      resolve(loadedApi);
    };

    const handleError = () => {
      reject(new Error('Failed to load Yandex Maps API script.'));
    };

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = YANDEX_MAPS_SCRIPT_ID;
    script.src = YANDEX_MAPS_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.head.append(script);
  });
};

const Map = ({ customization }: MapProps) => {
  const [reactifiedApi, setReactifiedApi] = React.useState<ReactifiedApi>();
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        const ymaps3Api = await loadYandexMapsScript();
        const [{ reactify }] = await Promise.all([
          ymaps3Api.import('@yandex/ymaps3-reactify'),
          ymaps3Api.ready,
        ]);

        if (!isMounted) {
          return;
        }

        setReactifiedApi(reactify.bindTo(React, ReactDOM).module(ymaps3Api));
      } catch {
        if (!isMounted) {
          return;
        }

        setLoadError(
          'Не удалось загрузить карту. Попробуйте обновить страницу.',
        );
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadError) {
    return (
      <div className='w-full h-full typo-h5 base-frame-big px-8 py-6 text-center'>
        {loadError}
      </div>
    );
  }

  if (!reactifiedApi) {
    return <div className='w-full h-full base-frame-big' />;
  }

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } =
    reactifiedApi;

  const getMarkerCoordinates = (
    location: YMapLocationRequest,
  ): [number, number] => {
    if ('center' in location && location.center) {
      const [lng, lat] = location.center;
      return [lng, lat];
    }

    throw new Error('Map location must include center coordinates.');
  };

  return (
    <div className='w-full h-[400px] lg:h-full flex base-frame-big overflow-hidden relative'>
      <YMap location={LOCATION} className='w-full h-[400px] lg:h-full '>
        <YMapDefaultSchemeLayer customization={customization} />
        <YMapDefaultFeaturesLayer />
        <YMapMarker coordinates={getMarkerCoordinates(LOCATION)} zIndex={1000}>
          <div className='-translate-x-1/2 -translate-y-full flex flex-col items-center'>
            <div className='mb-1 bg-base-white px-3 border-[2px]! py-1 base-frame whitespace-nowrap'>
              <p className='typo-h5 text-center'>ПроффХим</p>
            </div>
            <img 
              src='/map-point.png'
              alt='Map marker'
              width={40}
              height={40}
              className='block'
            />
          </div>
        </YMapMarker>
      </YMap>
      <a
        href={`https://yandex.com/maps/?rtext=~${getMarkerCoordinates(LOCATION)[1]},${getMarkerCoordinates(LOCATION)[0]}&rtt=auto`}
        target='_blank'
        rel='noopener noreferrer'
        className='absolute top-2 left-2 typo-h6 bg-base-white px-3 py-1 base-frame lg:base-frame-interactive'
      >
        проложить маршрут
      </a>
    </div>
  );
};

export default Map;
