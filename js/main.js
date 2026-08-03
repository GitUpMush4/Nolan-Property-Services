// Nolan Property Services — shared site behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Gallery "See More Photos" expand buttons
  document.querySelectorAll('[data-see-more]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = document.getElementById(btn.getAttribute('data-see-more'));
      if (!category) return;
      category.querySelectorAll('.photo-tile.is-hidden').forEach(function (tile) {
        tile.classList.remove('is-hidden');
      });
      btn.remove();
    });
  });

  // Mobile nav toggle
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      header.classList.toggle('nav-open');
      var expanded = header.classList.contains('nav-open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
      });
    });
  }

  // Highlight current page in nav
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Set current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-reveal for cards, rows, panels — staggered within each parent group
  var revealTargets = document.querySelectorAll(
    '.card, .service-row, .review-panel, .photo-tile, .contact-info-item, .section-head, .notice-box, .cta-banner'
  );
  if (revealTargets.length) {
    var groupCounts = new WeakMap();
    revealTargets.forEach(function (el) {
      el.classList.add('js-reveal');
      var parent = el.parentElement;
      var count = groupCounts.get(parent) || 0;
      el.style.transitionDelay = Math.min(count * 90, 360) + 'ms';
      groupCounts.set(parent, count + 1);
    });

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealTargets.forEach(function (el) { el.classList.add('reveal-visible'); });
    }
  }

  // Draw in the marker-highlight underline shortly after load.
  // Double rAF ensures the browser has painted the 0% state at least once
  // before we flip the class, otherwise the transition can silently no-op.
  var markerEls = document.querySelectorAll('.marker-highlight');
  if (markerEls.length) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(function () {
          markerEls.forEach(function (el) { el.classList.add('in-view'); });
        }, 400);
      });
    });
  }

  // Count up the "100%" stat when it scrolls into view
  var countEl = document.querySelector('.review-score .big');
  if (countEl && 'IntersectionObserver' in window) {
    var countMatch = countEl.textContent.trim().match(/^(\d+)(.*)$/);
    if (countMatch && !reducedMotion) {
      var countTarget = parseInt(countMatch[1], 10);
      var countSuffix = countMatch[2];
      var countObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          var startTime = null;
          var duration = 1100;
          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            entry.target.textContent = Math.round(eased * countTarget) + countSuffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      countObserver.observe(countEl);
    }
  }

  // Hero background photo carousel (blurred real job photos, crossfading)
  var heroBgImages = ['images/hero-bg-1.jpg', 'images/hero-bg-2.jpg', 'images/hero-bg-3.jpg', 'images/hero-bg-4.jpg'];
  document.querySelectorAll('.hero').forEach(function (hero) {
    var slidesWrap = document.createElement('div');
    slidesWrap.className = 'hero-bg-slides';
    slidesWrap.setAttribute('aria-hidden', 'true');
    heroBgImages.forEach(function (src, i) {
      var slide = document.createElement('div');
      slide.className = 'hero-bg-slide' + (i === 0 ? ' active' : '');
      slide.style.backgroundImage = 'url(' + src + ')';
      slidesWrap.appendChild(slide);
    });
    hero.insertBefore(slidesWrap, hero.firstChild);

    var overlay = document.createElement('div');
    overlay.className = 'hero-bg-overlay';
    hero.insertBefore(overlay, slidesWrap.nextSibling);

    if (!reducedMotion && heroBgImages.length > 1) {
      var slides = slidesWrap.querySelectorAll('.hero-bg-slide');
      var current = 0;
      setInterval(function () {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 6000);
    }
  });

  // Cursor-follow glow in the hero — desktop pointer devices only
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reducedMotion && canHover) {
    document.querySelectorAll('.hero').forEach(function (hero) {
      var glow = document.createElement('div');
      glow.className = 'hero-glow';
      glow.setAttribute('aria-hidden', 'true');
      hero.insertBefore(glow, hero.firstChild);
      hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        glow.style.transform = 'translate(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px)';
      });
    });
  }

  // Google reviews carousel
  initReviewsCarousel();

  // Lead form submission (Formspree)
  var form = document.getElementById('lead-form');
  if (form) {
    var statusEl = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formAction = form.getAttribute('action');

      if (!formAction || formAction.indexOf('YOUR_FORM_ID') !== -1) {
        showStatus('error', 'Online form isn’t connected yet. Please call 07437 004809 or email enquiries@nolanpropertyservices.co.uk and we’ll get back to you.');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(formAction, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            showStatus('success', 'Thanks, your enquiry has been sent. We’ll be in touch shortly.');
          } else {
            showStatus('error', 'Something went wrong sending your enquiry. Please call 07437 004809 instead.');
          }
        })
        .catch(function () {
          showStatus('error', 'Something went wrong sending your enquiry. Please call 07437 004809 instead.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });

    function showStatus(type, message) {
      statusEl.textContent = message;
      statusEl.className = 'form-status show ' + type;
    }
  }
});

