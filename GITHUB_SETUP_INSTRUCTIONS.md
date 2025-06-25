# GitHub Repository Setup Instructions

This guide will walk you through setting up the private GitHub repository that will serve as the workspace and automation server for processing printer meter readings.

## 1. Create a New Private GitHub Repository

1.  **Navigate to GitHub:** Go to [github.com](https://github.com) and log in to your account.
2.  **Create a New Repository:**
    *   Click the "+" icon in the top-right corner and select "New repository".
    *   **Repository name:** Choose a descriptive name (e.g., `automated-invoice-processor`).
    *   **Description:** (Optional) Add a brief description like "Automated processing of printer invoice CSVs and report generation."
    *   **Visibility:** Select **Private**. This is crucial to keep your data and email credentials secure.
    *   **Initialize this repository with:**
        *   You can optionally add a `README` file.
        *   Do NOT add a `.gitignore` or license at this stage unless you specifically want them. We will upload our files directly.
    *   Click "Create repository".

## 2. Upload Initial Files

You will need to upload the following files to your new repository using the GitHub web interface:

*   `template.html` (Artifact 1)
*   `build_report.py` (Artifact 2)
*   `.github/workflows/main.yml` (Artifact 3)

**Steps to upload files:**

1.  **Go to your repository page.**
2.  **Upload `template.html` and `build_report.py` to the root:**
    *   Click the "Add file" button and select "Upload files".
    *   Drag and drop `template.html` and `build_report.py` into the upload area, or click "choose your files" to select them.
    *   Enter a commit message (e.g., "Add initial template and processing script").
    *   Ensure "Commit directly to the `main` branch" is selected.
    *   Click "Commit changes".
3.  **Upload `main.yml` to the `.github/workflows/` directory:**
    *   On your repository page, click "Add file" and select "Create new file".
    *   In the "Name your file..." box, type `.github/workflows/main.yml`. **Important:** Typing `/` will create the necessary folders.
    *   Paste the content of your `main.yml` (Artifact 3) into the editor.
    *   Enter a commit message (e.g., "Add GitHub Actions workflow").
    *   Ensure "Commit directly to the `main` branch" is selected.
    *   Click "Commit new file".

    *Verification:* After uploading, your repository structure should look like this:
    ```
    your-repo-name/
    ├── .github/
    │   └── workflows/
    │       └── main.yml
    ├── template.html
    ├── build_report.py
    └── (Optional: README.md)
    ```

## 3. Create Repository Secrets

GitHub Secrets are encrypted environment variables that allow you to store sensitive information like API keys, passwords, or email addresses securely in your repository. The GitHub Actions workflow will use these secrets.

1.  **Navigate to Repository Settings:**
    *   On your repository page, click the "Settings" tab.
2.  **Go to Secrets and variables:**
    *   In the left sidebar, under "Security", click "Secrets and variables", then select "Actions".
3.  **Add New Repository Secrets:**
    *   Click the "New repository secret" button for each secret you need to add.
    *   You will need to create the following four secrets:

    *   **`MAIL_USERNAME`**:
        *   **Name:** `MAIL_USERNAME`
        *   **Secret:** Your email address that will be used to send the reports (e.g., `your.email@example.com`).
        *   Click "Add secret".

    *   **`MAIL_PASSWORD`**:
        *   **Name:** `MAIL_PASSWORD`
        *   **Secret:** The password for the email account specified in `MAIL_USERNAME`.
            *   **Important:** If using Gmail or Outlook.com with 2-Factor Authentication (2FA) enabled, you will likely need to generate an "App Password" and use that here instead of your regular account password.
                *   **Gmail App Password:** [https://support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833)
                *   **Outlook.com App Password:** Search for "Outlook app password" in Microsoft support.
        *   Click "Add secret".

    *   **`MAIL_RECIPIENTS`**:
        *   **Name:** `MAIL_RECIPIENTS`
        *   **Secret:** A comma-separated list of staff email addresses that should receive the report (e.g., `staff1@example.com,staff2@example.com,manager@example.com`).
        *   Click "Add secret".

    *   **`GH_PAT`**:
        *   **Name:** `GH_PAT`
        *   **Secret:** A GitHub Personal Access Token (PAT) that Power Automate will use to upload `input.csv` to this repository.
            *   **How to create a GH_PAT:**
                1.  Go to your GitHub account settings (click your profile picture in the top-right > Settings).
                2.  In the left sidebar, scroll down and click "Developer settings".
                3.  Click "Personal access tokens", then "Tokens (classic)".
                4.  Click "Generate new token", then "Generate new token (classic)".
                5.  **Note:** Give your token a descriptive name (e.g., `PowerAutomateInvoiceUpload`).
                6.  **Expiration:** Choose an appropriate expiration (e.g., 90 days, or custom). Remember to renew it before it expires.
                7.  **Scopes:** Select the `repo` scope. This will grant full control of private repositories, which is needed to write files.
                    *   ![PAT Repo Scope](https://docs.github.com/assets/cb-112320/images/help/settings/personal_access_tokens_repo_scope.png)
                8.  Click "Generate token".
                9.  **CRITICAL:** Copy the generated token immediately. You will **NOT** be able to see it again. Store it temporarily in a secure place until you paste it into the Power Automate flow setup (as described in Artifact 5) and then into this GitHub secret.
            *   Paste the copied PAT into the "Secret" field for `GH_PAT`.
        *   Click "Add secret".

    *Verification:* After adding all secrets, you should see them listed under "Repository secrets" in the Actions secrets settings. Their values will be hidden.

Your GitHub repository is now set up and ready to receive the `input.csv` file from Power Automate and trigger the processing workflow. The next step is to configure the Power Automate flow.
---

**Note on `main.yml` SMTP server settings:**
The provided `main.yml` uses `smtp.gmail.com` on port `465` as an example for the email server. If you are using a different email provider (e.g., Outlook.com, SendGrid, etc.), you will need to update the `server_address` and `server_port` in the `.github/workflows/main.yml` file accordingly.
*   Outlook.com: `smtp.office365.com`, port `587` (requires TLS, so `secure: false` or remove the line in the action)
*   Other providers: Check their SMTP documentation.

You can edit the `main.yml` file directly in the GitHub web interface if you need to make these changes. Remember to commit any changes.
