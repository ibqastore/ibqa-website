"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import styles from './HeroSlider.module.css';

export default function HeroSlider() {
  const { siteContent } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = (siteContent.heroSlides && siteContent.heroSlides.length > 0)
    ? siteContent.heroSlides
    : [
        { id: "slide-1", pc: "/images/hero/facewash-hero-pc.PNG", mobile: "/images/hero/facewash-hero-mobile.PNG", title: "Rice Extract Face Wash" },
        { id: "slide-2", pc: "/images/hero/serum-facewash-pc.PNG", mobile: "/images/hero/facewash-serum-hero-mobile.PNG", title: "Brightening Duo" },
        { id: "slide-3", pc: "/images/hero/serum-hero-pc.PNG", mobile: "/images/hero/serum-hero-mobile.PNG", title: "Niacinamide Serum" }
      ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4500); // Change image automatically

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={styles.sliderContainer}>
      {slides.map((slide, index) => (
        <div 
          key={slide.id || index} 
          className={`${styles.slide} ${index === currentIndex ? styles.activeSlide : ''}`}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet={slide.mobile} />
            <img 
              src={slide.pc}
              alt={slide.title || "IBQA Skincare Hero"}
              className={styles.image}
            />
          </picture>
        </div>
      ))}

      {slides.length > 1 && (
        <div className={styles.dotsContainer}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
