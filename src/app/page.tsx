"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Leaf, Star, Heart, ShieldCheck, Droplet } from "lucide-react";
import { useEffect, useRef } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import styles from "./page.module.css";

const benefits = ["Thoughtfully selected ingredients", "Made for everyday ritual", "A simple routine, visible glow"];
const reviews = [
  ["Yaar genuinely telling you, ye facewash meri routine ka best part ban gaya hai. Skin pe itna soft feel hota hai and bilkul tight nahi karta.", "Areeba K. — Beta Tester"],
  ["Niacinamide serum ne mere pores aur dark spots kaafi had tak kam kar diye hain. Glow itna natural hai ab! Highly recommended.", "Maham A. — Beta Tester"],
  ["Minimal, elegant and effective. The duo is now my little evening ritual. I feel like my skin is finally breathing.", "Hiba M. — Beta Tester"],
  ["Shuru m mujhe doubt tha, but one week m hi skin ki texture itni smooth ho gayi. I love how it doesn't strip my skin.", "Zainab R. — Beta Tester"],
  ["Ye duo magic hai! Face wash and serum combination ne skin brightening m kamal kar dia hai. Trust me guys, you need this.", "Sana Q. — Beta Tester"],
  ["Best investment for my skin! Itna gentle hai and glow foran notice hota hai. Beta testing k baad m toh regular customer ban gayi hun.", "Fatima S. — Beta Tester"],
];

