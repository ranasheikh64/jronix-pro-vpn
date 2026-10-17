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
