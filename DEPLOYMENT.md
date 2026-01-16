# Deployment Guide for Calendly Clone

This guide covers how to:
1.  Upload your code to **GitHub**.
2.  Deploy the Database and Backend to **Render**.
3.  Deploy the Frontend to **Vercel**.

---

## Part 1: GitHub Setup

1.  **Initialize Git** (if you haven't already):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repository on GitHub**:
    *   Go to [GitHub.com](https://github.com) and sign in.
    *   Click the **+** icon in the top right -> **New repository**.
    *   Name it `calendly-clone`.
    *   Make sure it is **Public**.
    *   Click **Create repository**.

3.  **Push Code**:
    *   Copy the commands under "…or push an existing repository from the command line". They will look like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/calendly-clone.git
    git branch -M main
    git push -u origin main
    ```
    *   Run these commands in your terminal.

---

## Part 2: Backend + Database (Render)

We will use **Render** (render.com) for both the Database and Backend.

1.  **Sign up / Login to Render** using GitHub.

2.  **Create Database**:
    *   Click **New +** -> **PostgreSQL**.
    *   Name: `calendly-db`.
    *   Instance Type: **Free**.
    *   Click **Create Database**.
    *   **Wait** 1-2 mins.
    *   Copy the **Internal DB URL** (for backend) and **External DB URL** (for local access/debugging).

3.  **Create Backend Service**:
    *   Click **New +** -> **Web Service**.
    *   Select **Build and deploy from a Git repository**.
    *   Connect your `calendly-clone` repo.
    *   **Settings**:
        *   Name: `calendly-backend`
        *   Root Directory: `backend`
        *   Runtime: **Node**
        *   Build Command: `npm install`
        *   Start Command: `node src/server.js`
        *   Instance Type: **Free**
    *   **Environment Variables**:
        *   `DATABASE_URL` = (Paste **Internal DB URL**)
        *   `NODE_ENV` = `production`
    *   Click **Create Web Service**.

4.  **Initialize Database Schema**:
    *   Once the service is created, go to the **Shell** tab on the left.
    *   Run: `npm run db:init`
    *   This creates the tables in your live database.

5.  **Get Backend URL**:
    *   Once deployed, copy the URL from the top left (e.g., `https://calendly-backend-xyz.onrender.com`).

---

## Part 3: Frontend (Vercel)

1.  **Sign up / Login to Vercel** using GitHub.

2.  **Add New Project**:
    *   Import `calendly-clone`.

3.  **Configure**:
    *   **Root Directory**: Click Edit -> Select `frontend`.
    *   **Environment Variables**:
        *   `VITE_API_URL` = (Paste your **Render Backend URL**)
            *   *Note: Ensure no trailing slash `/` unless your code expects it.*
    *   Click **Deploy**.

4.  **Done!**
    *   Your app is live.

---

## Part 4: Final Submission

Submit these links:
1.  **GitHub Repo**: `https://github.com/YOUR_USERNAME/calendly-clone`
2.  **Live App**: `https://calendly-clone-vinay.vercel.app`
