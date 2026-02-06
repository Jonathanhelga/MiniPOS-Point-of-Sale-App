# Login & Sign Up Flow Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     App Initialization                          │
│                  (initializeWizard)                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
            ┌─────────────────────────────-─┐
            │  Monitor Auth State (Firebase)│
            │  Check if user is logged in   │
            └──────┬───────────────────┬───-┘
                   │                   │
        YES ◄──────┘                   └────► NO
          │                                     │
          ▼                                     ▼
    ┌──────────────────┐           ┌─────────────────────┐
    │  User Logged In  │           │  Guest/New User     │
    │                  │           │                     │
    │ Render:          │           │ Render:             │
    │ - Welcome Back   │           │ - Sign Up Form      │
    │ - Email Display  │           │ - Form Inputs       │
    │ - Logout Button  │           │ (username, email,   │
    │                  │           │  password, code)    │
    └──────────────────┘           │                     │
                                   │ + Options:          │
                                   │ - Verify Email      │
                                   │ - Google Sign In    │
                                   │ - Link to Login     │
                                   └──────┬──────────────┘
                                          │
                                          ▼
                                   [User at Sign Up Form]
```

---

## Sign Up Flow (When User is Guest)

```
START: Sign Up Page Displayed
│
├─ User fills form:
│  • Username
│  • Email
│  • Password
│  • Verification Code (empty initially)
│
▼
Form Validation Check (checkVerificationButton)
│
├─ All 3 fields filled? 
│  YES ─────► Enable "E-Mail Verification" button
│  NO ──────► Keep button disabled
│
▼
User Clicks "E-Mail Verification" Button
│
▼
[Frontend → Backend API Call]
POST to: http://localhost:3000/api/send-otp
Body: { email: userEmail }
│
├─ Button becomes disabled
├─ Button text: "sending verification...PLS check your Email"
│
▼
Server Response
│
├─ SUCCESS (response.ok)
│  │
│  ├─ Server sends OTP code to user's email
│  ├─ Server returns OTP to frontend (CODE SMELL - not secure!)
│  ├─ Store OTP in variable: generatedOtp
│  ├─ Disable "E-Mail Verification" button
│  ├─ Enable "Sign Up" button
│  └─ Show "Sign Up" button as active
│  
├─ ERROR
│  │
│  └─ Show error alert
│  └─ Re-enable "E-Mail Verification" button for retry
│
├─ NETWORK ERROR
│  │
│  └─ Alert user: "Could not connect to server"
│  └─ Re-enable button for retry
│
▼
User Enters Verification Code
│
▼
Form Validation (checkSignInButton)
│
├─ Code filled in?
│  YES ─────► Enable "Sign Up" button  
│  NO ──────► Keep button disabled
│
▼
User Clicks "Sign Up" Button
│
▼
[Frontend Verification]
Compare user's input code with generatedOtp variable
│
├─ MATCH
│  │
│  ├─ OTP is correct!
│  ├─ Call Firebase: SignUpNewUser(email, password, username)
│  │  │
│  │  ├─ Firebase creates user account
│  │  ├─ Store pending username in localStorage
│  │  ├─ Firebase triggers onAuthStateChanged
│  │  │
│  │  └─ User object returned
│  │
│  ├─ Log: "User Created"
│  ├─ Disable "Sign Up" button
│  ├─ Set button text: "Account Successfully Created"
│  │
│  └─► onAuthStateChanged fires
│      │
│      ├─ Detects user is now logged in
│      ├─ Calls renderLoggedInState(user)
│      ├─ Displays welcome message with email
│      └─ User can proceed to Step 2+ of wizard
│
├─ NO MATCH
│  │
│  └─ Show alert: "Incorrect Code"
│  └─ User can try entering correct code again
│
END: Account Created or Error
```

---

## Login Flow (When User Clicks "Log In")

```
User clicks "Log In" link
│
▼
switchView('logIn') is called
│
├─ Hides wizard footer
├─ Loads login-wizard-template
│  (NOTE: This template is NOT defined in HTML yet!)
│
END: Login form would appear here (not implemented)
```

---

## Wizard Step Progression (After Sign Up)

```
STEP 1: Sign Up Form
│
│ ✓ User must be logged in to proceed
│
▼
STEP 2: Store Identity
│ (Business name, etc.)
│
▼
STEP 3: Financial Settings
│ (Tax rates, invoice prefix, etc.)
│
▼
STEP 4: Printer Setup
│
▼
DONE: Finish Setup button
```

---

## Function Reference Table

| Function | File | Purpose |
|----------|------|---------|
| `initializeWizard()` | `src/setup_wizard.js` | Initializes auth monitoring and wizard on app load |
| `monitorAuthState(onLogin, onLogout)` | `src/firebase.js` | Listens to Firebase auth state changes |
| `renderLoggedInState(user)` | `src/handle_newUser.js` | Displays welcome screen for logged-in users |
| `renderGuestState()` | `src/handle_newUser.js` | Displays sign-up form for guests |
| `handleNewUser()` | `src/handle_newUser.js` | Sets up event listeners for sign-up form |
| `checkVerificationButton()` | `src/handle_newUser.js` | Validates username/email/password fields |
| `checkSignInButton()` | `src/handle_newUser.js` | Validates verification code field |
| `ifButtonIsClicked()` | `src/handle_newUser.js` | Handles OTP request & sign-up submission |
| `SignUpNewUser(email, password, username)` | `src/firebase.js` | Creates user account in Firebase |
| `LogOutUser()` | `src/firebase.js` | Signs out user and reloads page |
| `addUsername(user, username)` | `src/handle_newUser.js` | Saves username to Firestore (NOT CALLED!) |
| `eventDelegation(containerID)` | `src/control_wizard.js` | Handles sign-up/login link clicks |
| `switchView(targetView)` | `src/control_wizard.js` | Switches between sign-up and login templates |
| `controlWizardFormPageDirection()` | `src/setup_wizard.js` | Manages wizard step navigation |

---

## Key Components & Files

### Firebase Authentication (firebase.js)
- **SignUpNewUser(email, password, username)**
  - Creates user in Firebase Auth
  - Stores pending username in localStorage
  - Throws error if email already exists

- **monitorAuthState(onLogin, onLogout)**
  - Listens for auth state changes
  - Calls onLogin when user signs in
  - Calls onLogout when user signs out

- **LogOutUser()**
  - Signs user out of Firebase
  - Reloads page

### New User Handler (handle_newUser.js)
- **renderLoggedInState(user)**
  - Shows welcome message with user email
  - Displays logout button

- **renderGuestState()**
  - Shows sign up form template

- **handleNewUser()**
  - Sets up event listeners for form inputs
  - Manages OTP verification flow
  - Calls Firebase sign up

### Wizard Control (setup_wizard.js, control_wizard.js)
- Manages 4-step wizard progression
- Prevents step advancement without authentication
- Switches between sign up and login views

---

## Potential Issues & Notes

⚠️ **Security Concerns:**
1. OTP code is sent back to frontend (visible in network tab) - should be verified server-side only
2. Username is stored in localStorage before account creation (what if creation fails?)

⚠️ **Missing Implementation:**
1. Login form template not defined in HTML (id: "login-wizard-template")
2. Google Sign In button exists but handler not implemented
3. No password reset functionality
4. No email verification/confirmation after sign up

⚠️ **Flow Issues:**
1. `addUsername()` function imported in handle_newUser.js but never called
2. Username not saved to Firestore after account creation
