# EasyStay

A full-stack travel and accommodation listing platform inspired by Airbnb-style booking apps, built with Node.js, Express, MongoDB, and EJS.

Live Demo: https://easystay-nmxz.onrender.com

## Overview

EasyStay allows users to browse, create, edit, and delete property listings, add reviews, and manage account authentication. The application combines MVC architecture with modern web features like image upload, geolocation, search filters, and flash-based user feedback.

## Features

- User signup, login, and logout using Passport.js
- Secure session management with Express Session
- Role-based protection for listing ownership and editing
- Create, read, update, and delete (CRUD) property listings
- Search listings by title, location, country, or description
- Filter listings by category
- Add, view, and delete reviews with star ratings
- Cloudinary-based image upload for listing photos
- Mapbox geocoding integration for location mapping
- Responsive UI with EJS templates and custom CSS
- Error handling and success/error flash messages
- MongoDB database integration with Mongoose

## Tech Stack

- Backend: Node.js, Express.js
- Frontend: EJS, HTML, CSS, JavaScript
- Database: MongoDB with Mongoose
- Authentication: Passport.js + passport-local-mongoose
- File Uploads: Multer + Cloudinary
- Maps: Mapbox SDK
- Session Storage: connect-mongo
- Validation: Joi

## MVC Design

This project follows the Model-View-Controller pattern:

- Models: define the MongoDB schemas and data structure
- Views: EJS templates under the views folder for rendering pages
- Controllers: handle business logic and request processing
- Routes: define endpoints and connect HTTP requests to controllers
- Middleware: authentication, authorization, and validation logic

### MVC Structure

- app.js: application entry point and server configuration
- models/: database schemas and models
- controllers/: logic for listings, reviews, and users
- Routes/: route definitions for listing, review, and user actions
- views/: EJS templates for all pages
- middleware.js: auth and validation middleware
- schema.js: Joi validation schemas
- cloudConfig.js: Cloudinary configuration
- utils/: helper utilities and custom error handling

## Project Structure

```text
EasyStay/
├── app.js
├── cloudConfig.js
├── middleware.js
├── package.json
├── schema.js
├── controllers/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── Routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/
│   ├── css/
│   └── js/
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/
│   ├── error.ejs
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
├── .env
├── .gitignore
└── README.md
```

## Listing Features

Users can:

- create new accommodation listings
- upload listing photos
- set location, country, category, and price
- update existing listings
- delete their own listings
- review properties left by other users

## Review Features

- Users can leave comments and ratings from 1 to 5
- Reviews are associated with the user who wrote them
- Review deletion is restricted to the original author

## Authentication and Authorization

- Only logged-in users can create or modify listings
- Only the listing owner can edit or delete it
- Review ownership is also checked before modification
- Middleware protects routes and redirects unauthenticated users

## Environment Variables

Create a .env file with the following values:

```env
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
MAP_TOKEN=your_mapbox_token
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
```

## Run Locally

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a .env file with your required environment values
4. Start the app:

```bash
node app.js
```

5. Open the app in your browser:

```text
http://localhost:8080
```

## Deployment

This project is deployed on Render at:

https://easystay-nmxz.onrender.com

## License

This project is for educational and portfolio purposes.
