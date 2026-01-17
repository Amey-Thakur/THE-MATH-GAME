<div align="center">

  <a name="readme-top"></a>
  # The Math Game

  [![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)
  ![Status](https://img.shields.io/badge/Status-Completed-success)
  [![Technology](https://img.shields.io/badge/Technology-HTML5%20%7C%20JavaScript-orange)](https://github.com/Amey-Thakur/THE-MATH-GAME)
  [![Developed by Amey Thakur and Mega Satish](https://img.shields.io/badge/Developed%20by-Amey%20Thakur%20%26%20Mega%20Satish-blue.svg)](https://github.com/Amey-Thakur/THE-MATH-GAME)

  A simple, interactive multiplication game designed to test and improve arithmetic skills through rapid-fire problem solving.

  **[Source Code](Source%20Code/)** &nbsp;·&nbsp; **[Technical Specification](docs/SPECIFICATION.md)** &nbsp;·&nbsp; **[Live Demo](https://amey-thakur.github.io/THE-MATH-GAME/)**

</div>

---

<div align="center">

  [Authors](#authors) &nbsp;·&nbsp; [Overview](#overview) &nbsp;·&nbsp; [Features](#features) &nbsp;·&nbsp; [Structure](#project-structure) &nbsp;·&nbsp; [Results](#results) &nbsp;·&nbsp; [Quick Start](#quick-start) &nbsp;·&nbsp; [Usage Guidelines](#usage-guidelines) &nbsp;·&nbsp; [License](#license) &nbsp;·&nbsp; [About](#about-this-repository) &nbsp;·&nbsp; [Acknowledgments](#acknowledgments)

</div>

---

<!-- AUTHORS -->
<div align="center">

  <a name="authors"></a>
  ## Authors

  **Terna Engineering College | Computer Engineering | Batch of 2022**

| <a href="https://github.com/Amey-Thakur"><img src="https://github.com/Amey-Thakur.png" width="150" height="150" alt="Amey Thakur"></a><br>[**Amey Thakur**](https://github.com/Amey-Thakur)<br><br>[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5644--1575-green.svg)](https://orcid.org/0000-0001-5644-1575) | <a href="https://github.com/msatmod"><img src="Mega/Mega.png" width="150" height="150" alt="Mega Satish"></a><br>[**Mega Satish**](https://github.com/msatmod)<br><br>[![ORCID](https://img.shields.io/badge/ORCID-0000--0002--1844--9557-green.svg)](https://orcid.org/0000-0002-1844-9557) |
| :---: | :---: |

</div>

> [!IMPORTANT]
> ### 🤝🏻 Special Acknowledgement
> *Special thanks to **[Mega Satish](https://github.com/msatmod)** for her meaningful contributions, guidance, and support that helped shape this work.*

---

<!-- OVERVIEW -->
<a name="overview"></a>
## Overview

**The Math Game** is an educational interface designed to facilitate arithmetic learning through structured repetition and positive reinforcement. The application serves as a digital sandbox for mastering multiplication, providing a low-stress environment for skill acquisition.

### HMI Principles
The development of this interface was guided by core **Human-Machine Interaction** paradigms:
*   **Learnability**: The interface uses standard UI patterns (multiple choice) that require no prior training, allowing users to start "learning by doing" immediately.
*   **Error Recovery**: The system provides clear, non-punitive feedback for incorrect answers, encouraging an iterative process where errors are treated as learning opportunities rather than failures.

> [!TIP]
> **Aesthetic-Usability Effect**
>
> The design utilizes a skeuomorphic "chalkboard" background not just for style, but to invoke the **Aesthetic-Usability Effect**. By triggering the user's existing mental association with a classroom setting, the interface inherently signals "learning mode," priming the user for educational interaction and increasing tolerance for minor errors during the learning curve.

---

<!-- FEATURES -->
<a name="features"></a>
## Features

| Feature | Description |
|---------|-------------|
| **Gamified Drills** | Randomized multiplication challenges designed to test **instant recall**. |
| **Real-Time Scoring** | Dynamic score tracking with **integrated penalty logic** for incorrect attempts. |
| **Time-Pressure** | Strictly timed 60-second rounds to induce **cognitive flow state**. |
| **Binary Feedback** | Instantaneous visual validation (Green/Red) providing **immediate learning reinforcement**. |
| **Adaptive UI** | Fully **responsive glassmorphic interface** optimized for mobile, tablet, and desktop. |
| **Social Sharing** | Integrated **high-fidelity image generation** for sharing scores via custom digital cards. |

> [!NOTE]
> ### Interactive Polish: The Commutative Singularity
> We have embedded a **physics-driven atmospheric layer** ("Math Atmosphere") that renders floating mathematical symbols to create a dynamic visual depth. Additionally, the footer features a **"Commutative Singularity" event**: hovering over the author names triggers a quantum-tunneling animation where the names physically swap positions, playfully demonstrating the commutative property of multiplication ($A \times B = B \times A$) within the UI itself.

### Tech Stack
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Logic**: Vanilla JS (DOM Manipulation & Game Loop)
- **Imaging**: **html2canvas** (Client-side localized capture engine)
- **UI System**: Custom Vanilla CSS3 (Neon Glassmorphism & Animations)
- **Deployment**: GitHub Actions (Staging & Continuous Delivery Workflow)
- **Hosting**: GitHub Pages

---

<!-- STRUCTURE -->
<a name="project-structure"></a>
## Project Structure

```python
THE-MATH-GAME/
│
├── .github/                         # GitHub Actions & Automation
│   └── workflows/
│       └── deploy.yml               # Automated Staging & Deployment Flow
│
├── docs/                            # Technical Documentation
│   └── SPECIFICATION.md             # Architecture & Design Specification
│
├── Mega/                                                         # Archival Attribution Assets
│   ├── Filly.jpg                                                 # Companion (Filly)
│   └── Mega.png                                                  # Author Profile Image (Mega Satish)
│
├── Source Code/                     # Primary Application Layer
│   ├── styling.css                  # Game Visuals
│   ├── javascript.js                # Game Logic
│   ├── images/                      # Game Assets
│   └── index.html                   # Game Entry Point
│
├── .gitattributes                   # Git configuration
├── CITATION.cff                     # Scholarly Citation Metadata
├── codemeta.json                    # Machine-Readable Project Metadata
├── LICENSE                          # MIT License Terms
├── README.md                        # Comprehensive Archival Entrance
└── SECURITY.md                      # Security Policy & Protocol
```

---

<!-- RESULTS -->
<a name="results"></a>
## Results

<div align="center">
  <b>Game Start Screen</b>
  <br><br>
  <img src="https://user-images.githubusercontent.com/54937357/154539531-9b586eed-c2d0-44f4-8e8d-a0c00fd66b95.png" alt="Start Screen" width="80%">
  <br><br>

  <b>Gameplay - Correct Answer Feedback</b>
  <br><br>
  <img src="https://user-images.githubusercontent.com/54937357/154540683-a58dad77-dabd-4bbe-bab4-59af34f2e9d1.png" alt="Correct Answer" width="80%">
  <br><br>

  <b>Game Over Summary</b>
  <br><br>
  <img src="https://user-images.githubusercontent.com/54937357/154540932-927369bf-1e9c-4419-8dd1-c734dae04317.png" alt="Game Over" width="80%">
</div>

---

<!-- QUICK START -->
<a name="quick-start"></a>
## Quick Start

### 1. Prerequisites
- **Browser**: Any modern standards-compliant web browser (Chrome, Firefox, Edge, Safari).
- **Environment**: No server-side runtime is required; this is a static client-side application.

> [!WARNING]
> **Local Execution**
>
> While the project can be executed by opening `index.html` directly, certain features may require an active internet connection to resolve external libraries correctly.

### 2. Setup & Deployment
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Amey-Thakur/THE-MATH-GAME.git
    cd THE-MATH-GAME
    ```
2.  **Launch**:
    Open `Source Code/index.html` in your preferred browser.

---

<!-- =========================================================================================
                                     USAGE SECTION
     ========================================================================================= -->
## Usage Guidelines

This repository is openly shared to support learning and knowledge exchange across the academic community.

**For Students**  
Use this project as reference material for understanding interactive system design, web development patterns, and Human Machine Interaction principles. The source code is available for study to facilitate self-paced learning and exploration of user-centric design patterns.

**For Educators**  
This project may serve as a practical lab example or supplementary teaching resource for Human Machine Interaction and Human Machine Interaction Laboratory courses (`CSC801` & `CSL801`). Attribution is appreciated when utilizing content.

**For Researchers**  
The documentation and design approach may provide insights into academic project structuring and interactive web application development.

---

<!-- LICENSE -->
<a name="license"></a>
## License

This repository and all its creative and technical assets are made available under the **MIT License**. See the [LICENSE](LICENSE) file for complete terms.

> [!NOTE]
> **Summary**: You are free to share and adapt this content for any purpose, even commercially, as long as you provide appropriate attribution to the original authors.

Copyright © 2022 Amey Thakur & Mega Satish

---

<!-- ABOUT -->
<a name="about-this-repository"></a>
## About This Repository

**Created & Maintained by**: [Amey Thakur](https://github.com/Amey-Thakur) & [Mega Satish](https://github.com/msatmod)  
**Academic Journey**: Bachelor of Engineering in Computer Engineering (2018-2022)  
**Institution**: [Terna Engineering College](https://ternaengg.ac.in/), Navi Mumbai  
**University**: [University of Mumbai](https://mu.ac.in/)

This project features **The Math Game**, developed as a **Human Machine Interaction** project during the **8th Semester Computer Engineering** curriculum. It aims to make learning arithmetic fun and interactive through web technology.

**Connect:** [GitHub](https://github.com/Amey-Thakur) &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/amey-thakur) &nbsp;·&nbsp; [ORCID](https://orcid.org/0000-0001-5644-1575)

### Acknowledgments

Grateful acknowledgment to [**Mega Satish**](https://github.com/msatmod) for her exceptional collaboration and scholarly partnership during the development of this arithmetic game project. Her constant support, technical clarity, and dedication to software quality were instrumental in achieving the system's functional objectives. Learning alongside her was a transformative experience; her thoughtful approach to problem-solving and steady encouragement turned complex requirements into meaningful learning moments. This work reflects the growth and insights gained from our side-by-side academic journey. Thank you, Mega, for everything you shared and taught along the way.

Grateful acknowledgment to the faculty members of the **Department of Computer Engineering** at Terna Engineering College for their guidance and instruction in Human Machine Interaction. Their expertise and support helped develop a strong understanding of interactive system design.

Special thanks to the **mentors and peers** whose encouragement, discussions, and support contributed meaningfully to this learning experience.

---

<div align="center">

  [↑ Back to Top](#readme-top)

  [Authors](#authors) &nbsp;·&nbsp; [Overview](#overview) &nbsp;·&nbsp; [Features](#features) &nbsp;·&nbsp; [Structure](#project-structure) &nbsp;·&nbsp; [Results](#results) &nbsp;·&nbsp; [Quick Start](#quick-start) &nbsp;·&nbsp; [Usage Guidelines](#usage-guidelines) &nbsp;·&nbsp; [License](#license) &nbsp;·&nbsp; [About](#about-this-repository) &nbsp;·&nbsp; [Acknowledgments](#acknowledgments)

  <br>

  🔬 **[Human Machine Interaction Laboratory](https://github.com/Amey-Thakur/HUMAN-MACHINE-INTERACTION-AND-HUMAN-MACHINE-INTERACTION-LAB)** &nbsp; · &nbsp; 🧮 **[THE-MATH-GAME](https://amey-thakur.github.io/THE-MATH-GAME)**

  ---

  ### 🎓 [Computer Engineering Repository](https://github.com/Amey-Thakur/COMPUTER-ENGINEERING)

  **Computer Engineering (B.E.) - University of Mumbai**

  *Semester-wise curriculum, laboratories, projects, and academic notes.*

</div>
