# Power Automate Flow Setup Instructions

This guide details how to create the Microsoft Power Automate flow that watches your Office 365 inbox for an email with the CSV attachment and uploads it to your private GitHub repository.

**Assumptions:**
*   You have a Microsoft 365 account with access to Power Automate.
*   The email with the CSV attachment will have a consistent sender or subject line for filtering.
*   You have already set up your private GitHub repository and created the `GH_PAT` secret as per `GITHUB_SETUP_INSTRUCTIONS.md`.

## Create the Power Automate Flow

1.  **Go to Power Automate:**
    *   Navigate to [make.powerautomate.com](https://make.powerautomate.com) or access it through your Office 365 portal.
    *   Sign in with your Microsoft account.

2.  **Create a New Automated Cloud Flow:**
    *   In the left navigation pane, click on "+ Create".
    *   Select "Automated cloud flow".
    *   **Flow name:** Give your flow a descriptive name (e.g., "Upload Invoice CSV to GitHub").
    *   **Choose your flow's trigger:** Search for "When a new email arrives (V3)" from the "Office 365 Outlook" connector. Select it.
    *   Click "Create".

3.  **Configure the Trigger: "When a new email arrives (V3)"**

    *   If prompted, sign in to your Office 365 Outlook account.
    *   **Folder:** Select "Inbox" (or any specific subfolder where the email is expected).
    *   **Show advanced options:** Click this to see more filtering options.
    *   **To:** (Optional) If the email is always sent to a specific address.
    *   **From:** (Recommended) Enter the email address of the sender of the invoice emails. This helps ensure the flow only triggers for the correct emails.
    *   **Subject Filter:** (Recommended) Enter a specific keyword or phrase that is always in the subject line of the invoice emails (e.g., "Monthly Printer Invoice", "Meter Reading CSV").
    *   **Include Attachments:** Set to **Yes**.
    *   **Only with Attachments:** Set to **Yes**.

    *Screenshot Example (Illustrative):*
    *(Imagine a screenshot here showing these fields filled in Power Automate)*

4.  **Initialize Variable for File SHA (Optional but Recommended for Robustness)**

    *This step is needed to update the file if it already exists in GitHub. If you always want to create a new commit even if the file name is the same, you can skip to step 5, but you'll need to remove the `"sha": "@variables('FileSHA')"` line from the HTTP action's body in step 6.*

    *   Click "+ New step".
    *   Search for "Initialize variable" and select the "Initialize variable" action.
    *   **Name:** `FileSHA`
    *   **Type:** `String`
    *   **Value:** Leave this blank for now.

5.  **Action: Get File SHA from GitHub (Optional but Recommended)**

    *This action attempts to get the SHA of `input.csv` if it already exists in the repository. This SHA is required by the GitHub API to update an existing file.*

    *   Click "+ New step".
    *   Search for "HTTP" and select the "HTTP" action (it's a premium connector, ensure your license covers this or you are in a trial).
    *   **Method:** `GET`
    *   **URI:**
        ```
        https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/contents/input.csv
        ```
        *   **Replace `YOUR_USERNAME` with your GitHub username.**
        *   **Replace `YOUR_REPO_NAME` with the name of your private repository.**
    *   **Headers:**
        *   `Authorization`: `token YOUR_GH_PAT_VALUE`
            *   **Replace `YOUR_GH_PAT_VALUE` with the actual GitHub Personal Access Token (PAT) you generated and stored as a secret in GitHub. For Power Automate, you paste the actual token string here.**
            *   **Security Note:** Storing PATs directly in Power Automate flow actions is less secure than using managed identities or Azure Key Vault if available. However, given the "zero cost, zero installation" constraint, this is a common approach. Be mindful of who has access to edit this flow.
        *   `Accept`: `application/vnd.github.v3+json`
    *   **Configure run after:**
        *   Click the three dots (...) on the top right of this HTTP action card.
        *   Select "Configure run after".
        *   Check the box for "has failed" in addition to "is successful". This ensures the flow continues even if the file doesn't exist yet (which will cause the GET request to fail with a 404).
        *   Click "Done".

6.  **Action: Set Variable with File SHA (Optional but Recommended)**

    *This action extracts the SHA from the response of the previous GET request.*

    *   Click "+ New step" (ensure this step is added *after* the GET HTTP action).
    *   Search for "Set variable" and select the "Set variable" action.
    *   **Name:** Select `FileSHA` (the variable initialized earlier).
    *   **Value:**
        *   Click in the value field, then select "Expression" from the dynamic content pane.
        *   Paste the following expression:
            ```
            body('HTTP')?['sha']
            ```
        *   Click "OK".
    *   **Configure run after:**
        *   Click the three dots (...) on the top right of this "Set variable" action card.
        *   Select "Configure run after".
        *   Ensure **only "is successful" is checked**. This step should only run if the previous GET request was successful (meaning the file exists and its SHA was retrieved).
        *   Click "Done".

7.  **Action: Upload Attachment Content to GitHub**

    *   Click "+ New step".
    *   Search for "HTTP" and select the "HTTP" action again.
    *   **Method:** `PUT`
    *   **URI:**
        ```
        https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/contents/input.csv
        ```
        *   **Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` as before.**
    *   **Headers:**
        *   `Authorization`: `token YOUR_GH_PAT_VALUE` (Same PAT as used in the GET request)
        *   `Accept`: `application/vnd.github.v3+json`
        *   `Content-Type`: `application/json`
    *   **Body:**
        *   This needs to be a JSON payload.
        *   **Important:** The `content` field must be Base64 encoded.
        *   Click in the body field, then select "Expression" from the dynamic content pane for the `content` part.

        ```json
        {
          "message": "Automated CSV upload from Power Automate",
          "committer": {
            "name": "Power Automate Flow",
            "email": "powerautomate@example.com"
          },
          "content": "@{base64(outputs('Get_attachment_content')?['body'])}",
          "sha": "@{variables('FileSHA')}"
        }
        ```

        **Explanation of the Body:**
        *   `"message"`: A commit message for the file upload.
        *   `"committer"`: Information about who is making the commit. You can customize this.
        *   `"content"`: This is where the magic happens.
            *   You first need a step to get the attachment content. Add a "Get attachment content" action from the "Office 365 Outlook" connector **before this HTTP PUT action**.
                *   **Message Id:** Select "Message Id" from the "When a new email arrives (V3)" trigger in the dynamic content.
                *   **Attachment Id:** Select "Attachments Attachment Id" from the "When a new email arrives (V3)" trigger. Power Automate will automatically wrap this in an "Apply to each" loop if there could be multiple attachments. Ensure your email filter is specific enough that only one relevant CSV is processed, or add logic to pick the correct one.
            *   Then, in the JSON body for the HTTP PUT action, for the `"content"` value, use the expression: `base64(outputs('Get_attachment_content')?['body'])`
                *   Replace `'Get_attachment_content'` with the actual name of your "Get attachment content" action if it's different (Power Automate might add suffixes like `_2`). Make sure to include spaces if they are in the action name, e.g., `outputs('Get_attachment_content_2')?['body']`.
        *   `"sha"`: This is the SHA of the file if it already exists.
            *   Use the expression: `variables('FileSHA')`
            *   **If you skipped the SHA steps (4, 5, 6):** Remove the entire line `"sha": "@{variables('FileSHA')}",` (including the comma from the line above it if it becomes the last line before the closing `}`). If you don't provide the SHA, GitHub will create the file if it doesn't exist, but it will fail if the file *does* exist. The SHA is how you tell GitHub you intend to *update* an existing file.

        **Simplified Body (if NOT using SHA for updates and always creating/overwriting):**
        ```json
        {
          "message": "Automated CSV upload from Power Automate (overwrite)",
          "committer": {
            "name": "Power Automate Flow",
            "email": "powerautomate@example.com"
          },
          "content": "@{base64(outputs('Get_attachment_content')?['body'])}"
        }
        ```
        *If using this simplified body, you might need to manually delete `input.csv` from GitHub if a previous version exists and the PAT doesn't have permission to force-push/overwrite without SHA, or the API might error. Using SHA is more robust.*

8.  **Save and Test the Flow**
    *   Click "Save" in the top right corner.
    *   **Test your flow:**
        *   You can test manually by triggering it yourself (if your trigger conditions are broad enough) or by sending an email that matches your trigger conditions (From, Subject, Attachment).
        *   Open the flow's run history to see if it executed successfully or to debug any errors. Check the inputs and outputs of each step.

## Important Considerations:

*   **Error Handling:** The instructions above provide a basic flow. You might want to add more robust error handling (e.g., send a notification email if the flow fails).
*   **Multiple Attachments:** If the email can have multiple attachments, the "Apply to each" loop added by "Get attachment content" will run the subsequent GitHub upload for each. Ensure your logic correctly identifies and processes only the desired CSV file (e.g., by checking `outputs('Get_attachment_content')?['name']`).
*   **Premium Connector:** The HTTP action is a premium connector in Power Automate. Ensure your organization's license allows its use, or that you are using a trial that permits it.
*   **PAT Security and Expiration:**
    *   The GitHub PAT is a powerful credential. Store it securely and consider its expiration date. You will need to update the PAT in this flow when it expires.
    *   If your organization allows, explore using Azure Key Vault to store the PAT and have Power Automate retrieve it from there, which is a more secure practice.
*   **GitHub API Rate Limits:** For a single user and infrequent uploads, you are unlikely to hit GitHub API rate limits. However, be aware of them if the volume increases.

This Power Automate flow, once configured correctly, will bridge the gap between your inbox and your GitHub repository, enabling the automated processing pipeline.
