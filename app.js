/* ═══════════════════════════════════════════
   REDWOOD REAL ESTATE SOLUTIONS — SPA
   Router + Pages + Motion
   ═══════════════════════════════════════════ */

(function () {
  const app = document.getElementById('app');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // ── NAV SCROLL ──
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  });

  // ── MOBILE MENU ──
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('nav__toggle--open');
    navLinks.classList.toggle('nav__links--open');
    document.body.style.overflow = navLinks.classList.contains('nav__links--open') ? 'hidden' : '';
  });

  function closeMenu() {
    navToggle.classList.remove('nav__toggle--open');
    navLinks.classList.remove('nav__links--open');
    document.body.style.overflow = '';
  }

  // ── ROUTER ──
  function getRoute() {
    return window.location.hash.slice(1) || '/';
  }

  function navigate() {
    closeMenu();
    const route = getRoute();
    const page = routes[route] || routes['/'];
    app.innerHTML = '';
    app.className = 'page-transition';
    app.innerHTML = page();
    window.scrollTo(0, 0);
    updateActiveLink(route);
    initScrollReveal();
    initFAQ();
    initParallax();
    initCountUp();
    initContactForm();
  }

  function updateActiveLink(route) {
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + route || (route === '/' && href === '#/')) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  window.addEventListener('hashchange', navigate);
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
      closeMenu();
    }
  });

  // ── SCROLL REVEAL ──
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale').forEach(el => {
      observer.observe(el);
    });
  }

  // ── PARALLAX ──
  function initParallax() {
    const heroEl = document.querySelector('.hero__carousel, .page-hero__bg');
    if (!heroEl) return;
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroEl.style.transform = `translateY(${scrollY * 0.25}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll);
  }

  // ── COUNT UP ──
  function initCountUp() {
    const counters = document.querySelectorAll('.stats__number[data-count]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = prefix + Math.round(current) + suffix;
          }, 20);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  // ── FAQ ACCORDION ──
  function initFAQ() {
    document.querySelectorAll('.faq-item__question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('faq-item--open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('faq-item--open'));
        if (!wasOpen) item.classList.add('faq-item--open');
      });
    });
  }

  // ── HERO CAROUSEL ──
  let carouselTimer = null;
  function initHeroCarousel() {
    if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    const slides = carousel.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    if (slides.length < 2) return;

    let current = 0;

    function goTo(index) {
      const outgoing = current;
      // fade out old slide but keep its zoom state
      slides[outgoing].classList.remove('hero__slide--active');
      dots[outgoing].classList.remove('hero__dot--active');
      // after fade-out completes, reset zoom while invisible
      setTimeout(() => {
        slides[outgoing].classList.remove('hero__slide--kenburns');
      }, 2000);

      current = index;
      // reset scale instantly before starting zoom
      slides[current].classList.remove('hero__slide--kenburns');
      slides[current].querySelector('img').offsetHeight; // reflow
      // show slide and start zoom
      slides[current].classList.add('hero__slide--active');
      dots[current].classList.add('hero__dot--active');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          slides[current].classList.add('hero__slide--kenburns');
        });
      });
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.slide);
        if (idx === current) return;
        goTo(idx);
        clearInterval(carouselTimer);
        carouselTimer = setInterval(next, 6000);
      });
    });

    // kick off Ken Burns on initial slide
    requestAnimationFrame(() => {
      slides[0].classList.add('hero__slide--kenburns');
    });

    carouselTimer = setInterval(next, 6000);
  }

  // ── CONTACT FORM ──
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      btn.textContent = 'Message Sent!';
      btn.style.background = 'var(--green-500)';
      setTimeout(() => {
        btn.innerHTML = 'Send Message <span class="btn__arrow">→</span>';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // ── SVG ICONS ──
  const icons = {
    home: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
    key: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
    chart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    shield: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    map: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>',
    mail: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    clock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
    heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    star: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
    handshake: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 17a1 1 0 001 1h1a1 1 0 001-1v0a1 1 0 00-1-1h-1a1 1 0 00-1 1z"/><path d="M2 9h4l3.5-3.5a2 2 0 012.83 0L14 7h2"/><path d="M22 9h-4l-1-1"/><path d="M2 9v7a2 2 0 002 2h3"/><path d="M22 9v7a2 2 0 01-2 2h-3"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    arrowLeft: '←',
    arrowRight: '→',
  };

  // ══════════════════════════════════
  //  PAGES
  // ══════════════════════════════════

  // ── HOME ──
  function homePage() {
    return `
    <!-- HERO -->
    <section class="hero">
      <div class="hero__carousel" id="heroCarousel">
        <div class="hero__slide hero__slide--active">
          <img src="images/hero-1.jpg" alt="Sonoma Valley vineyards and oak-studded hills at golden hour" loading="eager" />
        </div>
        <div class="hero__slide">
          <img src="images/hero-2.jpg" alt="Residential street in Santa Rosa with craftsman homes and mature oaks" loading="eager" />
        </div>
        <div class="hero__slide">
          <img src="images/hero-3.jpg" alt="Luxury modern farmhouse estate in Sonoma County wine country" loading="eager" />
        </div>
        <div class="hero__slide">
          <img src="images/hero-4.jpg" alt="Skyhawk subdivision neighborhood in Santa Rosa with hillside views" loading="eager" />
        </div>
      </div>
      <div class="hero__overlay"></div>
      <div class="hero__content">
        <div class="hero__badge reveal">Sonoma County's Trusted Realtor</div>
        <h1 class="reveal reveal--delay-1">Your Home Journey <em>Starts Here</em></h1>
        <p class="hero__sub reveal reveal--delay-2">Full-service residential real estate rooted in Northern California. Whether you're buying your first home or selling to start a new chapter, I'm here to guide every step.</p>
        <div class="hero__actions reveal reveal--delay-3">
          <a href="#/contact" data-link class="btn btn--primary">Schedule a Consultation <span class="btn__arrow">→</span></a>
          <a href="#/contact" data-link class="btn btn--outline">Get a Home Valuation <span class="btn__arrow">→</span></a>
        </div>
      </div>
      <div class="hero__indicators">
        <button class="hero__dot hero__dot--active" data-slide="0" aria-label="Slide 1"></button>
        <button class="hero__dot" data-slide="1" aria-label="Slide 2"></button>
        <button class="hero__dot" data-slide="2" aria-label="Slide 3"></button>
        <button class="hero__dot" data-slide="3" aria-label="Slide 4"></button>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="section">
      <div class="section__inner">
        <div class="section__header section__header--center reveal">
          <span class="section__label">What I Do</span>
          <h2>Full-Service <span class="text-accent">Real Estate</span></h2>
          <p class="section__subtitle">From first-time buyers to seasoned sellers, I provide personalized guidance through every phase of your real estate journey in Sonoma County and beyond.</p>
        </div>
        <div class="services-grid">
          <div class="service-card reveal reveal--delay-1">
            <div class="service-card__img">
              <img src="images/service-buyers.jpg" alt="Modern kitchen in a Northern California home" loading="lazy" />
            </div>
            <div class="service-card__body">
              <h3 class="service-card__title">Buyer Representation</h3>
              <p class="service-card__text">Find the home that fits your life. I'll guide you through every step — from search to offer to keys in hand — with the local insight that makes the difference.</p>
              <a href="#/contact" data-link class="service-card__link">Start Your Search <span>→</span></a>
            </div>
          </div>
          <div class="service-card reveal reveal--delay-2">
            <div class="service-card__img">
              <img src="images/service-sellers.jpg" alt="Beautiful Sonoma County home for sale" loading="lazy" />
            </div>
            <div class="service-card__body">
              <h3 class="service-card__title">Seller Representation</h3>
              <p class="service-card__text">Maximize your home's value with strategic pricing, professional marketing, and expert negotiation. I'll position your property to attract the right buyers at the right price.</p>
              <a href="#/contact" data-link class="service-card__link">List Your Home <span>→</span></a>
            </div>
          </div>
          <div class="service-card reveal reveal--delay-3">
            <div class="service-card__img">
              <img src="images/service-valuation.jpg" alt="Sonoma County vineyard estate property" loading="lazy" />
            </div>
            <div class="service-card__body">
              <h3 class="service-card__title">Home Valuations</h3>
              <p class="service-card__text">Curious what your property is worth? Get a comprehensive market analysis backed by local expertise and real-time data from the Sonoma County market.</p>
              <a href="#/contact" data-link class="service-card__link">Get Your Valuation <span>→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="section" style="background: var(--cream);">
      <div class="section__inner">
        <div class="section__header reveal">
          <span class="section__label">Why Work With Me</span>
          <h2>Real Estate Done <span class="text-accent">Differently</span></h2>
          <p class="section__subtitle">I believe in building relationships, not just closing transactions. Here's what sets my approach apart.</p>
        </div>
        <div class="why-grid">
          <div class="why-card reveal reveal--delay-1">
            <div class="why-card__icon">${icons.map}</div>
            <div>
              <h4 class="why-card__title">Deep Local Knowledge</h4>
              <p class="why-card__text">Born and raised in Northern California. I know every neighborhood, every market nuance, and every hidden gem in Sonoma County and the surrounding areas.</p>
            </div>
          </div>
          <div class="why-card reveal reveal--delay-2">
            <div class="why-card__icon">${icons.key}</div>
            <div>
              <h4 class="why-card__title">Non-Traditional Transactions</h4>
              <p class="why-card__text">Not every deal fits a conventional mold. I specialize in creative financing strategies — loan assumptions, wrap-around mortgages (subject-to), seller financing, lease options, and land contracts — giving my clients more paths to close.</p>
            </div>
          </div>
          <div class="why-card reveal reveal--delay-3">
            <div class="why-card__icon">${icons.chart}</div>
            <div>
              <h4 class="why-card__title">Market-Driven Strategy</h4>
              <p class="why-card__text">Data and intuition working together. I use real-time market analysis to price strategically, negotiate effectively, and time the market to your advantage.</p>
            </div>
          </div>
          <div class="why-card reveal reveal--delay-4">
            <div class="why-card__icon">${icons.heart}</div>
            <div>
              <h4 class="why-card__title">Client-First Philosophy</h4>
              <p class="why-card__text">Your goals are my goals. Whether that means finding the perfect family home or getting top dollar on a sale, every decision I make is in your best interest.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AREAS SERVED -->
    <section class="section">
      <div class="section__inner">
        <div class="section__header section__header--center reveal">
          <span class="section__label">Areas I Serve</span>
          <h2>Northern California <span class="text-accent">Coverage</span></h2>
          <p class="section__subtitle">Based in Sonoma County, serving buyers and sellers across Northern California's most desirable communities.</p>
        </div>
        <div class="areas-grid reveal">
          ${['Santa Rosa', 'Petaluma', 'Healdsburg', 'Windsor', 'Sebastopol', 'Rohnert Park', 'Cotati', 'Sonoma', 'Cloverdale', 'Guerneville', 'Novato', 'San Rafael', 'Napa', 'American Canyon', 'Ukiah', 'Lakeport'].map(a => `<div class="area-tag">${a}</div>`).join('')}
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section testimonials">
      <div class="section__inner">
        <div class="section__header section__header--center reveal">
          <span class="section__label" style="color: var(--green-300);">Client Stories</span>
          <h2 style="color: var(--white);">What My Clients <span style="color: var(--green-300);"><em>Say</em></span></h2>
          <p class="section__subtitle" style="color: rgba(255,255,255,0.6);">Every transaction is a relationship. Here's what people say about working with Redwood Real Estate.</p>
        </div>
        <div class="testimonials-slider">
          <div class="testimonial-card reveal reveal--delay-1">
            <div class="testimonial-card__stars">★★★★★</div>
            <p class="testimonial-card__text">"Patrick made our first home purchase feel effortless. His knowledge of the Sonoma County market was invaluable, and he found us a home we didn't even know we were looking for."</p>
            <div class="testimonial-card__author">Sarah & James T.</div>
            <div class="testimonial-card__role">First-Time Buyers, Santa Rosa</div>
          </div>
          <div class="testimonial-card reveal reveal--delay-2">
            <div class="testimonial-card__stars">★★★★★</div>
            <p class="testimonial-card__text">"We listed with Patrick and had multiple offers within the first weekend. His staging advice and marketing strategy got us $40K over asking price. Couldn't be happier."</p>
            <div class="testimonial-card__author">Michael R.</div>
            <div class="testimonial-card__role">Home Seller, Petaluma</div>
          </div>
          <div class="testimonial-card reveal reveal--delay-3">
            <div class="testimonial-card__stars">★★★★★</div>
            <p class="testimonial-card__text">"What sets Patrick apart is his honesty. He talked us out of overpaying on two properties before helping us find the perfect one. That's the kind of realtor you want in your corner."</p>
            <div class="testimonial-card__author">Lisa & David K.</div>
            <div class="testimonial-card__role">Buyers, Healdsburg</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="section__inner">
        <div class="cta-banner reveal--scale">
          <h2>Ready to Make Your Move?</h2>
          <p>Whether you're buying, selling, or just curious about the market, let's start a conversation. No pressure, just honest guidance.</p>
          <a href="#/contact" data-link class="btn btn--primary">Let's Talk <span class="btn__arrow">→</span></a>
        </div>
      </div>
    </section>
    `;
  }

  // ── ABOUT ──
  function aboutPage() {
    return `
    <section class="page-hero about-hero">
      <div class="page-hero__bg">
        <img src="images/hero-about.jpg" alt="Modern craftsman home surrounded by redwood trees" loading="eager" />
      </div>
      <div class="page-hero__overlay"></div>
      <div class="page-hero__content">
        <span class="hero__badge reveal">About Me</span>
        <h1 class="reveal reveal--delay-1">Meet Patrick <em>Mahoney</em></h1>
        <p class="page-hero__sub reveal reveal--delay-2">Licensed California Realtor. Sonoma County native. Dedicated to helping you navigate one of life's biggest decisions with confidence.</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="about-intro">
          <div class="about-intro__img reveal--left">
            <img src="images/patrick-headshot.jpg" alt="Patrick Mahoney — Licensed California Realtor" />
            <div class="about-intro__badge">DRE# 02209290</div>
          </div>
          <div class="reveal--right">
            <span class="section__label">My Story</span>
            <h2>Rooted in <span class="text-accent">Sonoma County</span></h2>
            <p style="margin-top: 20px; color: var(--gray-600); line-height: 1.85; font-size: 1.05rem;">
              Real estate isn't just my career — it's my calling. Growing up in Northern California, I developed a deep appreciation for the communities, landscapes, and neighborhoods that make this region unlike anywhere else.
            </p>
            <p style="margin-top: 16px; color: var(--gray-600); line-height: 1.85; font-size: 1.05rem;">
              I founded Redwood Real Estate with a simple philosophy: every client deserves the same level of dedication, transparency, and expertise — whether you're buying your first condo or selling a vineyard estate.
            </p>
            <p style="margin-top: 16px; color: var(--gray-600); line-height: 1.85; font-size: 1.05rem;">
              With years of experience across Sonoma, Marin, Napa, and Mendocino counties, I bring a level of local market knowledge that only comes from truly knowing the land. My clients don't just get a realtor — they get a trusted advisor who's invested in their success long after closing day.
            </p>
            <p style="margin-top: 16px; color: var(--gray-600); line-height: 1.85; font-size: 1.05rem;">
              What truly sets me apart is my deep knowledge of non-traditional and creative financing strategies. In today's market, conventional isn't always the best path. I specialize in structuring deals using loan assumptions, wrap-around mortgages (subject-to), seller financing, lease options, land contracts, and other creative approaches that open doors traditional financing can't. Whether a buyer needs an alternative path to homeownership or a seller wants to maximize their return through flexible terms, I have the expertise to make it happen.
            </p>
            <div style="margin-top: 32px;">
              <a href="#/contact" data-link class="btn btn--dark">Work With Me <span class="btn__arrow">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--cream);">
      <div class="section__inner">
        <div class="section__header section__header--center reveal">
          <span class="section__label">My Values</span>
          <h2>What I <span class="text-accent">Stand For</span></h2>
        </div>
        <div class="about-values">
          <div class="about-value reveal reveal--delay-1">
            <div class="about-value__icon">${icons.shield}</div>
            <h4 class="about-value__title">Integrity First</h4>
            <p class="about-value__text">Honest advice, even when it's not what you want to hear. I'll always tell you the truth about a property, a price, or a market condition — because trust is everything.</p>
          </div>
          <div class="about-value reveal reveal--delay-2">
            <div class="about-value__icon">${icons.heart}</div>
            <h4 class="about-value__title">Client-Centered</h4>
            <p class="about-value__text">Your timeline, your goals, your comfort level. I adapt my approach to fit your needs — not the other way around. Every client is unique, and my service reflects that.</p>
          </div>
          <div class="about-value reveal reveal--delay-3">
            <div class="about-value__icon">${icons.star}</div>
            <h4 class="about-value__title">Excellence in Execution</h4>
            <p class="about-value__text">From market analysis to negotiation to closing, every detail matters. I bring precision and professionalism to every transaction, ensuring nothing falls through the cracks.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="cta-banner reveal--scale">
          <h2>Let's Start a Conversation</h2>
          <p>Whether you're ready to move or just exploring your options, I'm here to help you make informed decisions about your real estate future.</p>
          <a href="#/contact" data-link class="btn btn--primary">Schedule a Consultation <span class="btn__arrow">→</span></a>
        </div>
      </div>
    </section>
    `;
  }

  // ── BLOG ──
  function blogPage() {
    return `
    <section class="page-hero">
      <div class="page-hero__bg">
        <img src="images/hero-blog.jpg" alt="Panoramic view of Santa Rosa California" loading="eager" />
      </div>
      <div class="page-hero__overlay"></div>
      <div class="page-hero__content">
        <span class="hero__badge reveal">Insights & Updates</span>
        <h1 class="reveal reveal--delay-1">The Redwood <em>Blog</em></h1>
        <p class="page-hero__sub reveal reveal--delay-2">Market trends, local insights, and real estate advice for Sonoma County and Northern California.</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="blog-grid">
          <div class="blog-card reveal reveal--delay-1" onclick="window.location.hash='#/blog/sonoma-market-2026'">
            <div class="blog-card__img">
              <img src="images/hero-home.jpg" alt="Sonoma County landscape" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Market Trends</span>
              <h3 class="blog-card__title">Sonoma County Real Estate Market: Mid-2026 Update</h3>
              <p class="blog-card__excerpt">An in-depth look at current pricing trends, inventory levels, and what buyers and sellers should expect in the second half of 2026.</p>
              <span class="blog-card__meta">May 1, 2026 · 6 min read</span>
            </div>
          </div>
          <div class="blog-card reveal reveal--delay-2" onclick="window.location.hash='#/blog/best-neighborhoods-santa-rosa'">
            <div class="blog-card__img">
              <img src="images/hero-blog.jpg" alt="Santa Rosa neighborhoods" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Local Guide</span>
              <h3 class="blog-card__title">The Best Neighborhoods in Santa Rosa for Families</h3>
              <p class="blog-card__excerpt">From top-rated schools to park access and community feel, here are the neighborhoods where families are thriving in Santa Rosa.</p>
              <span class="blog-card__meta">April 18, 2026 · 8 min read</span>
            </div>
          </div>
          <div class="blog-card reveal reveal--delay-3" onclick="window.location.hash='#/blog/first-time-buyer-guide'">
            <div class="blog-card__img">
              <img src="images/service-buyers.jpg" alt="Home interior" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Buyer Tips</span>
              <h3 class="blog-card__title">First-Time Home Buyer's Guide to Sonoma County</h3>
              <p class="blog-card__excerpt">Everything you need to know about buying your first home in Sonoma County — from pre-approval to closing day, with local-specific advice.</p>
              <span class="blog-card__meta">April 5, 2026 · 10 min read</span>
            </div>
          </div>
          <div class="blog-card reveal reveal--delay-1" onclick="window.location.hash='#/blog/wine-country-living'">
            <div class="blog-card__img">
              <img src="images/service-valuation.jpg" alt="Sonoma County vineyard" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Lifestyle</span>
              <h3 class="blog-card__title">Wine Country Living: What to Know Before You Move</h3>
              <p class="blog-card__excerpt">Thinking about relocating to Sonoma County? Here's an honest look at what life is really like in Northern California wine country.</p>
              <span class="blog-card__meta">March 22, 2026 · 7 min read</span>
            </div>
          </div>
          <div class="blog-card reveal reveal--delay-2" onclick="window.location.hash='#/blog/selling-tips-2026'">
            <div class="blog-card__img">
              <img src="images/service-sellers.jpg" alt="Home for sale" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Seller Tips</span>
              <h3 class="blog-card__title">5 Things That Will Help Your Home Sell Faster in 2026</h3>
              <p class="blog-card__excerpt">The market has shifted. Here are the five things sellers should focus on to attract serious buyers and close faster in today's market.</p>
              <span class="blog-card__meta">March 10, 2026 · 5 min read</span>
            </div>
          </div>
          <div class="blog-card reveal reveal--delay-3" onclick="window.location.hash='#/blog/healdsburg-petaluma-guide'">
            <div class="blog-card__img">
              <img src="images/hero-faq.jpg" alt="Sonoma County landscape" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Local Guide</span>
              <h3 class="blog-card__title">Healdsburg vs. Petaluma: Which Town Is Right for You?</h3>
              <p class="blog-card__excerpt">Two of Sonoma County's most popular towns, compared side by side — lifestyle, home prices, commute times, and community character.</p>
              <span class="blog-card__meta">February 28, 2026 · 9 min read</span>
            </div>
          </div>
          <div class="blog-card reveal reveal--delay-1" onclick="window.location.hash='#/blog/creative-financing-2026'">
            <div class="blog-card__img">
              <img src="images/hero-1.jpg" alt="Sonoma County vineyards" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Creative Financing</span>
              <h3 class="blog-card__title">Why Creative Financing Is Having a Moment in 2026</h3>
              <p class="blog-card__excerpt">High interest rates and more sellers than buyers are pushing creative deal structures into the mainstream. Here's why — and how it works.</p>
              <span class="blog-card__meta">February 15, 2026 · 8 min read</span>
            </div>
          </div>
          <div class="blog-card reveal reveal--delay-2" onclick="window.location.hash='#/blog/loan-assumptions-explained'">
            <div class="blog-card__img">
              <img src="images/hero-2.jpg" alt="Santa Rosa neighborhood" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__tag">Creative Financing</span>
              <h3 class="blog-card__title">Loan Assumptions Explained: How to Take Over a Seller's Low Rate</h3>
              <p class="blog-card__excerpt">FHA and VA loans are assumable — meaning a buyer can inherit the seller's interest rate. Here's how it works and why it's a game-changer right now.</p>
              <span class="blog-card__meta">February 1, 2026 · 7 min read</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }

  // ── BLOG POSTS ──
  const blogPosts = {
    'sonoma-market-2026': {
      title: 'Sonoma County Real Estate Market: Mid-2026 Update',
      tag: 'Market Trends',
      date: 'May 1, 2026',
      read: '6 min read',
      img: 'images/hero-home.jpg',
      content: `
        <p>The Sonoma County real estate market continues to evolve as we move into mid-2026. After a period of adjustment in 2024-2025, the market has found its footing with a balanced dynamic that favors neither buyers nor sellers exclusively — creating opportunities for both sides.</p>

        <h2>Current Market Conditions</h2>
        <p>Median home prices in Sonoma County have stabilized around $785,000, reflecting a modest 3.2% year-over-year increase. This controlled growth signals a healthy market that's moved past the volatility of recent years. Inventory levels have improved to approximately 2.8 months of supply — up from the extreme lows of 2021-2022 but still below the 4-6 months that characterizes a fully balanced market.</p>

        <h2>What Buyers Should Know</h2>
        <ul>
          <li><strong>More negotiating power:</strong> With inventory improving, buyers have more choices and less pressure to waive contingencies.</li>
          <li><strong>Interest rate environment:</strong> Rates have settled into the mid-5% range, making monthly payments more predictable than in recent years.</li>
          <li><strong>Opportunity zones:</strong> Areas like Rohnert Park, Cotati, and eastern Petaluma offer excellent value relative to the broader Sonoma County market.</li>
        </ul>

        <h2>What Sellers Should Know</h2>
        <ul>
          <li><strong>Pricing matters more than ever:</strong> Overpriced homes are sitting longer. Strategic pricing based on current comps is essential.</li>
          <li><strong>Presentation is key:</strong> Well-staged, professionally photographed homes are selling 40% faster than those without.</li>
          <li><strong>Spring and early summer remain peak season:</strong> If you're planning to list, now through July offers the largest buyer pool.</li>
        </ul>

        <h2>Looking Ahead</h2>
        <p>I expect the Sonoma County market to maintain its current trajectory through the remainder of 2026. The combination of Northern California's enduring appeal, limited developable land, and strong demand from both local and relocating buyers will continue to support property values. For personalized advice on timing your buy or sale, reach out for a free consultation.</p>
      `
    },
    'best-neighborhoods-santa-rosa': {
      title: 'The Best Neighborhoods in Santa Rosa for Families',
      tag: 'Local Guide',
      date: 'April 18, 2026',
      read: '8 min read',
      img: 'images/hero-blog.jpg',
      content: `
        <p>Santa Rosa is the heart of Sonoma County and offers some of the best family-friendly neighborhoods in Northern California. As a local realtor who's helped dozens of families find their perfect neighborhood, here's my honest breakdown of where families are thriving.</p>

        <h2>Rincon Valley</h2>
        <p>Consistently ranked as one of Santa Rosa's top family neighborhoods, Rincon Valley offers excellent schools (Rincon Valley Union School District), safe streets, and a strong community feel. Homes here range from $650K to $1.2M, with most falling in the $750K-$900K range. The area offers easy access to Annadel State Park, making it perfect for active families.</p>

        <h2>Bennett Valley</h2>
        <p>If you want a more rural feel while staying within city limits, Bennett Valley delivers. Larger lots, mature trees, and a slower pace of life characterize this area. Schools feed into the well-regarded Bennett Valley Union School District. Expect to pay $800K-$1.3M for homes here.</p>

        <h2>Fountaingrove</h2>
        <p>Rebuilt and revitalized after the 2017 fires, Fountaingrove offers newer construction with modern amenities and stunning hillside views. The area has attracted families looking for updated homes with open floor plans and energy-efficient features. Prices range from $850K to $1.5M+.</p>

        <h2>Montgomery Village Area</h2>
        <p>For families wanting walkability and convenience, the neighborhoods surrounding Montgomery Village offer a unique blend of suburban living with urban amenities. Great restaurants, shops, and services within walking distance, plus solid schools. Homes typically range from $600K-$900K.</p>

        <h2>Southwest Santa Rosa</h2>
        <p>Often overlooked, southwest Santa Rosa offers the best value for families in the city. Newer developments, decent-sized lots, and improving infrastructure make this an area worth watching. Entry-level homes start around $550K, making it accessible for first-time buyers.</p>
      `
    },
    'first-time-buyer-guide': {
      title: "First-Time Home Buyer's Guide to Sonoma County",
      tag: 'Buyer Tips',
      date: 'April 5, 2026',
      read: '10 min read',
      img: 'images/service-buyers.jpg',
      content: `
        <p>Buying your first home is one of life's biggest milestones — and in Sonoma County, it comes with its own unique set of opportunities and challenges. As someone who's guided countless first-time buyers through this process, here's everything you need to know.</p>

        <h2>Step 1: Get Pre-Approved (Not Just Pre-Qualified)</h2>
        <p>Before you start browsing listings, talk to a lender and get a full pre-approval. In Sonoma County's competitive market, sellers take pre-approved buyers more seriously. A pre-approval letter tells sellers you're financially ready and reduces the chance of financing falling through.</p>

        <h2>Step 2: Understand the True Cost of Homeownership</h2>
        <p>Your mortgage payment is just the beginning. In Sonoma County, factor in property taxes (roughly 1.1-1.25% of assessed value), homeowner's insurance (which has risen due to fire risk — budget $2,000-$5,000+ annually), and maintenance costs (budget 1% of home value per year).</p>

        <h2>Step 3: Know Your Down Payment Options</h2>
        <ul>
          <li><strong>Conventional:</strong> 5-20% down. Putting 20% down avoids PMI.</li>
          <li><strong>FHA:</strong> As low as 3.5% down, great for buyers with lower credit scores.</li>
          <li><strong>CalHFA Programs:</strong> California offers down payment assistance programs specifically for first-time buyers. Ask me about current options.</li>
          <li><strong>VA Loans:</strong> 0% down for eligible veterans and service members.</li>
        </ul>

        <h2>Step 4: Choose Your Location Wisely</h2>
        <p>Sonoma County is diverse — from urban Santa Rosa to rural west county to upscale Healdsburg. Think about your commute, school districts, lifestyle preferences, and long-term plans. I can help you match your priorities to the right area.</p>

        <h2>Step 5: Work With a Local Expert</h2>
        <p>A realtor who knows Sonoma County can save you time, money, and stress. I know which neighborhoods are appreciating, which have hidden issues, and how to negotiate effectively in this specific market. As a buyer, my services cost you nothing — the seller pays my commission.</p>
      `
    },
    'wine-country-living': {
      title: 'Wine Country Living: What to Know Before You Move',
      tag: 'Lifestyle',
      date: 'March 22, 2026',
      read: '7 min read',
      img: 'images/service-valuation.jpg',
      content: `
        <p>Sonoma County draws people from across the country with its vineyards, redwood forests, and laid-back lifestyle. But relocating here is a big decision. Here's an honest look at what living in wine country is actually like.</p>

        <h2>The Lifestyle</h2>
        <p>Sonoma County offers a quality of life that's hard to match. World-class dining, hundreds of wineries, stunning state parks, and the Pacific coastline are all within a short drive. The pace is slower than the Bay Area, and community events — from farmers markets to harvest festivals — bring people together year-round.</p>

        <h2>The Cost of Living</h2>
        <p>It's not cheap. The median home price hovers around $785K, and everyday costs (groceries, dining, services) run 15-25% above the national average. However, compared to San Francisco and Marin County, Sonoma offers significantly more space and value per dollar spent.</p>

        <h2>Climate and Fire Risk</h2>
        <p>Sonoma County enjoys a Mediterranean climate — warm, dry summers and mild, wet winters. However, fire risk is a reality that every resident must take seriously. Insurance costs have risen, and homes in certain zones require additional fire mitigation. Working with a local realtor who understands these factors is essential when choosing where to buy.</p>

        <h2>Commute Considerations</h2>
        <p>If you work in San Francisco, expect a 60-90 minute commute via Highway 101 or the SMART train. Many remote workers have found Sonoma County to be the perfect blend of rural living with urban access when needed. The SMART train connects Cloverdale to Larkspur, with several stops along the way.</p>

        <h2>The Community</h2>
        <p>What surprises most newcomers is how welcoming and tight-knit the communities are. Whether you settle in downtown Petaluma, rural Sebastopol, or upscale Healdsburg, you'll find engaged neighbors, active local organizations, and a genuine sense of belonging.</p>
      `
    },
    'selling-tips-2026': {
      title: '5 Things That Will Help Your Home Sell Faster in 2026',
      tag: 'Seller Tips',
      date: 'March 10, 2026',
      read: '5 min read',
      img: 'images/service-sellers.jpg',
      content: `
        <p>The market has shifted from the frenzy of 2021-2022, and sellers need to be more strategic. Here are the five things I'm telling every seller to focus on right now.</p>

        <h2>1. Price It Right From Day One</h2>
        <p>The "list high and negotiate down" strategy doesn't work in today's market. Overpriced homes sit, accumulate days on market, and ultimately sell for less than they would have with correct initial pricing. I use detailed comparative market analysis and real-time data to find the price point that attracts maximum interest.</p>

        <h2>2. Invest in Professional Photography and Video</h2>
        <p>Over 95% of buyers start their search online. Your listing photos are your first showing. Professional photography, drone shots, and video walkthroughs aren't optional anymore — they're the baseline. Properties with professional media receive 3x more online views.</p>

        <h2>3. Stage for the Market, Not for Yourself</h2>
        <p>Staging helps buyers envision themselves in the space. Depersonalize, declutter, and create a neutral canvas that feels aspirational but attainable. In Sonoma County specifically, buyers respond to natural light, indoor-outdoor flow, and the NorCal aesthetic.</p>

        <h2>4. Address the Big-Ticket Items</h2>
        <p>Buyers in 2026 are cautious about hidden costs. Pre-listing inspections, roof certifications, and updated systems (HVAC, water heater, electrical panel) remove objections before they arise. The cost of proactive maintenance is almost always less than the negotiation hit from buyer-discovered issues.</p>

        <h2>5. Be Flexible on Timing</h2>
        <p>In a balanced market, accommodation matters. Flexible closing dates, rent-back arrangements, and willingness to negotiate can be the difference between your offer and the one that fell through. Work with your realtor to identify which concessions cost you the least but matter most to buyers.</p>
      `
    },
    'healdsburg-petaluma-guide': {
      title: 'Healdsburg vs. Petaluma: Which Town Is Right for You?',
      tag: 'Local Guide',
      date: 'February 28, 2026',
      read: '9 min read',
      img: 'images/hero-faq.jpg',
      content: `
        <p>Healdsburg and Petaluma are two of Sonoma County's most sought-after towns, but they offer very different lifestyles. Here's an honest comparison to help you decide which one matches your priorities.</p>

        <h2>Home Prices</h2>
        <p><strong>Healdsburg:</strong> Median home price around $1.1M. This is wine country luxury territory — you're paying for the prestige, the walkable downtown, and proximity to premier wineries. Entry-level homes start around $750K.</p>
        <p><strong>Petaluma:</strong> Median home price around $800K. More accessible, with a wider range of housing options from historic Victorians to newer developments. Entry-level homes start around $550K.</p>

        <h2>Lifestyle & Character</h2>
        <p><strong>Healdsburg:</strong> Boutique wine country town with a famous central plaza, upscale dining, tasting rooms, and a resort-like atmosphere. It's quieter, more refined, and attracts a mix of retirees, remote workers, and second-home buyers.</p>
        <p><strong>Petaluma:</strong> More of a working town with genuine small-city character. A thriving arts scene, historic downtown, diverse dining options, and a younger, more eclectic community. Feels less "curated" and more authentically lived-in.</p>

        <h2>Commute & Access</h2>
        <p><strong>Healdsburg:</strong> About 70 miles from San Francisco. The commute isn't practical for daily trips, making it better for remote workers or those who don't need to commute.</p>
        <p><strong>Petaluma:</strong> About 40 miles from SF with SMART train access. A much more realistic commute for hybrid workers, and easier access to Marin County and the East Bay.</p>

        <h2>Schools</h2>
        <p>Both towns have solid public school options. Healdsburg Unified and Petaluma City Schools both receive above-average ratings. Petaluma offers more school choice due to its larger population.</p>

        <h2>My Recommendation</h2>
        <p>Choose Healdsburg if you prioritize wine country lifestyle, don't need to commute, and have a higher budget. Choose Petaluma if you want more value per dollar, better commute access, and a more diverse community feel. Either way, you're choosing one of Northern California's best places to live.</p>
      `
    },
    'creative-financing-2026': {
      title: 'Why Creative Financing Is Having a Moment in 2026',
      tag: 'Creative Financing',
      date: 'February 15, 2026',
      read: '8 min read',
      img: 'images/hero-1.jpg',
      content: `
        <p>If you've been paying attention to the real estate market over the past two years, you've noticed something: the old playbook isn't working for everyone anymore. Interest rates hovering in the mid-to-high 5% range, inventory that's grown faster than demand, and a growing number of sellers competing for a shrinking pool of qualified buyers. The result? Creative financing strategies that were once considered niche are moving squarely into the mainstream.</p>

        <h2>The Market Conditions Driving the Shift</h2>
        <p>Let's start with the numbers. In many Northern California markets — including right here in Sonoma County — we're seeing more homes listed than there are ready buyers. That's a significant shift from the frenzy of 2021-2022, when buyers were waiving every contingency and bidding $100K over asking just to get in the door.</p>
        <p>At the same time, interest rates remain elevated compared to the historic lows of 2020-2021. A buyer who would have qualified for a $700K home at 3% may only qualify for $550K at 5.75%. That's a massive gap — and it's leaving sellers with fewer offers and longer days on market.</p>
        <p>This is exactly the environment where creative financing thrives.</p>

        <h2>What Is Creative Financing?</h2>
        <p>Creative financing is any deal structure that goes beyond the traditional "buyer gets a conventional mortgage from a bank" model. These strategies have been around for decades, but they become especially powerful when conventional lending tightens. The most common approaches include:</p>
        <ul>
          <li><strong>Loan Assumptions:</strong> The buyer takes over the seller's existing mortgage — including their interest rate. If the seller locked in at 2.75% in 2021, the buyer inherits that rate. This is available on FHA and VA loans, and it's an incredible tool in today's market.</li>
          <li><strong>Seller Financing:</strong> The seller acts as the lender, carrying a note for part or all of the purchase price. Terms are negotiated directly between buyer and seller, offering flexibility that banks can't match.</li>
          <li><strong>Wrap-Around Mortgages (Subject-To):</strong> The buyer makes payments to the seller, who continues paying the existing mortgage. The buyer's payment "wraps around" the original loan. This keeps the seller's low-rate mortgage in place while giving the buyer access to the property.</li>
          <li><strong>Lease Options:</strong> The buyer leases the property with an option to purchase at a predetermined price within a set timeframe. A portion of the monthly rent may go toward the eventual down payment.</li>
          <li><strong>Land Contracts:</strong> Also called contracts for deed — the seller retains legal title while the buyer makes payments over time. Once the contract is fulfilled, title transfers to the buyer.</li>
        </ul>

        <h2>Why Sellers Should Pay Attention</h2>
        <p>If you're a seller sitting on a property that's been on the market for 60+ days, creative financing can be the difference between a stale listing and a closed deal. By offering flexible terms — whether that's seller financing, a lease option, or allowing a loan assumption — you dramatically expand your buyer pool.</p>
        <p>You also gain potential advantages: seller financing can generate consistent monthly income with interest, a subject-to deal can sell your home faster at full asking price, and lease options give you cash flow while locking in a future sale.</p>

        <h2>Why Buyers Should Pay Attention</h2>
        <p>If today's interest rates have priced you out of conventional lending, creative financing can be your path to homeownership. Assuming a seller's 2.75% FHA loan saves you hundreds of dollars per month compared to a new 5.75% mortgage. Seller financing can offer terms that banks won't. Lease options let you lock in a price while you build credit or save for a larger down payment.</p>

        <h2>Working With an Agent Who Knows This Space</h2>
        <p>Here's the reality: most real estate agents don't understand creative financing. They've been trained on conventional transactions, and anything outside that box is unfamiliar territory. That's where I come in. I've built my practice around understanding these strategies inside and out — how to structure them, how to protect both parties, and how to get them to the closing table.</p>
        <p>If you're a buyer or seller who's feeling stuck in today's market, let's talk. There may be a path forward that you haven't considered yet.</p>
      `
    },
    'loan-assumptions-explained': {
      title: "Loan Assumptions Explained: How to Take Over a Seller's Low Rate",
      tag: 'Creative Financing',
      date: 'February 1, 2026',
      read: '7 min read',
      img: 'images/hero-2.jpg',
      content: `
        <p>Imagine buying a home and inheriting the seller's 2.75% interest rate instead of taking out a new mortgage at 5.75%. That's not a hypothetical — it's exactly what a loan assumption allows you to do. And in today's rate environment, it might be the most powerful tool in a buyer's arsenal.</p>

        <h2>What Is a Loan Assumption?</h2>
        <p>A loan assumption is exactly what it sounds like: the buyer assumes (takes over) the seller's existing mortgage. You step into their loan with the same interest rate, remaining balance, and repayment terms. The original borrower is released from the obligation, and you take over the monthly payments.</p>
        <p>Not all loans are assumable. Conventional mortgages typically have "due on sale" clauses that prevent assumptions. But two major loan types are assumable by design:</p>
        <ul>
          <li><strong>FHA Loans:</strong> Fully assumable, provided the buyer qualifies with the lender.</li>
          <li><strong>VA Loans:</strong> Fully assumable, and the buyer doesn't even need to be a veteran (though the seller's VA entitlement may remain tied up unless the buyer is also a veteran).</li>
        </ul>

        <h2>Why This Matters Right Now</h2>
        <p>Between 2020 and early 2022, millions of homeowners locked in FHA and VA mortgages at historically low rates — many between 2.5% and 3.5%. Those loans are still out there, and they're still assumable.</p>
        <p>Let's do the math on a real scenario:</p>
        <ul>
          <li>A seller has an FHA loan with a $400,000 remaining balance at 2.75%</li>
          <li>Monthly principal and interest: approximately $1,633</li>
          <li>A new $400,000 mortgage at 5.75% would cost approximately $2,334/month</li>
          <li><strong>That's a $701/month savings — $8,412 per year — by assuming the existing loan</strong></li>
        </ul>
        <p>Over the life of the loan, the savings can be staggering. It's the closest thing to a "cheat code" in real estate right now.</p>

        <h2>How the Process Works</h2>
        <p><strong>Step 1: Identify an assumable loan.</strong> Not every listing advertises this. A knowledgeable agent (like me) will ask the right questions and identify properties with assumable FHA or VA loans.</p>
        <p><strong>Step 2: Negotiate the deal.</strong> The purchase price may be higher than the loan balance. The buyer needs to cover the difference between the purchase price and the remaining loan balance — either in cash or with a second lien (sometimes seller financing can bridge this gap).</p>
        <p><strong>Step 3: Qualify with the lender.</strong> The buyer must still qualify with the existing lender. For FHA assumptions, you'll need to meet standard FHA credit and income requirements. For VA assumptions, guidelines vary but are generally flexible.</p>
        <p><strong>Step 4: Close the assumption.</strong> The lender processes the assumption, which can take 45-90 days (sometimes longer, depending on the servicer). Patience is key — the savings are worth the wait.</p>

        <h2>The Equity Gap Challenge</h2>
        <p>The main challenge with assumptions is the equity gap. If a seller bought their home for $500K three years ago with an FHA loan and the remaining balance is $470K, but the home is now worth $600K, the buyer needs to bring $130K to the table to cover the difference between the purchase price and the assumable loan balance.</p>
        <p>This is where creative structuring comes in. Options include:</p>
        <ul>
          <li>A larger cash down payment</li>
          <li>A second mortgage or HELOC from another lender</li>
          <li>Seller financing on the gap amount</li>
          <li>A combination of approaches</li>
        </ul>

        <h2>Is a Loan Assumption Right for You?</h2>
        <p>If you're a buyer struggling with today's rates, absolutely explore this option. If you're a seller with an FHA or VA loan from 2020-2022, your assumable mortgage is a competitive advantage — it can attract buyers who might otherwise not be able to afford your home.</p>
        <p>This is one of my areas of expertise. I've helped both buyers and sellers structure assumption deals that work for everyone involved. If you want to know whether a loan assumption makes sense in your situation, let's talk.</p>
      `
    }
  };

  function blogPostPage(slug) {
    const post = blogPosts[slug];
    if (!post) return blogPage();
    return `
    <section class="page-hero" style="min-height: 40vh;">
      <div class="page-hero__bg">
        <img src="${post.img}" alt="${post.title}" loading="eager" />
      </div>
      <div class="page-hero__overlay"></div>
      <div class="page-hero__content">
        <span class="hero__badge reveal">${post.tag}</span>
        <h1 class="reveal reveal--delay-1" style="font-size: clamp(2rem, 4vw, 3rem);">${post.title}</h1>
        <p class="page-hero__sub reveal reveal--delay-2">${post.date} · ${post.read}</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="blog-post__content reveal">
          <a href="#/blog" data-link class="blog-post__back"><span>←</span> Back to Blog</a>
          ${post.content}
          <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--gray-200);">
            <p style="font-size: 1rem; color: var(--gray-600);">Have questions about the topics covered here? I'm always happy to chat.</p>
            <a href="#/contact" data-link class="btn btn--dark" style="margin-top: 16px;">Get in Touch <span class="btn__arrow">→</span></a>
          </div>
        </div>
      </div>
    </section>
    `;
  }

  // ── FAQ ──
  function faqPage() {
    const faqs = [
      {
        q: "What areas do you serve?",
        a: "I'm based in Santa Rosa and primarily serve Sonoma County — including Santa Rosa, Petaluma, Healdsburg, Windsor, Sebastopol, Rohnert Park, Cotati, Sonoma, and Cloverdale. I also work with clients in Marin County, Napa County, Mendocino County, and Lake County."
      },
      {
        q: "How do I know if I'm ready to buy a home?",
        a: "Generally, you're ready when you have stable income, manageable debt, some savings for a down payment and closing costs, and a desire to settle in one place for at least 3-5 years. I'm happy to walk through your specific situation in a free consultation — no pressure, just an honest assessment of where you stand."
      },
      {
        q: "What does it cost to work with you as a buyer?",
        a: "As a buyer, my services typically cost you nothing out of pocket. The seller traditionally pays the buyer's agent commission as part of the sale. I'll explain exactly how compensation works during our first meeting so there are never any surprises."
      },
      {
        q: "How do you determine the right listing price for my home?",
        a: "I conduct a comprehensive Comparative Market Analysis (CMA) that looks at recent sales of similar homes in your area, current market conditions, your home's unique features, and buyer demand. I combine data-driven analysis with years of local market intuition to find the price that maximizes your return."
      },
      {
        q: "How long does it typically take to sell a home in Sonoma County?",
        a: "In the current market, well-priced homes in good condition are selling in 15-45 days on average. Homes that are overpriced or need significant work take longer. My focus is on proper preparation and strategic pricing to minimize your time on market."
      },
      {
        q: "What makes you different from other realtors?",
        a: "Three things: First, you work directly with me — not a team of assistants. Second, I combine deep local knowledge with a data-driven approach to pricing and marketing. Third, I'm honest to a fault — I'll tell you if a property isn't right for you or if your home needs work before listing. My goal is a long-term relationship, not a quick commission."
      },
      {
        q: "Do you help with investment properties?",
        a: "Absolutely. I work with investors on single-family rentals, multi-family properties, and land acquisitions throughout Northern California. I can help you analyze potential returns, identify emerging neighborhoods, and build a portfolio strategy that aligns with your goals."
      },
      {
        q: "What should I do to prepare my home for sale?",
        a: "Start by decluttering and deep cleaning. Address any deferred maintenance — leaky faucets, chipped paint, worn flooring. I'll do a pre-listing walkthrough and give you a prioritized list of improvements that will yield the best return on investment. Not every home needs a full renovation; sometimes small, targeted updates make the biggest difference."
      },
      {
        q: "Can you help me buy and sell at the same time?",
        a: "Yes, this is a common scenario and one I handle regularly. I'll coordinate the timing of both transactions, explore bridge financing options if needed, and develop a strategy that minimizes your risk and maximizes your proceeds. It requires careful planning, and that's exactly what I do."
      },
      {
        q: "How do I get started?",
        a: "Reach out via the contact form, call me at (707) 583-3304, or email me at patrick@redwood-realestate.com. We'll schedule a no-obligation consultation to discuss your goals, timeline, and next steps. I look forward to hearing from you."
      }
    ];

    return `
    <section class="page-hero">
      <div class="page-hero__bg">
        <img src="images/hero-faq.jpg" alt="Sonoma County landscape" loading="eager" />
      </div>
      <div class="page-hero__overlay"></div>
      <div class="page-hero__content">
        <span class="hero__badge reveal">Got Questions?</span>
        <h1 class="reveal reveal--delay-1">Frequently Asked <em>Questions</em></h1>
        <p class="page-hero__sub reveal reveal--delay-2">Everything you need to know about working with me and navigating Sonoma County real estate.</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="faq-list">
          ${faqs.map((faq, i) => `
            <div class="faq-item reveal reveal--delay-${(i % 3) + 1}">
              <button class="faq-item__question">
                <span>${faq.q}</span>
                <span class="faq-item__icon">${icons.plus}</span>
              </button>
              <div class="faq-item__answer">
                <p>${faq.a}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--cream);">
      <div class="section__inner">
        <div class="cta-banner reveal--scale">
          <h2>Still Have Questions?</h2>
          <p>I'm always happy to chat — no question is too small, and there's never any obligation.</p>
          <a href="#/contact" data-link class="btn btn--primary">Let's Talk <span class="btn__arrow">→</span></a>
        </div>
      </div>
    </section>
    `;
  }

  // ── CONTACT ──
  function contactPage() {
    return `
    <section class="page-hero">
      <div class="page-hero__bg">
        <img src="images/hero-contact.jpg" alt="Northern California redwood forest" loading="eager" />
      </div>
      <div class="page-hero__overlay"></div>
      <div class="page-hero__content">
        <span class="hero__badge reveal">Get In Touch</span>
        <h1 class="reveal reveal--delay-1">Let's Start a <em>Conversation</em></h1>
        <p class="page-hero__sub reveal reveal--delay-2">Whether you're ready to buy, sell, or just curious about the market — I'm here to help.</p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="contact-grid">
          <div class="reveal--left">
            <span class="section__label">Reach Out</span>
            <h2>How Can I <span class="text-accent">Help You?</span></h2>
            <p style="margin-top: 16px; margin-bottom: 40px; color: var(--gray-500); line-height: 1.8;">
              Every real estate journey starts with a conversation. Whether you have a specific question or just want to explore your options, I'd love to hear from you. No pressure, no obligation — just honest guidance from a local expert.
            </p>

            <div class="contact-info__item">
              <div class="contact-info__icon">${icons.phone}</div>
              <div>
                <div class="contact-info__label">Phone</div>
                <div class="contact-info__value"><a href="tel:+17075833304">(707) 583-3304</a></div>
              </div>
            </div>
            <div class="contact-info__item">
              <div class="contact-info__icon">${icons.mail}</div>
              <div>
                <div class="contact-info__label">Email</div>
                <div class="contact-info__value"><a href="mailto:patrick@redwood-realestate.com">patrick@redwood-realestate.com</a></div>
              </div>
            </div>
            <div class="contact-info__item">
              <div class="contact-info__icon">${icons.map}</div>
              <div>
                <div class="contact-info__label">Location</div>
                <div class="contact-info__value">Santa Rosa, CA 95401</div>
              </div>
            </div>
            <div class="contact-info__item">
              <div class="contact-info__icon">${icons.clock}</div>
              <div>
                <div class="contact-info__label">Availability</div>
                <div class="contact-info__value">Mon–Sun, 7AM – 9PM</div>
              </div>
            </div>
          </div>

          <div class="contact-form reveal--right">
            <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--green-900); margin-bottom: 8px;">Send a Message</h3>
            <p style="font-size: 0.9rem; color: var(--gray-400); margin-bottom: 28px;">I'll get back to you within 24 hours.</p>
            <form id="contactForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" placeholder="John" required />
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" placeholder="Smith" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="john@example.com" required />
                </div>
                <div class="form-group">
                  <label for="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" placeholder="(707) 555-0100" />
                </div>
              </div>
              <div class="form-group">
                <label for="interest">I'm Interested In</label>
                <select id="interest" name="interest">
                  <option value="">Select an option...</option>
                  <option value="buying">Buying a Home</option>
                  <option value="selling">Selling a Home</option>
                  <option value="valuation">Home Valuation</option>
                  <option value="consultation">General Consultation</option>
                  <option value="investment">Investment Properties</option>
                </select>
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell me about what you're looking for..." rows="5"></textarea>
              </div>
              <button type="submit" class="btn btn--primary" style="width: 100%; justify-content: center;">
                Send Message <span class="btn__arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--cream);">
      <div class="section__inner">
        <div class="cta-banner reveal--scale" style="background: linear-gradient(135deg, var(--brown-800), var(--brown-700));">
          <h2>Prefer a Quick Call?</h2>
          <p>Sometimes a five-minute phone call is worth more than a dozen emails. I'm always happy to hop on a call and chat about your real estate goals.</p>
          <a href="tel:+17075833304" class="btn btn--primary">Call (707) 583-3304</a>
        </div>
      </div>
    </section>
    `;
  }

  // ── ROUTES ──
  const routes = {
    '/': homePage,
    '/about': aboutPage,
    '/blog': blogPage,
    '/faq': faqPage,
    '/contact': contactPage,
  };

  // Handle blog post routes dynamically
  const originalNavigate = navigate;
  window.removeEventListener('hashchange', navigate);

  function routeHandler() {
    closeMenu();
    const route = getRoute();

    if (route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '');
      app.innerHTML = '';
      app.className = 'page-transition';
      app.innerHTML = blogPostPage(slug);
      window.scrollTo(0, 0);
      updateActiveLink('/blog');
      initScrollReveal();
      initParallax();
      return;
    }

    const page = routes[route] || routes['/'];
    app.innerHTML = '';
    app.className = 'page-transition';
    app.innerHTML = page();
    window.scrollTo(0, 0);
    updateActiveLink(route);
    initScrollReveal();
    initFAQ();
    initParallax();
    initCountUp();
    initContactForm();
    initHeroCarousel();
  }

  window.addEventListener('hashchange', routeHandler);

  // ── INIT ──
  routeHandler();

})();
