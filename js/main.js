/**
 * Jronix Pro VPN Landing Page JavaScript
 * Optimized, vanilla ES6+ interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = mobileToggle ? mobileToggle.querySelector('.icon-open') : null;
  const iconClose = mobileToggle ? mobileToggle.querySelector('.icon-close') : null;

  function toggleMobileMenu(open) {
    if (!mobileMenu) return;
    const shouldOpen = open !== undefined ? open : !mobileMenu.classList.contains('active');
    if (shouldOpen) {
      mobileMenu.classList.add('active');
      if (iconOpen) iconOpen.style.display = 'none';
      if (iconClose) iconClose.style.display = 'block';
    } else {
      mobileMenu.classList.remove('active');
      if (iconOpen) iconOpen.style.display = 'block';
      if (iconClose) iconClose.style.display = 'none';
    }
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close when clicking mobile nav links
    document.querySelectorAll('.mobile-nav-link, .mobile-download-btn').forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  // 2. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other open items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 3. Live Server Ping Simulation
  const pingButtons = document.querySelectorAll('.ping-btn');
  pingButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.server-card');
      const pingTag = card.querySelector('.ping-tag');
      const originalText = pingTag.textContent;

      pingTag.innerHTML = `
        <span class="spinner" style="display:inline-block;width:10px;height:10px;border:2px solid #10B981;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;"></span>
        Testing...
      `;

      setTimeout(() => {
        // Randomize slight ping variance for realism
        const base = parseInt(btn.dataset.basePing || '45');
        const jitter = Math.floor(Math.random() * 8) - 3;
        const newPing = Math.max(20, base + jitter);
        pingTag.innerHTML = `⚡ ${newPing} ms`;
      }, 700);
    });
  });

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 5. Automatic Latest Release Fetcher from GitHub API
  const repoOwner = 'ranasheikh64';
  const repoName = 'jr-pro-vpn';
  
  async function fetchLatestRelease() {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`);
      if (!response.ok) return;
      const release = await response.json();
      
      const tagName = release.tag_name || '';
      // Find the apk asset
      const apkAsset = (release.assets || []).find(a => a.name.endsWith('.apk'));
      const downloadUrl = apkAsset ? apkAsset.browser_download_url : `https://github.com/${repoOwner}/${repoName}/releases/latest/download/app-release.apk`;
      
      let sizeMb = '';
      if (apkAsset && apkAsset.size) {
        sizeMb = ` · ${(apkAsset.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      // Update Hero button
      const heroBtn = document.getElementById('btn-hero-download');
      const heroText = document.getElementById('download-btn-text');
      if (heroBtn && downloadUrl) {
        heroBtn.href = downloadUrl;
      }
      if (heroText && tagName) {
        heroText.textContent = `Download APK (${tagName}${sizeMb})`;
      }

      // Update CTA card button
      const ctaBtn = document.getElementById('btn-cta-download');
      const ctaText = document.getElementById('cta-btn-text');
      if (ctaBtn && downloadUrl) {
        ctaBtn.href = downloadUrl;
      }
      if (ctaText && tagName) {
        ctaText.textContent = `Download APK (${tagName})`;
      }
    } catch (err) {
      console.log('Using permanent fallback release URL:', err);
    }
  }

  fetchLatestRelease();
});
