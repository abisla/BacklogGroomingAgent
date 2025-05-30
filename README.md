# Strategic Backlog AI

[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Development-yellow?style=for-the-badge)]()

Strategic Backlog AI is a lightweight, high-impact tool designed to automate the backlog grooming process by transforming raw JIRA exports into sprint-ready user stories.

This project simulates how intelligent prioritization, decomposition, and refinement logic can streamline Agile workflows and increase delivery velocity.

---

## Screenshots

### Main Dashboard
![Main Dashboard](https://github.com/user-attachments/assets/c475fcdd-5893-4305-95ff-cb3fd9e542e6)
*Strategic overview of backlog items with AI-powered insights*

### Processing Pipeline
![Processing Pipeline](![c2](https://github.com/user-attachments/assets/e8b6b944-c39a-41a5-a07a-218ce65ca3df)
)
*Real-time AI processing of backlog items*

### Sprint Recommendations
![Sprint Recommendations](![c3](https://github.com/user-attachments/assets/8afed855-7412-481b-89b0-6400d9b0784c)
)
*AI-generated sprint recommendations based on team capacity*

---

## Features

- Parse and ingest raw JIRA CSV exports
- Cluster similar backlog items
- Rewrite vague tasks into clear, actionable user stories
- Generate acceptance criteria aligned to Agile standards
- Score backlog items using ROI, Effort, and Risk metrics
- Recommend sprint candidates based on team capacity and sprint goals
- Export groomed stories in structured format (CSV)

---

## Intended Users

- Business Analysts  
- Product Managers  
- Agile Delivery Teams  
- Project Leads seeking faster sprint prep

---

## How It Works

1. Upload your JIRA backlog (CSV format)
2. Define sprint parameters (goal, capacity)
3. The tool processes and scores each item
4. Rewritten stories and recommendations are displayed in a clear UI
5. Export the sprint-ready backlog for integration with JIRA or planning tools

---

## Demo

Watch the walkthrough: [Loom Video Link]  
Access the working codebase: [GitHub Repository](https://github.com/abisla/strategic-backlog-ai)

---

## Future Work

- LLM integration for dynamic, real-time decomposition
- JIRA API integration for direct syncing
- Vector-based duplicate detection
- Adaptive sprint planning using historical velocity data

---

## Setup Instructions

1. Clone the repo  
```bash
git clone https://github.com/abisla/strategic-backlog-ai.git
cd strategic-backlog-ai
```

2. Install dependencies  
```bash
npm install
```

3. (Optional) Add `.env` with keys if using external APIs  
4. Run the app locally  
```bash
npm run dev
```

---

## License

MIT License. Use and modify freely.

---

## Created by

Amar Bisla  
Business Analyst | AI Workflow Designer | Product Systems Architect 
