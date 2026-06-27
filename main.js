// ================================
// CONFIG
// ================================
const PLAYER_ID = '50491386'
const BASE_URL = 'https://api.opendota.com/api'

// ================================
// FETCH DATA FROM API
// ================================
async function loadProfile() {
  try {

    const [playerRes, wlRes, heroesRes, matchesRes, heroListRes] = await Promise.all([
      fetch(`${BASE_URL}/players/${PLAYER_ID}`),
      fetch(`${BASE_URL}/players/${PLAYER_ID}/wl`),
      fetch(`${BASE_URL}/players/${PLAYER_ID}/heroes?sort=games`),
      fetch(`${BASE_URL}/players/${PLAYER_ID}/recentMatches`),
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

  } catch (error) {
    console.error('Error loading data:', error)
  }
}

// ================================
// RENDER — Header
// ================================
function renderProfile(player) {
  const name   = player.profile.personaname
  const avatar = player.profile.avatarfull

  document.getElementById('player-name').textContent = name
  document.getElementById('player-avatar').src = avatar
  document.getElementById('player-rank').textContent = 'Evolution'
}

// ================================
// RENDER — Stats bar
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
    heroMap[h.id] = h.localized_name
  })

  const validHeroes = heroes.filter(h => h.games > 0).slice(0, 5)

  grid.innerHTML = validHeroes.map(hero => {
    const winRate = ((hero.win / hero.games) * 100).toFixed(1)
    const name    = heroMap[hero.hero_id] || 'Unknown'
    const imgUrl  = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${hero.hero_id}.png`

    return `
      <div class="hero-card">
        <img 
          src="${imgUrl}" 
          alt="${name}"
          onerror="this.style.display='none'"
        />
        <div class="hero-card__name">${name}</div>
        <div class="hero-card__stats">
          <span class="hero-card__games">${hero.games} games</span>
          <span class="hero-card__wr">${winRate}%</span>
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
    const kills    = match.kills
    const deaths   = match.deaths
    const assists  = match.assists
    const duration = Math.floor(match.duration / 60) + 'm'

    return `
      <div class="match-row">
        <span class="match-result" style="color: ${color}">${result}</span>
        <span class="match-kda">${kills} / ${deaths} / ${assists}</span>
        <span class="match-duration">${duration}</span>
      </div>
    `
  }).join('')
}

// ================================
// INIT
// ================================
loadProfile()

// Esconder el loader cuando todo cargó
document.getElementById('loader').classList.add('hidden')