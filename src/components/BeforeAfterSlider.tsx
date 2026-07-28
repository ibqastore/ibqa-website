"use client";

import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import styles from './BeforeAfterSlider.module.css';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className={styles.container}>
      <img 
        src={afterImage} 
        alt="After" 
        className={`${styles.image} ${styles.afterImage}`} 
      />
      
      <div 
        className={styles.beforeContainer} 
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className={styles.image} 
        />
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className={styles.slider}
        aria-label="Compare before and after"
      />

      <div 
        className={styles.sliderLine} 
        style={{ left: `${sliderPosition}%` }}
      >
        <div className={styles.sliderButton}>
          <ArrowLeftRight size={20} />
        </div>
      </div>

      <div className={styles.labels}>
        <div className={styles.label}>Before</div>
        <div className={styles.label}>After</div>
      </div>
    </div>
  );
}
