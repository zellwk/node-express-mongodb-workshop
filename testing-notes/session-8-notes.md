## Change Password Functionality

Change password form should contain 3 fields:

1. Old Password
2. New Password
3. Password Confirmation

## Reset Password Functionality

- First Way: Pure API
- Second Way: Interface

**Interface means:**

- One screen for people to send in their email address
  - We need one page with a form
- One screen to reset the password
  - We need one page with the reset password form
  - We only show this page when the token is sucessfully decoded
  - We need to have a function to change password and a way to tell success or failure

**Pure API means:**

- Check whether the reset token is valid
- If it's valid, allow them to reset password with the change-password endpoint.

- When the user clicks on the reset password link
- They should get into a page
  - This page should use the reset password token found in the link to grab the user's information for resetting the password.
  - This page should contain two fields:
    - New Password
    - Confirmation Password
    - Submit a Reset Password -> Change Password Request
