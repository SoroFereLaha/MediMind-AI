'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';


interface AppDownloadPopupProps {
  triggerHoverCount?: number; // number of hovers on any button to trigger
  scrollDelayMs?: number;     // delay after scroll in ms
  autoHideMs?: number;        // optional auto hide
}

// Images placed in public/img/mobile-app/
const carouselImages = [
  '/img/mobile-app/screen1.png',
  '/img/mobile-app/screen2.png',
  '/img/mobile-app/screen3.png',
  '/img/mobile-app/screen4.png',
  '/img/mobile-app/screen5.png',
  '/img/mobile-app/screen7.png',
  '/img/mobile-app/screen8.png',
];

export function AppDownloadPopup({ triggerHoverCount = 5, scrollDelayMs = 10000, autoHideMs }: AppDownloadPopupProps) {
  const [open, setOpen] = useState(false);
  const hoverCounter = useRef(0);
  const [current, setCurrent] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const textSlides: React.ReactNode[] = [
    <h3 key="title" className="font-semibold text-base">Découvrez l&apos;application mobile MediMind IA</h3>,
    <p key="desc" className="text-sm text-muted-foreground">Consultez vos dossiers, suivez vos conseils personnalisés et plus encore — partout, tout le temps.</p>,
    <a key="badge" href="#" className="block w-32"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Télécharger sur l'App Store" className="w-full h-auto" /></a>,
  ];

  // Auto-play carousel
  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % carouselImages.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [open]);

  // Text carousel auto play (slower)
  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        setCurrentText((prev) => (prev + 1) % textSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [open]);

  // --- Trigger by scroll + delay
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (open) return;
      if (window.scrollY > 200) {
        if (!timer) {
          timer = setTimeout(() => setOpen(true), scrollDelayMs);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, [open, scrollDelayMs]);

  // --- Trigger by hovers on any <button>
  useEffect(() => {
    if (open) return;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button') {
        hoverCounter.current += 1;
        if (hoverCounter.current >= triggerHoverCount) {
          setOpen(true);
        }
      }
    };
    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [open, triggerHoverCount]);

  // auto hide
  useEffect(() => {
    if (open && autoHideMs) {
      const id = setTimeout(() => setOpen(false), autoHideMs);
      return () => clearTimeout(id);
    }
  }, [open, autoHideMs]);

  

  return (
    <Dialog open={open} onOpenChange={setOpen}> 
      <DialogContent className="p-4 max-w-lg">
        <DialogTitle className="sr-only">Promotion application mobile MediMind IA</DialogTitle>
        <div className="flex items-center gap-4">
          <div className="relative m-0 w-full max-w-[200px]">
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-transparent aspect-[9/19.5]">
              {carouselImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Capture d'écran ${index + 1}`}
                  fill
                  sizes="100vw"
                  className={`object-contain transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 text-left">{textSlides[currentText]}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
