# CampusAssist

### AI-Powered College Information Assistant

---

## 📖 Overview

CampusAssist is a web-based AI-powered platform designed to help students easily access college-related information through a modern website and conversational AI assistant.

Many important details about the college are either difficult to find or scattered across multiple sources such as notice boards, faculty offices, PDFs, websites, and administrative departments.

CampusAssist aims to solve these problems by providing a centralized information system combined with an intelligent AI assistant.

---

## ❗ Problem Statement

Students frequently struggle with:

* Understanding the admission process
* Finding required admission documents
* Locating classrooms and laboratories
* Identifying teachers and faculty members
* Understanding department information
* Accessing syllabus and subject information
* Learning college rules and uniform policies
* Finding library information and timings
* Accessing important notices and events

Information often exists but is not easily accessible.

---

## 🎯 Project Goal

To create an AI-powered college guidance platform that:

* Provides centralized college information
* Assists new students during admission and initial college days
* Reduces dependency on manual inquiries
* Supports natural language conversations
* Provides multilingual assistance
* Can be expanded in the future using document intelligence (RAG)

---

## ✨ Key Features

### College Information Portal

Provides information about:

* Departments
* Faculty Members
* Laboratories
* Classrooms
* Library
* Events
* College Rules
* Uniform Guidelines
* Admission Procedures
* Subjects and Syllabus

---

### AI Assistant

Students can ask questions naturally.

**Examples:**

* Where is the Computer Lab?
* Who teaches Data Structures?
* What is the admission process?
* What are the college timings?
* Where can I find the library?

The assistant responds in a conversational manner.

---

### FAQ System

Frequently Asked Questions will be available for quick access.

**Examples:**

* Library Timings
* Admission Process
* Uniform Rules
* Contact Information
* Department Details

FAQs reduce unnecessary AI requests and improve performance.

---

### Admin Dashboard

Administrators can:

* Add Departments
* Manage Faculty Information
* Upload Images
* Manage Events
* Manage FAQs
* Update College Information

---

### Multilingual Support

Supported Languages:

* English
* Hindi

Future versions may support additional regional languages.

---

## 🛠 Technology Stack

| Technology                    | Purpose                     |
| ----------------------------- | --------------------------- |
| React.js                      | Frontend Development        |
| CSS                           | Styling & Responsive Design |
| Node.js                       | Backend Development         |
| Express.js                    | API Management              |
| Firebase Storage              | Image & File Storage        |
| Google Gemini API             | AI Assistant                |
| JSON Database (Initial Phase) | Store College Information   |

---

## ⚙️ System Workflow

```text
User Question
       │
       ▼
FAQ Match Found?
       │
  Yes ─┴─► Show FAQ Answer
       │
      No
       ▼
Search Database
       │
       ▼
Answer Found?
       │
  Yes ─┴─► Generate Response
       │
      No
       ▼
Gemini AI
       │
       ▼
Return Response
```

### Why Hybrid Search?

Using AI for every question is expensive and consumes API limits..

Example:

**Question:**
Where is the library?

Instead of calling Gemini, the system can directly fetch the answer from the database:

> The library is located on the first floor of the Academic Block.

This improves speed and reduces API costs.

---


## 📂 Project Structure

```text
ai-campus-companion/
│
├── frontend/
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── index.html
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── logos/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Footer.css
│   │   │   │
│   │   │   ├── Chatbot/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── PromptSuggestions.jsx
│   │   │   │   └── Chatbot.css
│   │   │   │
│   │   │   ├── DepartmentCard/
│   │   │   │   ├── DepartmentCard.jsx
│   │   │   │   └── DepartmentCard.css
│   │   │   │
│   │   │   ├── FacultyCard/
│   │   │   │   ├── FacultyCard.jsx
│   │   │   │   └── FacultyCard.css
│   │   │   │
│   │   │   ├── EventCard/
│   │   │   │   ├── EventCard.jsx
│   │   │   │   └── EventCard.css
│   │   │   │
│   │   │   └── SearchBar/
│   │   │       ├── SearchBar.jsx
│   │   │       └── SearchBar.css
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── DepartmentDetails.jsx
│   │   │   ├── Faculty.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── chatbotService.js
│   │   │   ├── departmentService.js
│   │   │   ├── facultyService.js
│   │   │   ├── eventService.js
│   │   │   └── uploadService.js
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── variables.css
│   │   │   └── animations.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebase.js
│   │   │   ├── gemini.js
│   │   │   └── database.js
│   │   │
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── data/
│   │   ├── uploads/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── rag/
│   ├── pdfReader.js
│   ├── docReader.js
│   ├── chunker.js
│   ├── embeddingService.js
│   ├── vectorStore.js
│   ├── retrievalService.js
│   └── indexingService.js
│
├── docs/
│   ├── ProjectReport.pdf
│   ├── ArchitectureDiagram.png
│   ├── Flowchart.png
│   └── Presentation.pptx
│
├── README.md
├── .gitignore
└── package.json
```


