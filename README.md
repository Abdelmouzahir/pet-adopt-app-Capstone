Code Structure and Implementation (README)
Overview

The Pet Adopt mobile application is built using React Native with Expo and follows a client–cloud architecture. The mobile client handles all user interface and navigation, while backend services (Firebase and Clerk) manage authentication, data storage, and media files.

The project uses Expo Router for file-based navigation and a modular component structure to keep screens, logic, and UI reusable and easy to maintain.

Technology Stack

Frontend:

React Native

Expo

Expo Router

JavaScript / TypeScript

Backend / Cloud:

Firebase Firestore (database)

Firebase Storage (images)

Clerk (authentication)

Tools:

Node.js

npm

Expo CLI

How to Run the App Locally
Prerequisites

Node.js installed

Expo CLI installed

Expo Go app on mobile device or emulator

Steps
npm install
npx expo start -c


Then:

Press i → iOS simulator

Press a → Android emulator

Or scan QR code with Expo Go

The -c flag clears cache to avoid build issues.

Project Folder Structure
Root Structure
app/
assets/
components/
config/
constants/


Each folder has a specific responsibility to keep the code organized.

app/ (Screens and Routing)

Expo Router uses file-based routing, meaning each file represents a screen.

app/
 ├── (tabs)/
 │   ├── home.jsx
 │   ├── favorite.jsx
 │   ├── inbox.jsx
 │   ├── profile.jsx
 │   └── _layout.jsx
 │
 ├── login/
 ├── add-new-pet/
 ├── pet-details/
 ├── chat/
 ├── user-post/
 └── index.jsx

Responsibilities
Tabs

Main navigation using bottom tabs:

Home

Favorites

Inbox

Profile

Other Screens

Login → authentication screen

Add New Pet → create listing

Pet Details → view pet info

Chat → messaging between users

User Post → manage own posts

This structure keeps routing simple and scalable.

components/ (Reusable UI)

Contains reusable UI blocks used by screens.

Example:

components/
 ├── Home/
 │   ├── Category.jsx
 │   ├── PetListItem.jsx
 │   ├── Slider.jsx
 │
 ├── PetDetails/
 │   ├── PetInfo.jsx
 │   ├── AboutPet.jsx
 │   ├── OwnerInfo.jsx
 │
 ├── Inbox/
 │   ├── UserItem.jsx
 │
 └── MarkFav.jsx

Purpose

Improves reusability

Reduces duplicated code

Makes screens cleaner

Easier maintenance

assets/

Static resources:

assets/
 ├── fonts/
 ├── images/


Used for:

icons

illustrations

placeholder images

custom fonts

config/
config/FirebaseConfig.js


Contains:

Firebase initialization

Firestore connection

Storage setup

Centralizing configuration keeps environment setup clean.

constants/
constants/Colors.ts


Stores:

theme colors

reusable styles

Helps maintain consistent design across the app.

Backend Architecture
Authentication – Clerk

Clerk handles:

login

logout

sessions

secure user identity

Only authenticated users can:

add posts

chat

save favorites

manage posts

This removes the need to build custom authentication logic.

Database – Firebase Firestore

Main collections:

Categories

Pets

Chat

Sliders

UserFavPet

Firestore stores:

pet listings

favorites

chat messages

metadata

Real-time updates are used for chat.

Storage – Firebase Storage

Used for:

pet images

Flow:

user uploads image

image stored in Storage

URL saved in Firestore

image displayed in UI

Data Flow Example
Browse Pets

Home → fetch pets → Firestore → display cards

Add Post

Form → upload image → Storage → save metadata → Firestore

Favorite

Tap heart → save petId → UserFavPet collection

Adoption

Handled through chat, not a separate adoption request system.

User → open pet → open chat → communicate with owner

Design Principles Used

Modular components

Separation of UI and data logic

Cloud-managed backend

File-based routing

Scalable structure

This design makes the app easy to maintain, test, and extend.
