# 🪪 Arsh Ansari: Interactive 3D Physics Lanyard

A high-performance, interactive 3D digital identity component built with **React Three Fiber** and **Rapier Physics**. [cite_start]This project features a custom-simulated lanyard strap and an "Obsidian Glass" ID card with real-time refraction and spatial audio[cite: 5, 71].

---

## 🚀 Technical Highlights (NIT Warangal)

* [cite_start]**Integrated MSc Mathematics (Minor in CSE)**: Current CGPA 8.77[cite: 5, 21].
* [cite_start]**LeetCode Knight**: Top-tier problem solver with a 1821+ rating and 500+ problems solved[cite: 71].
* [cite_start]**CodeChef 4-Star**: Competitive programmer with a peak rating of 1971[cite: 72].
* [cite_start]**Full-Stack Experience**: Software Developer Intern (Rangpatra) and Blockchain Intern (BlockseBlock)[cite: 19, 31].

---

## 💻 Tech Stack & Features

* **Three.js & R3F**: Glass refraction (IOR 1.6) and environment mapping for realistic obsidian textures.
* **Rapier Physics**: Constraint-based rope physics (`useRopeJoint`) and rigid body dynamics.
* **Interactive Flick**: Velocity-based mouse tracking for card tumbling and spinning.
* **Web Audio API**: Procedural "whoosh" sound effects triggered by physical motion.
* **Tailwind CSS**: Matrix-style background and terminal overlay for the portfolio UI.

---

## 🛠️ Installation & Setup

Since this is a **frontend-only** project, follow these steps to run it locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/your-repo-name.git](https://github.com/YOUR_GITHUB_USERNAME/your-repo-name.git)
cd your-repo-name
```
###2. Install Dependencies
```bash
npm install three @types/three @react-three/fiber @react-three/drei @react-three/rapier meshline lucide-react
```
###3. Run the developement
```bash
npm run dev
```

🚢 Deployment to Vercel
This project is optimized for a Zero-Config Vercel Deployment.

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: 3D Lanyard"
git branch -M main
git remote add origin [https://github.com/YOUR_USERNAME/YOUR_REPO.git](https://github.com/YOUR_USERNAME/YOUR_REPO.git)
git push -u origin main
```

2. Connect to Vercel:
    Import the repository on Vercel.
    Leave Build Command and Output Directory as default.
    Click Deploy.


```bash
.
├── src/
│   ├── components/
│   │   ├── Lanyard/
│   │   │   └── Lanyard.jsx      # Core 3D Scene & Physics Logic
│   │   └── Terminal/
│   │       ├── Terminal.jsx     # Terminal UI Component
│   │       └── Terminal.css     # Terminal-specific Animations & Styles
│   ├── App.jsx                  # Main Entry (Combines Lanyard & Terminal)
│   └── index.css                # Global Tailwind & Matrix Background Styles
├── public/                      # Static assets (fonts, icons, etc.)
├── package.json                 # Project Dependencies & Scripts
└── README.md                    # Project Documentation
```

📬 Contact
 
LinkedIn: Arsh Ansari 
Email: arshansari23122003@gmail.com
