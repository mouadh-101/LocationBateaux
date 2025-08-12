# 🌊 Boat Rental Web Platform

> Web-based Boat Rental Project  
> Internship - 2 Students - Duration: 2 Months  
> Technologies: Spring Boot (Java) | Angular (TypeScript) | PostgreSQL | Git | Docker (optional)

---

## 🚀 Project Overview

This web platform enables **web platform for boat rental** with comprehensive management of users, boats, reservations, payments  and partners.

**Main features:**

- Advanced boat search with filters (type, price, availability, features)
- Detailed boat profiles with photos, descriptions, reviews, and maintenance info
- Reservation with choice of reservation type (full day, half day, 2 hours)
- Complete reservation management (validation, cancellation, history)
- Online payment fully operational** with integration of Clicktopay (Tunisia) and PayPal (Dubai)
- Multi-role system: `Client`, `Manager`, `Administrator`
- Partner management and image uploads (logos, boat photos)

---

## 🧩 Features

### 👤 User Side (Frontend - Angular)

- Authentication (Register / Login) with role management
- Multi-criteria boat search and filtering (type, features, price, availability)
- Viewing detailed boat information (photos, description, technical specs, user reviews)
- Reservation with selection of reservation type (full day, half day, etc.)
- User dashboard showing reservation history and status
- Posting and reading reviews/comments on boats
- Image management (upload, delete, update) through a dedicated component
- Responsive UI with dynamic sidebar (desktop/mobile toggle)

### 👨‍💼 Administration Side (Backend - Spring Boot)

- Full CRUD on boats, partners, users, reservations, payments, reviews, and maintenance
- Role and permission management (conditional field visibility based on roles)
- Reservation validation or rejection with date conflict checks
- Commission management for boats (visible only to administrators)
- Secure image upload and management (boats, partner logos)
- Payment history with multiple payment methods simulated

---

## 🗃️ Data Model (PostgreSQL)

Key updated tables:

- `Users (id, name, email, password, role, status, commission)`  
- `Boats (id, name, description, price, availability, features (capacity, length, width), reservation_types, images)`  
- `Reservations (id, user_id, boat_id, start_date, end_date, reservation_type, status)`  
- `Payments (id, amount, method, status, payment_date, reservation_id)`  
- `Images (id, url, type, boat_id / partner_id)`  
- `Reviews (id, rating, comment, creation_date, user_id, boat_id)`  
- `Maintenance (id, description, start_date, end_date, boat_id)`  
- `Notifications (id, message, sent_date, user_id, read)`  
- `Partners (id, name, logo_url)`  

---

## 🛠️ Technologies Used

| Layer                           | Technology                                                           |
|---------------                  |----------------------------------------------------------------------|
| Backend                         | Spring Boot, Spring Security, JPA/Hibernate, Spring Mail, Socket.IO  |
| Frontend                        | Angular 16, TypeScript, HTML5, CSS3, Tailwind CSS / Bootstrap        |
| Back-office/AfricaBoat-Admin    | Angular 16, TypeScript, HTML5, CSS3, Tailwind CSS / Bootstrap        |
| Database                        | PostgreSQL                                                           |
| Version Control                 | Git (GitHub/GitLab)                                                  |
| Containerization                | Docker (optional)                                                    |

---

## 📁 Project Structure
/LocationBateaux
├── /BackEnd --> Spring Boot (REST API, Entities, Repositories, Services, Controllers)
└── /FrontEnd --> Angular (Components, Services, Routing, Styles, Tests)
└──/Back-office/AfricaBoat-Admin --> Angular (Components, Services, Routing, Styles, Tests)


---

## 📌 Current Status

- ✅ Complete Spring Boot backend with entities, REST API, and basic security
- ✅ Angular frontend with multi-step forms, image management, boat listings & details
- ✅ Role-based UI with conditional display (e.g., commission field visible only to admins)
- ✅ Advanced reservation handling (types, validation, conflict resolution)
- ✅ Image upload and management (boats, partners) with dedicated Angular component
- ✅ Online payment fully functional with integrated Clicktopay and PayPal
- ✅ User and admin dashboards with pagination, filters, and CRUD actions

---

## 👨‍💻 Development Team

- Mouadh Gammoudi  
- Hedi Latrache  

---

> This README will be regularly updated as the project progresses.

