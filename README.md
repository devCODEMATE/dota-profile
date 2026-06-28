# 🎮 Dota 2 Profile Search

A personal stats landing page for Dota 2 players, built with vanilla HTML, CSS and JavaScript. Powered by the OpenDota API.

🔗 **Live demo:** https://devcodemate.github.io/dota-profile/

---

## 📸 Preview

> Search any player by Steam ID and instantly see their stats, top heroes and recent matches.

---

## ✨ Features

- 🔍 **Search any player** by Steam ID
- 📊 **Player stats** — total matches, win rate, wins and losses
- 🦸 **Top 5 heroes** with full artwork, games played and win rate
- 🕹️ **Recent matches** — result, KDA and duration
- ⚡ **Loading spinner** while data loads
- 📱 **Fully responsive** — works on mobile, tablet and desktop
- 🎨 **Custom design system** with CSS variables

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic structure |
| CSS3 | Custom design system, CSS variables, responsive layout |
| Vanilla JavaScript | DOM manipulation, async/await, fetch API |
| OpenDota API | Real player data |
| GitHub Pages | Free hosting and deployment |

---

## 🚀 How to run locally

```bash
# 1. Clone the repository
git clone https://github.com/devCODEMATE/dota-profile.git

# 2. Open the project
cd dota-profile

# 3. Open index.html in your browser
# No build tools or dependencies needed!
```

---

## 📁 Project Structure

---

## 🔌 API Reference

This project uses the [OpenDota API](https://docs.opendota.com/) — free, no API key required.

| Endpoint | Usage |
|---|---|
| `/players/{id}` | Player profile and avatar |
| `/players/{id}/wl` | Win/loss record |
| `/players/{id}/heroes` | Hero stats sorted by games |
| `/players/{id}/recentMatches` | Last matches |
| `/heroes` | Full hero list with names |

---

## 🧠 What I learned building this

- Professional folder structure for web projects
- Git workflow with branches, commits and pull requests
- How to consume a REST API with `fetch` and `async/await`
- CSS custom properties (variables) for a consistent design system
- Responsive design with media queries
- Deploying a static site with GitHub Pages
- How to resolve merge conflicts

---

## 👩‍💻 Author

**devCODEMATE**
- GitHub: [@devCODEMATE](https://github.com/devCODEMATE)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).