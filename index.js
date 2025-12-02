// Konfigurasi Supabase
const SUPABASE_CONFIG = {
  url: 'https://zrkugfzulshbtoqlhqaj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpya3VnZnp1bHNoYnRvcWxocWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NDc0MzcsImV4cCI6MjA4MDIyMzQzN30.wk4WPpjbkdInpVM8BN7rnKGnMZUHYElVGDhi8d_GzG0'
};

const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Fungsi cek username
async function checkUsername(username) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error cek username:', error);
    return null;
  }
  return data;
}

// Fungsi update last login
async function updateLastLogin(username) {
  await supabaseClient
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('username', username.toLowerCase().trim());
}

// Fungsi animasi input
function setupInputAnimation(input, group) {
  input.addEventListener('focus', () => group.classList.add('focused'));
  input.addEventListener('blur', () => !input.value && group.classList.remove('focused'));
  input.addEventListener('input', () => input.value ? group.classList.add('has-value') : group.classList.remove('has-value'));
  if (input.value) group.classList.add('has-value');
}

// Event listener utama
document.addEventListener('DOMContentLoaded', function () {
  const usernameInput = document.getElementById('username');
  const usernameGroup = document.getElementById('usernameGroup');
  const enterButton = document.querySelector('.btn-enter');
  const showScheduleBtn = document.getElementById('showSchedule');

  setupInputAnimation(usernameInput, usernameGroup);

  enterButton.addEventListener('click', async function () {
    const username = usernameInput.value.trim();

    if (!username) {
      usernameInput.focus();
      usernameGroup.style.animation = 'shake 0.4s ease-in-out';
      setTimeout(() => usernameGroup.style.animation = '', 400);
      return;
    }

    enterButton.style.background = 'linear-gradient(135deg, var(--accent-warning) 0%, #d97706 100%)';
    enterButton.textContent = 'MEMERIKSA...';
    enterButton.disabled = true;

    try {
      const user = await checkUsername(username);

      if (user) {
        enterButton.style.background = 'linear-gradient(135deg, var(--accent-success) 0%, #059669 100%)';
        enterButton.textContent = 'BERHASIL!';

        await updateLastLogin(username);

        localStorage.setItem('stream48_isLoggedIn', 'true');
        localStorage.setItem('stream48_username', username);
        localStorage.setItem('stream48_userData', JSON.stringify({
          id: user.id,
          username: user.username,
          createdAt: user.created_at,
          subscriptionStatus: user.subscription_status
        }));

        setTimeout(() => {
          window.location.href = 'user-dashboard.html';
        }, 800);
      } else {
        enterButton.style.background = 'linear-gradient(135deg, var(--accent-danger) 0%, #dc2626 100%)';
        enterButton.textContent = 'USERNAME TIDAK DITEMUKAN!';

        setTimeout(() => {
          enterButton.style.background = 'linear-gradient(135deg, var(--accent-blue) 0%, #6366f1 100%)';
          enterButton.textContent = 'MASUK SEKARANG';
          enterButton.disabled = false;
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      enterButton.style.background = 'linear-gradient(135deg, var(--accent-danger) 0%, #dc2626 100%)';
      enterButton.textContent = 'ERROR! COBA LAGI';

      setTimeout(() => {
        enterButton.style.background = 'linear-gradient(135deg, var(--accent-blue) 0%, #6366f1 100%)';
        enterButton.textContent = 'MASUK SEKARANG';
        enterButton.disabled = false;
      }, 1500);
    }
  });

  showScheduleBtn.addEventListener('click', () => {
    window.location.href = 'schedule.html';
  });

  setTimeout(() => usernameInput.focus(), 800);

  // Buat partikel background
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 4 + 6;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    particlesContainer.appendChild(particle);
  }
});
