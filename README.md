# akkidroid.github.io

Welcome to my personal portfolio website repository. This project showcases my cybersecurity journey, Security Operations Center (SOC) capabilities, certifications, and project portfolio in an aggressive, dark, SOC-console inspired visual style.

## Live Website

Visit: [akkidroid.github.io](https://akkidroid.github.io)

## About

I am **Akshay Koshti**, currently working as a **Deputy Manager | Cybersecurity** in Ahmedabad, Gujarat, India.  
This portfolio highlights my work in:

- Security Operations and Blue Team defense
- SIEM and EDR operations
- Threat intelligence and EASM investigations
- Incident response simulation and cyber readiness programs

## Key Technologies Used

This portfolio is developed using:

- **HTML5** for semantic page structure
- **CSS3** (custom properties, Grid, Flexbox, responsive media queries)
- **Vanilla JavaScript (ES6+)** for dynamic UI interactions
- **SVG graphics** for SOC-themed visuals and project artwork
- **Google Fonts** (`Oxanium`, `Space Grotesk`) for visual identity
- **FormSubmit** for static contact form email delivery
- **CountAPI + owner mode** for visitor tracking without backend hosting
- **GitHub Pages** for static deployment

## Features

- Dark, cyber-security themed SOC console interface
- Animated SOC pre-loader with live world-map style attack activity
- Auto-rotating categorized tool wall
- Auto-rotating project carousel (Academic and Work)
- Dynamic experience and portfolio metric counters
- Fully responsive design (desktop, tablet, and mobile)
- Static-hosting friendly architecture (no build step)

## Repository Structure

```text
akshay-cyber-portfolio/
├── .nojekyll
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── script.js
    │   └── analytics.js
    ├── docs/
    │   ├── akshay_resume.pdf
    │   └── certificates/
    └── img/
        ├── profile.jpg
        ├── ak-mark.svg
        ├── projects/
        └── tool-logos/
```

## Run Locally

```powershell
cd "D:\Codex Project\HR\akshay-cyber-portfolio"
python -m http.server 8080
```

Open: `http://localhost:8080`

## GitHub Pages Deployment

1. Push this project to your GitHub repository root.
2. Open **Settings -> Pages**.
3. Under source, select **Deploy from a branch**.
4. Choose branch **main** and folder **/(root)**.
5. Save and wait for publishing to complete.

No build process is required.

## Private Visitor Tracking (Owner Only)

Visitor tracking is enabled via `CountAPI` in `assets/js/analytics.js`.

- Visitors do **not** see the count on the website.
- You can enable owner-only count view in your browser:

```js
localStorage.setItem("ak_owner_view", "1");
location.reload();
```

- To disable owner view:

```js
localStorage.removeItem("ak_owner_view");
location.reload();
```

This keeps the UI clean for users while giving you direct access to portfolio traffic count.