// ---------- Google reviews carousel ----------
// Requires a Google Maps JavaScript API key with the Places API enabled.
// Until GOOGLE_MAPS_API_KEY is set below, the static fallback content stays visible.
function initReviewsCarousel() {
  var root = document.getElementById('reviews-carousel');
  if (!root) return;

  var GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
  var BUSINESS_QUERY = 'Nolan Property Services LTD, Chorley, United Kingdom';

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.indexOf('YOUR_GOOGLE_MAPS_API_KEY') !== -1) {
    return;
  }

  window.__initReviewsCarouselCallback = function () {
    try {
      var service = new google.maps.places.PlacesService(document.createElement('div'));
      service.findPlaceFromQuery({ query: BUSINESS_QUERY, fields: ['place_id'] }, function (results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || !results[0]) return;
        service.getDetails(
          { placeId: results[0].place_id, fields: ['reviews', 'rating', 'user_ratings_total'] },
          function (place, status2) {
            if (status2 !== google.maps.places.PlacesServiceStatus.OK || !place || !place.reviews || !place.reviews.length) return;
            renderReviewsCarousel(root, place);
          }
        );
      });
    } catch (e) {
      // Leave the static fallback in place on any failure
    }
  };

  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY + '&libraries=places&callback=__initReviewsCarouselCallback';
  script.async = true;
  document.head.appendChild(script);
}

function renderReviewsCarousel(root, place) {
  function starString(rating) {
    var full = Math.round(rating);
    return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
  }
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  var liveEl = root.querySelector('[data-role="live"]');
  var fallbackEl = root.querySelector('[data-role="fallback"]');
  var track = root.querySelector('[data-role="track"]');
  var dotsWrap = root.querySelector('[data-role="dots"]');

  root.querySelector('[data-role="score"]').textContent = place.rating.toFixed(1);
  root.querySelector('[data-role="stars"]').textContent = starString(place.rating);
  root.querySelector('[data-role="count"]').textContent = place.user_ratings_total + ' Google reviews';

  track.innerHTML = '';
  dotsWrap.innerHTML = '';

  place.reviews.slice(0, 5).forEach(function (review, i) {
    var slide = document.createElement('div');
    slide.className = 'review-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML =
      '<blockquote>“' + escapeHtml(review.text) + '”</blockquote>' +
      '<div class="reviewer">' +
      (review.profile_photo_url ? '<img src="' + review.profile_photo_url + '" alt="" loading="lazy">' : '') +
      '<div><div class="reviewer-name">' + escapeHtml(review.author_name) + '</div>' +
      '<div class="review-stars">' + starString(review.rating) + '</div></div>' +
      '</div>';
    track.appendChild(slide);

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Show review ' + (i + 1));
    dot.addEventListener('click', function () {
      goTo(i);
      resetTimer();
    });
    dotsWrap.appendChild(dot);
  });

  var slides = track.querySelectorAll('.review-slide');
  var dots = dotsWrap.querySelectorAll('.carousel-dot');
  var current = 0;
  var timer = null;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startTimer() {
    if (reducedMotion || slides.length < 2) return;
    timer = setInterval(function () { goTo(current + 1); }, 6000);
  }
  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  root.querySelector('[data-role="prev"]').addEventListener('click', function () { goTo(current - 1); resetTimer(); });
  root.querySelector('[data-role="next"]').addEventListener('click', function () { goTo(current + 1); resetTimer(); });
  liveEl.addEventListener('mouseenter', function () { clearInterval(timer); });
  liveEl.addEventListener('mouseleave', startTimer);

  startTimer();
  fallbackEl.style.display = 'none';
  liveEl.style.display = 'block';
}
