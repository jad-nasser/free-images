# **Free Images**

<br>
<br>

## **Overview**

<br>

This is a personal project website, and the aim of this project is to enhance my web development skills and to learn **TypeScript**.

This website provides a free images. The signed in users can add, edit, and delete image items, and the non signed in users can view and download images for free.

<br>
<br>

## **Technologies Used**

<br>

### **Server Side:**

- **Node js**
- **TypeScript**
- **Express js**
- **Mongo DB**
- **nodemon**: used to watch for changes and automatically restart the server
- **mongoose**: driver for Mongo DB
- **Cors**
- **Multer**: used to upload image files to the server
- **bcrypt**: for hashing users passwords
- **cookie-parser**
- **dotenv**: for storing some enviroment variables.
- **Json Web Token**: tokens for user login stored in httpOnly cookies in user's browser.
- **Lodash**
- **image-size**: used to get the image file resolution.
- **Mocha**: test framework.
- **chai**: for tests assertions.
- **sinon**: used for mocking while unit testing.
- **proxyquire**: used for mocking libraries while unit testing.
- **supertest**: used for integration testing.

### **Client Side:**

- **React**
- **Redux**
- **react-redux**
- **Bootstrap**
- **Axios**: for sending requests to the server.
- **form-data**: for uploading image files.
- **number-abbreviate**: used to abbreviate large numbers of image's "number_of_downloads" attribute for better viewing experience.
- **dotenv**
- **React Router**: for managing routing through pages in the react app.
- **jest**: test framework.
- **React Testing Library**: used for unit testing.
- **Mock Service Worker**: used to mock server responses in unit testing.
- **Cypress**: used for e2e testing.
- **cypress-file-upload**: used to upload images files for cypress e2e testing.

<br>
<br>

## **Detailed Explanation**

<br>

This project uses MVC architecture (**M**odel-**V**iew-**C**ontroller) with all MVC parts having validations for more security. The server side uses **REST API** strategy and this project is built with **MERN** stack.

The project consists of two main parts:

- **Users**
- **Images**

### **Users**

This project consists of two user types:

- **Non signed in user**
- **Signed in user**

All user types interactions with the system is via browser. Each user type has a specific pages for them. If a user go to a page that belongs to different user type then the user will be automatically redirected to other page.

When the user signs in the server create Json web token for that user and stores it as a httpOnly cookie in the user's browser.

##### **Non signed in user**

Non signed in users can:

- Sign in
- Sign up
- Search images
- View images
- Download images

##### **Signed in user**

Signed in users can:

- Sign out
- Search his/her added images
- View, edit, delete his/her images
- Add new images
- Edit account
- Deactivate account

### **Images**

Created by the signed in users, stored in the server.

<br>
<br>

## **Project Main Files Structure**

<br>

**Note**: Most client side components represented in this documentation by the parent folder that includes them not by their .ts file name.

- **routers**: contains routers that are responsible for the CRUD operations in the database models.
  - **images.ts**
  - **users.ts**
- **controllers**: contains controllers for images and users routers.
  - **images.ts**: controller for images router.
  - **users.ts**: controller for Signed in users router.
- **models**: contains the database models
  - **users.ts**: database model for the signed in users
  - **images.ts**: database model for the images
- **database-controllers**: these database controllers are used by the controllers above and they are used to communicate with the database models.
  - **images.ts**: controller for images database model.
  - **users.ts**: controller for users database model.
- **tests**: contains unit and integration tests for the server side code.
  - **unit-tests**: contains all unit testing code for the server side.
    - **users.test.ts**
    - **images.test.ts**
  - **integration-tests**: contains all the integration testing code for the server side.
    - **users.test.ts**
    - **images.test.ts**
