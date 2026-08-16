# Rating-Platform

**Tech Stack**
● Backend: ExpressJs
● Database: MySQL
● Frontend: ReactJs

**User Roles**
1. System Administrator
2. Normal User
3. Store Owner
   
**Functionalities**

**System Administrator**

● Can add new stores, normal users, and admin users.
● Has access to a dashboard displaying:
○ Total number of users
○ Total number of stores
○ Total number of submitted ratings
● Can add new users with the following details:
○ Name
○ Email
○ Password
○ Address
● Can view a list of stores with the following details:
○ Name, Email, Address, Rating
● Can view a list of normal and admin users with:
○ Name, Email, Address, Role
● Can apply filters on all listings based on Name, Email, Address, and Role.
● Can view details of all users, including Name, Email, Address, and Role.
○ If the user is a Store Owner, their Rating should also be displayed.
● Can log out from the system.


**Normal User**

● Can sign up and log in to the platform.
● Signup form fields:
○ Name
○ Email
○ Address
○ Password
● Can update their password after logging in.
● Can view a list of all registered stores.
● Can search for stores by Name and Address.
● Store listings should display:
○ Store Name
○ Address
○ Overall Rating
○ User's Submitted Rating
○ Option to submit a rating
○ Option to modify their submitted rating
● Can submit ratings (between 1 to 5) for individual stores.
● Can log out from the system.


**Store Owner**

● Can log in to the platform.
● Can update their password after logging in.
● Dashboard functionalities:
○ View a list of users who have submitted ratings for their store.
○ See the average rating of their store.
● Can log out from the system.
