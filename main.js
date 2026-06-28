// ================================
// CONFIG
// ================================
const BASE_URL = 'https://api.opendota.com/api'

// ================================
// ELEMENTOS DEL DOM
// ================================
const searchScreen = document.getElementById('search-screen')
const profileScreen = document.getElementById('profile')
const searchBtn = document.getElementById('search-btn')
const backBtn = document.getElementById('back-btn')
const steamInput = document.getElementById('steam-input')
const loader = document.getElementById('loader')

// ================================
// EVENTOS
// ================================
searchBtn.addEventListener('click', () => {
  const id = steamInput.value.trim()
  if (!id) return
  loadProfile(id)
})

steamInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const id = steamInput.value.trim()
    if (!id) return
    loadProfile(id)
  }
})

backBtn.addEventListener('click', () => {
  profileScreen.style.display = 'none'
  searchScreen.style.display = 'flex'
  steamInput.value = ''
})

// ================================
// FETCH DATA FROM API
// ================================
async function loadProfile(playerId) {
  searchScreen.style.display = 'none'
  loader.classList.remove('hidden')

  try {
    const [playerRes, wlRes, heroesRes, matchesRes, heroListRes] = await Promise.all([
      fetch(`${BASE_URL}/players/${playerId}`),
      fetch(`${BASE_URL}/players/${playerId}/wl`),
      fetch(`${BASE_URL}/players/${playerId}/heroes?sort=games`),
      fetch(`${BASE_URL}/players/${playerId}/recentMatches`),
      fetch(`${BASE_URL}/heroes`)
    ])

    const player   = await playerRes.json()
    const wl       = await wlRes.json()
    const heroes   = await heroesRes.json()
    const matches  = await matchesRes.json()
    const heroList = await heroListRes.json()

    renderProfile(player)
    renderStats(wl)
    renderHeroes(heroes, heroList)
    renderMatches(matches)

    loader.classList.add('hidden')
    profileScreen.style.display = 'block'

  } catch (error) {
    console.error('Error loading data:', error)
    loader.classList.add('hidden')
    searchScreen.style.display = 'flex'
    alert('Player not found. Check the Steam ID and try again.')
  }
}

// ================================
// RENDER — Header
// ================================
function renderProfile(player) {
  document.getElementById('player-name').textContent = player.profile.personaname
  document.getElementById('player-avatar').src = player.profile.avatarfull
  document.getElementById('player-rank').textContent = '🎮 Dota 2 Player'
}

// ================================
// RENDER — Stats
// ================================
function renderStats(wl) {
  const wins   = wl.win
  const losses = wl.lose
  const total  = wins + losses
  const rate   = ((wins / total) * 100).toFixed(1)

  document.getElementById('total-matches').textContent = total
  document.getElementById('wins').textContent = wins
  document.getElementById('losses').textContent = losses
  document.getElementById('win-rate').textContent = rate + '%'
}

// ================================
// RENDER — Top Heroes
// ================================
function renderHeroes(heroes, heroList) {
  const grid = document.getElementById('heroes-grid')

  const heroMap = {}
  heroList.forEach(h => {
    heroMap[h.id] = {
      name: h.localized_name,
      slug: h.name.replace('npc_dota_hero_', '')
    }
  })

  const validHeroes = heroes.filter(h => h.games > 0).slice(0, 5)

  grid.innerHTML = validHeroes.map(hero => {
    const winRate  = ((hero.win / hero.games) * 100).toFixed(1)
    const heroData = heroMap[hero.hero_id] || { name: 'Unknown', slug: '' }
    const imgUrl   = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroData.slug}.png`
    const wrColor  = parseFloat(winRate) >= 50 ? 'var(--win)' : 'var(--loss)'

    return `
      <div class="hero-card">
        <div class="hero-card__image">
          <img src="${imgUrl}" alt="${heroData.name}" onerror="this.src=''" />
        </div>
        <div class="hero-card__body">
          <div class="hero-card__name">${heroData.name}</div>
          <div class="hero-card__stats">
            <span class="hero-card__games">${hero.games} games</span>
            <span class="hero-card__wr" style="color: ${wrColor}">${winRate}%</span>
          </div>
        </div>
      </div>
    `
  }).join('')
}

// ================================
// RENDER — Recent Matches
// ================================
function renderMatches(matches) {
  const list = document.getElementById('matches-list')

  list.innerHTML = matches.slice(0, 5).map(match => {
    const result   = match.radiant_win === (match.player_slot < 128) ? 'WIN' : 'LOSS'
    const color    = result === 'WIN' ? 'var(--win)' : 'var(--loss)'
    const duration = Math.floor(match.duration / 60) + 'm'

    return `
      <div class="match-row">
        <span class="match-result" style="color: ${color}">${result}</span>
        <span class="match-kda">${match.kills} / ${match.deaths} / ${match.assists}</span>
        <span class="match-duration">${duration}</span>
      </div>
    `
  }).join('')
}