```text
ai-campus-companion/
│
├── frontend/
├── backend/
├── rag/
├── docs/
├── README.md
└── .gitignore
```

---

# 🎨 Frontend Structure

The frontend contains everything visible to users.

```text
frontend/
```

Examples:

* Home Page
* Department Pages
* Faculty Pages
* AI Chat Interface
* Admin Dashboard

---

## public/

Contains static files loaded when the website starts.

```text
public/
├── favicon.ico
├── logo.png
└── index.html
```

### favicon.ico

Browser tab icon.

### logo.png

College logo used throughout the website.

### index.html

Initial HTML page loaded before React starts.

---

## assets/

Stores static resources.

```text
assets/
├── images/
├── icons/
└── logos/
```

Examples:

* College Images
* Department Images
* Icons
* Logos

---

## components/

Reusable UI elements.

```text
components/
├── Navbar/
├── Footer/
├── Chatbot/
├── DepartmentCard/
└── SearchBar/
```

Purpose:

> Write once, use everywhere.

---

## pages/

Contains complete website pages.

Examples:

* Home
* Departments
* Faculty
* Events
* About
* AI Assistant
* Admin Dashboard

---

## services/

Acts as a communication layer between frontend and backend.

Examples:

* Send AI requests
* Fetch departments
* Upload images
* Retrieve events

---

## styles/

Contains CSS files.

Examples:

* Global Styles
* Variables
* Animations

---

# 🧠 Backend Structure

The backend is the brain of the application.

```text
backend/
```

Users never directly interact with it.

---

## server.js

Starts the backend server.

```javascript
app.listen(5000);
```

Meaning:

```text
Backend running on Port 5000
```

---

## routes/

Defines API endpoints.

Examples:

```text
/api/chat
/api/departments
/api/faculty
/api/events
```

Purpose:

Determines where requests should go.

---

## controllers/

Contains business logic.

```text
Route
  ↓
Controller
  ↓
Response
```

Example:

User asks for department information.

Controller processes the request and returns the answer.

---

## services/

Contains integrations and helper logic.

### geminiService.js

Communicates with Gemini API.

### firebaseStorageService.js

Uploads and retrieves files from Firebase Storage.

### searchService.js

Searches FAQs and internal data.

### promptService.js

Manages AI prompts and response formatting.

---

## config/

Stores configuration files.

Examples:

* Firebase Configuration
* Gemini Configuration
* Database Configuration

---

## middleware/

Runs before requests reach controllers.

Examples:

* Error Handling
* File Upload Validation
* Admin Verification

---

## data/

Stores structured information.

Example:

```json
{
  "department": "CSE",
  "hod": "Dr. Sharma"
}
```

Used for:

* Departments
* Faculty
* Labs
* Classrooms
* Events

---

# 📚 Future RAG Module

Current Version:

```text
Database + FAQ + Gemini
```

Future Version:

```text
Database + FAQ + RAG + Gemini
```

---

## Purpose

Enable AI to answer questions directly from:

* PDFs
* DOCX Files
* Notices
* Syllabus Documents
* Rule Books

---

## Components

### pdfReader.js

Extracts text from PDFs.

### docReader.js

Reads DOCX files.

### chunker.js

Splits documents into smaller sections.

### embeddingService.js

Generates embeddings.

### vectorStore.js

Stores embeddings.

### retrievalService.js

Finds relevant document chunks.

### indexingService.js

Indexes newly uploaded documents automatically.

---

# 🚀 Future Enhancements

Possible future improvements:

* Voice Assistant
* Speech-to-Text
* Text-to-Speech
* Mobile Application
* Advanced RAG
* Personalized Student Dashboard
* Timetable Management
* Internship Guidance
* Placement Assistance
* Notification System

---

# 👨‍💻 Team Development Guidelines

1. Keep components reusable.
2. Follow folder structure consistently.
3. Document major changes.
4. Use meaningful file names.
5. Avoid hardcoding data whenever possible.
6. Maintain clean and readable code.
7. Test features before merging.

---

# 🎓 Conclusion

CampusAssist is designed to become a centralized digital assistant for students by combining:

* A modern web platform
* Structured college information
* FAQ-based retrieval
* AI-powered guidance

The project aims to improve accessibility, reduce confusion among students, and provide a scalable foundation for future intelligent campus services.

---

## Developed Using

* React.js
* Node.js
* Express.js
* Firebase Storage
* Google Gemini API
* CSS

---

**Project Status:** Planning & Development Phase 🚧
