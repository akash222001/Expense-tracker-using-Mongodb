# Expense Tracker App

A full-stack, enterprise-ready Expense Tracker application developed using Node.js, Express.js, and MongoDB. This system offers robust financial tracking capabilities with premium features such as leaderboard access and expense downloading, securely powered by JSON Web Tokens (JWT) and Razorpay integration.

## 🚀 Key Features

*   **User Authentication & Security**: 
    - Secure Signup and Login functionality.
    - Passwords encrypted via `bcrypt`.
    - Protected API routes authorized using `jsonwebtoken` (JWT).
    - Hardened API security using `helmet` and CORS policies.
*   **Expense Management**:
    - Add, Read, Delete, and Manage daily expenses effortlessly.
    - Categorize expenses (e.g., Food, Housing, Education, Entertainment, etc.).
    - Robust server-side and client-side pagination (View 5, 10, 20, 50 expenses per page).
*   **Premium Membership (Razorpay API)**:
    - Users can securely purchase a "Premium Membership" via Razorpay interface.
    - **Premium Perks:**
        - **Leaderboards**: Get a ranked view of all users and their total expense tallies.
        - **Reports Download**: Export and download historical expenses as files using the AWS SDK integration.
*   **Password Recovery**:
    - Secure "Forgot Password" flow utilizing transactional email services (`SendGrid`/`sib-api-v3-sdk`).

## 🛠️ Technology Stack

**Frontend (Client Side):**
- HTML5, CSS3, Vanilla JavaScript
- Bootstrap 5 (Responsive UI/UX)
- Axios (HTTP client for robust API interactions)
- Razorpay Checkout SDK

**Backend (Server Side):**
- Node.js & Express.js (REST API Structure)
- MongoDB & Mongoose (NoSQL Database and ODM)
- JWT (Authentication) & Bcrypt (Password Hashing)
- Razorpay (Payment Gateway)
- AWS SDK & SendGrid / SibAPI (Advanced cloud/email services)

**Server Utilities:**
- `morgan` (HTTP request logging)
- `helmet` (Security headers)
- `compression` (Response payload optimization)
- `dotenv` (Environment variable management)

## 📁 Project Structure

```text
Expense Tracker/
├── Backend/
│   ├── app.js                 # Express server & Middleware setup
│   ├── controllers/           # API Logic (user, expense, purchase, premium)
│   ├── models/                # Mongoose Database Schemas (User, Expense, Order, etc.)
│   ├── routes/                # Express Route handlers
│   ├── util/                  # DB connection and config files
│   └── .env                   # Environment configurations
│
└── Frontend/
    ├── index.html / .js       # Main Application / Dashboard
    ├── login.html / .js       # Login Interface
    ├── signup.html / .js      # Registration Interface
    └── forgot.html / .js      # Password Recovery Interface
```

## ⚙️ Installation & Operation

1. **Clone the repository.**
2. **Navigate to the Backend directory:**
    ```bash
    cd Backend
    ```
3. **Install exact dependencies:**
    ```bash
    npm install
    ```
4. **Environment Setup:** 
    Ensure you configure your `.env` file correctly:
    ```env
    PORT=3000
    MONGO_URL=mongodb+srv://<username>:<password>@cluster...
    RAZORPAY_KEY_ID=<your-razorpay-key>
    RAZORPAY_KEY_SECRET=<your-razorpay-secret>
    TOKEN_SECRET=secretCode
    # Configure AWS and Email provider environment keys
    ```
5. **Start the Development Server:**
    ```bash
    npm start         # Runs with nodemon (Auto-restart)
    # OR
    npm run start-server
    ```
6. **Access the Application:** Open `Frontend/login.html` directly in your browser or run through a local live server.

## 📝 License

Distributed under the ISC License. See `package.json` for details.
