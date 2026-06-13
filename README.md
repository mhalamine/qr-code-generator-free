# ✨ QR Code Generator — Free & Open Source

> A **premium, fully client-side** QR Code Generator with deep customization, bilingual support (English 🇺🇸 / Arabic 🇸🇦), and a Cyber-Glass UI. No server. No tracking. Your data never leaves your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 🚀 Features

### 🎨 Rich QR Customization
- **Module Shapes**: Square, Dots, Rounded, Extra-Rounded, Classy, Classy-Rounded
- **Finder Pattern Styles**: Custom outer frames & inner eye shapes (Square, Dot, Rounded)
- **Color Control**: Solid colors **or** Linear/Radial gradients with angle & multi-stop support
- **Logo Overlay**: Upload PNG, JPG, SVG, or WebP — auto-resized with padding control (capped at 30% to ensure scannability)
- **Design Presets**: Save and reuse your favorite style configurations instantly

### 📋 Supported QR Types
| Type | Details |
|------|---------|
| 🔗 **URL / Link** | Any URL with format validation |
| 📶 **WiFi** | SSID, Password, Security (WPA/WEP/Open), Hidden network |
| 📝 **Plain Text** | Free-form text |
| 👤 **vCard (Business Card)** | Name, Phone, Email, Organization, Job Title, Website, Address |

### 💾 Local-First Storage
- **History**: All generated QR codes saved to `localStorage` — reload or re-download any past creation
- **Logos**: Cached in **IndexedDB** to handle large file sizes gracefully
- **Preferences**: Remembers your language and theme choice between sessions

### 🌐 Bilingual & RTL Ready
- Full **English (LTR)** and **Arabic (RTL)** support — including flipped icons and adapted typography
- English: `Outfit` font | Arabic: `Cairo` font
- Instant language switching with no page reload

### 🌗 Light / Dark Mode
- Smooth toggle between a neon **Dark** Cyber-Glass theme and a soft **Light** pastel theme
- Respects your OS `prefers-color-scheme` on first visit

### 📤 Export Options
- **SVG** (vector — infinitely scalable)
- **PNG** (raster — ready for sharing)
- **Copy to Clipboard** (Web Clipboard API)
- **Web Share API** for native mobile sharing

---

## 🛡️ Privacy First

> **Zero server communication.** All QR generation, logo processing, history management, and exports happen entirely inside your browser. No analytics. No trackers. No data sent anywhere.

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Vite-based) |
| Styling | Vanilla CSS + CSS Custom Properties |
| QR Engine | [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) |
| Storage | `localStorage` + IndexedDB |
| State | React Context + Hooks |
| Build Tool | Vite 8 |

---

## 📁 Project Structure

```
qr-code-generator-free/
├── .agents/                    # AI Agent definitions & skills
│   ├── agents.md               # Autonomous dev team roles (PM, Engineer, QA, DevOps)
│   ├── skills/                 # Agent skill playbooks
│   │   ├── write_specs.md
│   │   ├── generate_code.md
│   │   ├── audit_code.md
│   │   ├── deploy_app.md
│   │   └── deploy_cloud_run.md
│   └── workflows/              # Automated pipeline triggers
├── app_build/                  # React application source
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css           # Global design tokens & glassmorphism styles
│       ├── components/
│       │   ├── QRPreview.jsx   # Live QR canvas + export actions
│       │   ├── QRForm.jsx      # Dynamic input form per QR type
│       │   ├── Customizer.jsx  # Shapes, colors & logo upload panel
│       │   ├── History.jsx     # Local history & design presets
│       │   ├── LanguageToggle.jsx
│       │   └── ThemeToggle.jsx
│       ├── hooks/
│       │   └── useLocalStorage.js
│       └── utils/
│           ├── db.js           # IndexedDB helper
│           ├── translations.js # EN/AR dictionary
│           ├── presets.js      # Built-in visual presets
│           └── vcard.js        # vCard formatter
└── production_artifacts/
    └── Technical_Specification.md
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Installation & Dev Server

```bash
# 1. Clone the repo
git clone https://github.com/mhalamine/qr-code-generator-free.git
cd qr-code-generator-free

# 2. Install dependencies
cd app_build
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# Output will be in app_build/dist/
```

### Preview Production Build

```bash
npm run preview
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

## 🙏 Acknowledgements

- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — the powerful QR rendering engine powering this app
- [Vite](https://vitejs.dev/) — lightning-fast build tooling
- [React](https://react.dev/) — reactive UI framework

---

<p align="center">
  Made with ❤️ — No servers harmed in the making of this QR code.
</p>
