function applyLanguage(lang) {
  document.querySelectorAll('[data-en][data-de]').forEach(function(el) {
    var text = el.getAttribute('data-' + lang);
    if (text !== null) {
      if ((el.tagName === 'INPUT' && el.type !== 'hidden') || el.tagName === 'TEXTAREA') {
        if (el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', text);
        } else {
          el.value = text;
        }
      } else {
        el.innerText = text;
      }
    }
  });
  var btn = document.getElementById('langToggle');
  if (btn) {
    btn.innerText = lang === 'de' ? 'DE | EN' : 'EN | DE';
  }
}

function toggleLanguage() {
  var current = localStorage.getItem('lang') || 'de';
  var next = current === 'en' ? 'de' : 'en';
  localStorage.setItem('lang', next);
  applyLanguage(next);
}

document.addEventListener('DOMContentLoaded', function() {
  var lang = localStorage.getItem('lang') || 'de';
  applyLanguage(lang);
});

var NOTIFICATION_POLL_INTERVAL_MS = 30000;

async function fetchNotifications() {
  try {
    var resp = await fetch('/api/notifications/');
    var data = await resp.json();
    if (data.ok) {
      updateNotificationBadge(data.count);
      return data.notifications;
    }
  } catch (err) { /* silent */ }
  return [];
}

function updateNotificationBadge(count) {
  var badges = document.querySelectorAll('.wf-notif-count');
  badges.forEach(function(badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  fetchNotifications();
  setInterval(fetchNotifications, NOTIFICATION_POLL_INTERVAL_MS);
});
