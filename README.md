# 🍔 Food AI Kitchen – Full Modular Backend

A comprehensive, production-ready backend for the **Food AI Kitchen** project. Built with **Node.js, Express, and Firebase**, powered by **OpenAI & Gemini**.

---

## 📂 Module Breakdown

### 🛠️ Core AI (Unified)
- `/lib/aiClient.js`: Centralized switching logic for OpenAI and Gemini.

### 🧾 Phase 1: Must Build (Core MVP)
- **AI Chat Module** (`/modules/chat`): Chat-based food assistant.
- **Ingredient AI Module** (`/modules/ingredient-ai`): The heart of the app. Converts ingredients to recipes.
- **Recipe Display**: Clean formatting for AI results.

### 🔒 Phase 2: Save & Personalized
- **Auth Module** (`/modules/auth`): Firebase Auth & User profiles.
- **Recipes Module** (`/modules/recipes`): DB-based recipe management.
- **History Module** (`/modules/history`): Past searches and AI generated results.
- **Favorites Module** (`/modules/favorites`): Save and like recipes.

### 🍳 Phase 3: Book Cook (USP)
- **Cook Booking Module** (`/modules/booking`): Date/Time selection and members.
- **Admin Dashboard** (`/modules/admin`): Control panel for everything.
- **Planner Module** (`/modules/planner`): Meal planning for the week.

---

## ⚡ API Quick Reference

| Endpoint | Method | Purpose |
| :------- | :----- | :------ |
| `/api/ai/ingredients` | `POST` | Get recipe from ingredients list. |
| `/api/chat/ask` | `POST` | Ask any food-related questions. |
| `/health` | `GET` | Server status check. |

---

## 🚀 Setup & Launch

1.  **Environment Configuration**:
    - Update `.env` with your **OpenAI API Key** and **Gemini API Key**.
    - Ensure your Firebase `service-account.json` is linked in `.env`.
2.  **Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Server**:
    ```bash
    npm run dev
    ```

---

## ☁️ Firebase Structure Suggestion
- **Collection: `recipes`**: Master list of DB recipes.
- **Collection: `user_history`**: Chat logs and AI generations.
- **Collection: `bookings`**: Appointments for "Book a Cook".
- **Collection: `users`**: Metadata, preferences, and dietary restrictions.