- **app.ts**: its the main router that the server run and it includes all the two routers mentioned above.
- **dbConnection.ts**: used by the server to connect to a database.
- **server.ts**: the server file itself.
- **imageSize.ts**: a file that contains a function to calculate the image resolution using image-size dependency.
- **client**: contains the client side code.
  - **cypress**: contains e2e tests.
    - **e2e**
      - **e2e-tests.cy.ts**
  - **public**
    - **index.html**: include links to font awesome.
  - **src**
    - **App.css**: includes some css styles used in the entire app.
    - **index.ts**: the main client side component and it also includes redux store.
    - **App.ts**: the second main client side component included in index.ts and this component includes all the routes of the client side app.
    - **components**: includes all the components that the client side main app will use, each component is in a folder and many components comes with .test.ts files that are unit tests to this component.
      - **account-settings**: a component that include a tab that navigate the user to a setting the user needs.
      - **account-info**: a component that shows user's account info and can be accessed by account-settings component.
      - **edit-email**: allows the user to edit his/her email and can be accessed by account-settings component.
      - **edit-name**: allows the user to edit his/her name and can be accessed by account-settings component.
      - **edit-password**: allows the user to edit his/her password and can be accessed by account-settings component.
      - **deactivate-account**: allows the user to deactivate his/her account and can be accessed by account-settings component.
      - **image-items**: the component that used in the home page to represent list of images to the users.
      - **image-item**: represents one image used in image-items component.
      - **view-image**: this component rendered when a **Non signed in user** clicks an image-item component, allows the user to view an image and download it.
      - **sign-in**: allows the users to sign in to the system as Signed in user.
      - **sign-up**: allows the users to create a Signed in user account.
      - **footer**: the footer component.
      - **default-navbar**: a navbar that it is for the Non signed in users.
      - **user-navbar**: a navbar that it is for the Signed in users.
      - **add-image**: allows the Signed in user to add new image item.
      - **edit-image**: this component will be rendered when a signed in users clicks an image-item component, and this component allows the Signed in user to edit or delete an image item.
      - **notification**: represents a notification for success, error, or info
      - **route-components**: includes components that have `<Outlet/>` of react router.
        - **AccountSettingsRoute.ts**: includes account-settings component tab and an outlet for the settings.
        - **Default.ts**: includes user-navbar component and an outlet for Non signed in users pages.
        - **User.ts**: includes Signed in user-navbar component and an outlet for Signed in users pages.
    - **functions**: includes some functions used by the components
      - **checkLogin.ts**: contains a function that checks the login status of a user and according to that status it checks if the user is in the correct page type and if the user is not in the correct page type the user will be redirected to another page.
      - **getAllSearchParams**: returns all search params in an object.
    - **redux**: contains all redux store, actions, and reducer
      - **themeSlice.ts**: reducer and actions for website theme change
      - **store.ts**: the global store of the whole app

<br>
<br>

## **How To Use The Website**

<br>

Both signed in and non signed in users can change the website theme by clicking "Change Theme" in the navbar and then they can select a theme mode (light,dark) and a theme color.

### **Non Signed In User Guide**

- The first page that appears to the user is the home page, this page allows the user to search images.
- The user can use the search input in the navbar to search for a specific image in the home page.
- The user is not requird to enter the image's full name in the search input, because the user can write a substring of the name of the image and the system will find the image.
- Also the user can sort images by clicking the button that contains the configuration icon in the navbar, and then selects one of the following:
  - Alphabetical order
  - Reverse alphabetical order
  - Most downloaded
- The user can select an image in the home page by clicking it, this will navigate the user to the view-image page for this image.
- In the view-image page the user can see the image and its details and can download it by clicking the download button.

### **Signed In User Guide**

- In order the users to sign in they need to:
  1. Click the "Sign In" button in the navbar, this will navigate to the sign in page.
  2. Insert email and password in the inputs.
  3. Click the "Sign In" button below the inputs and then the user will be navigated to the Signed in users home page.
  4. The Signed in user can sign out by clicking the "Sign Out" button in the navbar
- In order the users to sign up they need to:
  1. Go to sign in page
  2. Click the "Sign Up" link in the bottom of the page, this will navigate the user to the sign up page
  3. Then the user **should** fill all the inputs and sign up
  4. If sign up not succeeded then maybe there are some inputs missing or the email is not valid or the password not valid or confirm password is the same as the password, and a red text will appear under the inputs telling the user what to do.
  5. After the sign up is completed the user needs to sign in in order to access his/her account.
- An email **can't** be linked to more than one account in the system.
- The first page appeared to the Signed in user after successful sign in is the Signed in user's home page and this page contains all the image items added by this Signed in user.
- If the Signed in user has a lot of images and he/she needs to find a specific image, then the Signed in user can use the search input in the navbar to search for a specific image in the home page.
- It is not necessary by the Signed in user to enter the image's full name in the search input in order to find a image, instead the Signed in user can write a substring of the image's name.
- In order the Signed in user to update an image item, he/she needs to click this image item in the home page, this will navigate the Signed in user to the edit-image page.
- The edit-image page allows the Signed in user to edit this image or delete it
- It is not required by the Signed in user to fill all the inputs in the edit-image page to edit an image, the Signed in user can choose the fields that he/she needs to update and left the others blank so the system will only update the fields that the Signed in user needs to change and the other fields that their inputs are empty will not changed.
- For the Signed in user to add new image, in the navbar there is a button named "Add New Image", when the Signed in user clicks it, the Signed in user will be navigated to add-image page, then the Signed in user should fill all the inputs and click the "Add image" button below.
- GIF images are not allowed in the system.
- For the Signed in user to go to the account-settings page, the Signed in user should click the 'Account Settings' button in the navbar.
- In the account-settings page the Signed in user can select which setting he/she needs by clicking a setting from the box that it is located at the left of the screen, but for small screen size this box will not appear instead a second navbar will appear under the original navbar and this navbar contains a button that have an icon like hamburger, when the Signed in user clicks this button all the settings will appear and then the Signed in user can select which setting he/she needs by clicking them.
- The account settings available are:
  - **Account Info**: allows the Signed in user to see all the account info except the password.
  - **Change Your Name**: allows the Signed in user to change his/her first and last name on the account.
  - **Change Your Email**: allows the Signed in user to change his/her email address for this account.
  - **Change Your Password**: allows the Signed in user to change his/her account password.
  - **Deactivate Your Account**: allows the Signed in user to delete his/her account.

<br>
<br>

---