export default function Home() {
  const { products, siteContent } = useStore();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(`.${styles.animateUp}`).forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return <div className={styles.main}>
    <section className={styles.hero} style={{ padding: 0, minHeight: 'auto', background: '#FFF9E6' }}>
      <HeroSlider />
    </section>

    <section className={styles.promiseContainer}>
      <div className={styles.promiseTrack}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={styles.promiseItem}>
            <p>{siteContent.announcement}</p><span /><p>Clean, considered skincare</p><span /><p>Luxury in every detail</p><span />
          </div>
        ))}
      </div>
    </section>

    <section id="shop" className={styles.collection}>
      <div className={styles.sectionIntro}><p className={styles.eyebrow}>A Love Letter for Your Skin</p><h2>Dear Skin, <span className={styles.mobileBreak}></span><em>You Deserve Better.</em></h2><p>Meet IBQA  –  because your barrier finally found its Bestie.</p></div>
      <div className={styles.productGrid}>{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '3rem' }}>
        <Link href="/shop" className={styles.outlineButton} style={{ padding: '1.2rem 2.5rem', fontSize: '0.85rem' }}>View all products <ArrowRight size={18} /></Link>
      </div>
    </section>

    <section id="our-story" className={styles.story}><div className={styles.storyContent}><p className={styles.eyebrow}>OUR STORY</p><h2>Every Beautiful Skin Begins With <em>Trust.</em></h2><p>IBQA was created with one simple belief: skincare should protect before it promises.<br /><br />Inspired by Korean skincare philosophy, we craft gentle, effective formulas using carefully selected ingredients that nourish, strengthen, and care for your skin. No unnecessary complexity. No empty claims. Just skincare designed to become part of your everyday ritual.<br /><br />Protection Before Perfection.<br /><br />Because true confidence begins with healthy skin.</p></div><div className={styles.storyImage}><Image src={"/images/Our story/ibqa-story-v2.webp"} alt="A calm, luxurious skincare ritual" fill /></div></section>

    <section id="ingredients" className={styles.editorialIngredients}>
      <div className={`${styles.editorialIntro} ${styles.animateUp}`}>
        <p className={styles.eyebrow}>The Science Behind Every Drop</p>
        <h2>Every ingredient is carefully selected for a reason—not because it's trending, but because your skin deserves <em>proven, gentle care</em> inspired by Korean skincare philosophy.</h2>
      </div>

      <div className={styles.editorialStack}>
        <article className={styles.editorialBlock}>
          <div className={`${styles.editorialImage} ${styles.animateUp}`}>
            <Image src="/images/ingredients/rice.webp" alt="Rice Extract" fill />
          </div>
          <div className={`${styles.editorialContent} ${styles.animateUp}`}>
            <h3>Rice Extract</h3>
            <div className={styles.badges}><span>Hydrates</span><span>•</span><span>Brightens</span><span>•</span><span>Soothes</span></div>
            <p>Known for comforting tired-looking skin while helping restore a naturally radiant glow.</p>
          </div>
        </article>

        <article className={`${styles.editorialBlock} ${styles.reverse}`}>
          <div className={`${styles.editorialImage} ${styles.animateUp}`}>
            <Image src="/images/ingredients/niacinamide.webp" alt="Niacinamide" fill />
          </div>
          <div className={`${styles.editorialContent} ${styles.animateUp}`}>
            <h3>Niacinamide</h3>
            <div className={styles.badges}><span>Brightens</span><span>•</span><span>Refines Pores</span><span>•</span><span>Strengthens Barrier</span></div>
            <p>A clinically loved ingredient that improves overall skin clarity while supporting the skin barrier.</p>
          </div>
        </article>

        <article className={styles.editorialBlock}>
          <div className={`${styles.editorialImage} ${styles.animateUp}`}>
            <Image src="/images/ingredients/hyaluronic.webp" alt="Hyaluronic Acid" fill />
          </div>
          <div className={`${styles.editorialContent} ${styles.animateUp}`}>
            <h3>Hyaluronic Acid</h3>
            <div className={styles.badges}><span>Deep Hydration</span><span>•</span><span>Plumps</span><span>•</span><span>Locks Moisture</span></div>
            <p>Provides lasting hydration for healthy, smooth and supple skin.</p>
          </div>
        </article>
      </div>

      <div className={`${styles.synergySection} ${styles.animateUp}`}>
        <p className={styles.eyebrow}>Why These Ingredients Work Together</p>
        <div className={styles.synergyFlow}>
          <span>Rice Extract</span>
          <ArrowDown size={16} />
          <em>Soothes</em>
          <ArrowDown size={16} />
          <span>Niacinamide</span>
          <ArrowDown size={16} />
          <em>Brightens</em>
          <ArrowDown size={16} />
          <span>Hyaluronic Acid</span>
          <ArrowDown size={16} />
          <em>Deep Hydration</em>
          <ArrowDown size={16} />
          <strong>Healthy Glow</strong>
        </div>
      </div>

      <div className={`${styles.trustGrid} ${styles.animateUp}`}>
        <div><Check size={24} /><span>Sulfate Free</span></div>
        <div><Check size={24} /><span>Paraben Free</span></div>
        <div><Heart size={24} /><span>Cruelty Free</span></div>
        <div><ShieldCheck size={24} /><span>Dermatologically Tested</span></div>
        <div><Droplet size={24} /><span>pH Balanced</span></div>
      </div>
    </section>

    <section id="results" className={styles.results}><div className={styles.sectionIntro}><p className={styles.eyebrow}>Your glow, revealed</p><h2>Real moments. <em>Beautiful results.</em></h2></div><BeforeAfterSlider beforeImage={siteContent.beforeImage || "/images/before-after/before.webp"} afterImage={siteContent.afterImage || "/images/before-after/after.webp"} /></section>

    <section className={styles.reviews}><p className={styles.eyebrow}>Loved in the ritual</p><div className={styles.reviewsContainer}><div className={styles.reviewGrid}>{[...reviews, ...reviews].map(([quote, name], i) => <blockquote key={i}><div>{[1, 2, 3, 4, 5].map(star => <Star key={star} size={13} fill="currentColor" />)}</div><p>“{quote}”</p><cite>{name}</cite></blockquote>)}</div></div></section>

    <section id="faq" className={styles.faq}><div><p className={styles.eyebrow}>Need to know</p><h2>Questions, <em>answered simply.</em></h2></div><div className={styles.faqList}><details open><summary>Are IBQA products suitable for daily use?</summary><p>Our core routine is designed to fit easily into a consistent morning and evening skincare ritual.</p></details><details><summary>How do I use the Brightening Duo?</summary><p>Cleanse first with the Rice Extract Face Wash, then apply two to three drops of the Niacinamide Serum.</p></details><details><summary>How long does delivery take?</summary><p>Orders are confirmed before dispatch. Delivery timings depend on your city and courier coverage.</p></details></div></section>
  </div>;
}
