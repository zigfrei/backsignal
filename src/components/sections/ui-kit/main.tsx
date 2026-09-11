import SectionBlock from '@/components/ui/section';
import { BigLinkButton, GhostLinkButton, LinkButton, TextLink } from '@/components/ui/links';
import { BigButton, Button, GhostButton } from '@/components/ui/buttons';

export default function UIKIT() {
  return (
    <SectionBlock>
      <div className='z-10 w-full flex-1 flex flex-col items-start justify-center gap-4'>
        <h1 className='typo-h1 text-base-black'>UI KIT</h1>
        <h2 className='typo-h2 text-base-black underline'>Тексты</h2>
        <div className='flex flex-col items-start justify-center gap-4'>
          <p className='typo-h1 text-base-black'>H1</p>
          <p className='typo-h2 text-base-black'>H2</p>
          <p className='typo-h3 text-base-black'>H3</p>
          <p className='typo-h4 text-base-black'>H4</p>
          <p className='typo-h5 text-base-black'>H5</p>
          <p className='typo-body text-base-black'>Body</p>
          <p className='typo-caption text-base-black'>Caption</p>
        </div>
        <h2 className='typo-h2 text-base-black underline'>Кнопки</h2>
        <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Button</p>
          <Button>Попробывать бесплатно</Button>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Check anchor</p>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Ghost Button</p>
          <GhostButton>Попробывать бесплатно</GhostButton>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Big Button</p>
          <BigButton>Попробывать бесплатно</BigButton>
        </div>
        <h2 className='typo-h2 text-base-black underline'>Ссылки</h2>
        <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Link Button</p>
          <LinkButton href='#'>Попробывать бесплатно</LinkButton>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Ghost Link Button</p>
          <GhostLinkButton href='#'>Попробывать бесплатно</GhostLinkButton>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Link Button Big</p>
          <BigLinkButton href='#'>Попробывать бесплатно</BigLinkButton>
        </div>

                <div className='flex items-center justify-center gap-4'>
          <p className='typo-caption'>Text Link</p>
          <TextLink href='#'>Попробывать бесплатно</TextLink>
        </div>
      </div>
    </SectionBlock>
  );
}
