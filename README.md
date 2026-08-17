# Rating Platform

A simple full-stack web application where users can discover registered stores and share ratings from 1 to 5. The platform uses role-based access so that administrators, normal users, and store owners each have access to the features they need.

## Tech Stack

* **Frontend:** React.js
* **Backend:** Express.js
* **Database:** MySQL

## User Roles

The application supports three types of users:

1. **System Administrator**
2. **Normal User**
3. **Store Owner**

## Features

### System Administrator

Administrators can manage the platform and have access to an overview of the system.

* Add new stores, normal users, and administrator accounts.
* View a dashboard showing:

  * Total number of users
  * Total number of stores
  * Total number of submitted ratings
* Add users with their name, email, password, and address.
* View all registered stores along with:

  * Store name
  * Email
  * Address
  * Rating
* View normal users and administrators with:

  * Name
  * Email
  * Address
  * Role
* Filter listings using:

  * Name
  * Email
  * Address
  * Role
* View detailed information about individual users.
* View the rating information when the selected user is a Store Owner.
* Log out securely.

### Normal User

Normal users can register, browse stores, and submit ratings.

* Create a new account.
* Log in to the platform.
* Update their password after logging in.
* View a list of all registered stores.
* Search for stores using their name or address.
* See the following information for each store:

  * Store name
  * Address
  * Overall rating
  * Their own submitted rating
* Submit a rating between **1 and 5**.
* Update their previously submitted rating.
* Log out from the platform.

### Store Owner

Store owners can monitor how customers are rating their stores.

* Log in to the platform.
* Update their password.
* Access a store owner dashboard.
* View users who have submitted ratings for their store.
* View the average rating of their store.
* Log out from the platform.

## Rating System

Ratings are given on a scale of **1 to 5**, where each normal user can submit one rating for a particular store.

A user can later update their existing rating instead of submitting another rating for the same store.


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Purva211/Rating-Platform.git
cd Rating-Platform
```

### 2. Set up the database

Create a MySQL database named:

```text
rating_platform
```

Then run the SQL script from:

```text
database/schema.sql
```

### 3. Configure the backend

Move into the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file and add your local MySQL and JWT configuration:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rating_platform

JWT_SECRET=your_jwt_secret
```

### 4. Start the backend

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The React application will normally be available at:

```text
http://localhost:5173
```

## API Testing

A Postman collection is included in the project for testing the backend APIs.

It contains requests for areas such as:

* Authentication
* Administrator operations
* Store management
* Ratings
* User operations
* Store Owner dashboard

The Postman collection can be found in:

```text
postman/rating-platform-api.json
```

## Validation

The application follows the validation rules defined for the platform:

* **Name:** 20 to 60 characters
* **Address:** Maximum 400 characters
* **Password:** 8 to 16 characters
* Password must contain at least:

  * One uppercase letter
  * One special character
* **Email:** Must be in a valid email format
* **Rating:** Must be an integer from 1 to 5

## Authentication and Authorization

The application uses authentication and role-based authorization to control access to different sections of the platform.

After login, users are directed to the appropriate dashboard based on their role:

```text
ADMIN        → Admin Dashboard
USER         → User Dashboard
STORE_OWNER  → Store Owner Dashboard
```

Protected API routes require a valid authentication token, and role-based middleware prevents users from accessing features that do not belong to their role.

## Future Improvements

Some possible improvements for the project include:

* Better store and user management interfaces
* More detailed analytics for administrators
* Pagination for large datasets
* Improved search and filtering
* Better mobile responsiveness
* Email notifications
* Deployment with a cloud database and hosting service



### Output
<br>
<img width="1161" height="708" alt="Screenshot 2026-08-17 124525" src="https://github.com/user-attachments/assets/efa516bb-ee6e-4b47-b3e7-b6a84d4fe96c">
<br>
<br>
<img width="1919" height="531" alt="Screenshot 2026-08-17 124851" src="https://github.com/user-attachments/assets/731b589f-3090-4fb9-9cd2-1194e0db58a0" />
<br>
<br>
<img width="1918" height="500" alt="Screenshot 2026-08-17 124843" src="https://github.com/user-attachments/assets/a254978b-f2b0-4f51-b2e7-e7cb8dbd1baa" />
<br>
<br>
<img width="1919" height="447" alt="Screenshot 2026-08-17 125120" src="https://github.com/user-attachments/assets/88d514f4-da73-4650-a794-0542b01b6039" />
<br>
<br>
<img width="1919" height="687" alt="Screenshot 2026-08-17 125219" src="https://github.com/user-attachments/assets/9f1f02a9-638d-4d25-bef9-eae9c1c95a32" />
<br>
<br>
<img width="1919" height="917" alt="Screenshot 2026-08-17 125032" src="https://github.com/user-attachments/assets/4afd4298-d1cb-4927-9f0f-e3bff5d07e40" />
<br>
<br>
<img width="1919" height="867" alt="Screenshot 2026-08-17 125527" src="https://github.com/user-attachments/assets/f7290e89-e6e7-42a9-9535-30a9504b3b8b" />


