# Blog Platform

A modern, full-featured blogging platform where users can create posts, interact socially, and manage personalized profiles.

## ✨ Key Features

### 🔐 Authentication

* User registration with email verification
* Secure login & logout
* Password reset via email
* Token-based session management

### ✍️ Blog Management

* Create, edit, delete blog posts
* Draft system
* Categories & tags
* Featured images
* Rich text editor
* SEO fields (meta description, keywords)

### 💬 Social Interaction

#### Likes & Reactions

* Like/dislike posts
* Real-time counters
* Track user reactions
* Toggle/change reaction

#### Comment System

* Add and reply to comments (threaded)
* Edit/delete own comments
* Author notifications
* Moderation tools for post owners

### 👤 User Profiles

* Profile page with avatar, bio, social links
* Activity feed (posts & comments)
* Statistics (posts, comments, likes)
* Privacy settings
* Profile editing

### 📄 Informational Pages

* **About Us**
* **FAQ**
* **Contact Form** (support email, social links, response details)

## 🛠️ Tech Stack

* **Frontend:** React/Vue, HTML5, CSS3, JavaScript
* Responsive UI
* Rich text editor
* Image storage (S3/Cloudinary)
* Email services (SendGrid/Mailgun)

## 🚀 Installation

```bash
git clone https://github.com/yourusername/blog-platform.git
cd blog
npm install
cp .env.example .env
npm run migrate
npm run dev
```

## 📘 Usage

1. Register and verify email
2. Login
3. Create and publish posts
4. Like, dislike, and comment
5. Edit your profile
6. Visit FAQ/Contact for help

## 🔌 API Endpoints (Summary)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/forgot-password`

### Posts

* CRUD: `/api/posts`

### Comments

* CRUD & replies: `/api/comments`

### Likes

* Like/dislike/unlike: `/api/posts/:id/*`

### Users

* Profile & avatar upload: `/api/users/:id`

## 🤝 Contributing

1. Fork → Branch → Commit → Push → PR
2. Follow standard commit messages

## 📜 License

MIT License

## 🗺️ Roadmap

* Email notifications
* Post bookmarking
* Advanced search
* Follow system
* Social sharing
* Analytics dashboard
* Mobile apps

## ❤️ Acknowledgments

Thanks to all contributors. Built with passion ☕

---

