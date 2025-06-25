import pandas as pd
import json
import os

# Define file paths
CSV_INPUT_FILE = 'input.csv'
HTML_TEMPLATE_FILE = 'template.html'
HTML_OUTPUT_FILE = 'report.html'
PLACEHOLDER_LINE = 'const embeddedInvoiceData = [];'

def create_dummy_csv_if_not_exists():
    """
    Creates a dummy input.csv if it doesn't exist, for testing purposes.
    The actual input.csv will be uploaded by Power Automate.
    """
    if not os.path.exists(CSV_INPUT_FILE):
        print(f"Warning: '{CSV_INPUT_FILE}' not found. Creating a dummy file for testing.")
        dummy_data = {
            'InvoiceID': [101, 102, 103, 104, 105],
            'PrinterModel': ['Xerox WorkCentre', 'HP LaserJet Pro', 'Canon imageRUNNER', 'Brother HL-L2390DW', 'Epson EcoTank'],
            'SerialNumber': ['XWX123456', 'HPLJP654321', 'CANIR987654', 'BHL2390ABC', 'EPSONETXYZ'],
            'ReadingDate': ['2023-10-01', '2023-10-02', '2023-10-01', '2023-10-03', '2023-10-02'],
            'BlackAndWhitePages': [1500, 2300, 800, 1250, 900],
            'ColorPages': [250, 100, 500, 50, 300],
            'Department': ['Marketing', 'Sales', 'Finance', 'HR', 'Marketing']
        }
        df = pd.DataFrame(dummy_data)
        df.to_csv(CSV_INPUT_FILE, index=False)
        print(f"Dummy '{CSV_INPUT_FILE}' created with sample data.")

def main():
    print("Starting report generation process...")

    # Create a dummy CSV if input.csv is missing (useful for local testing)
    # In the GitHub Action, input.csv should be present from the Power Automate upload.
    create_dummy_csv_if_not_exists()

    # 1. Read CSV file
    try:
        print(f"Reading CSV file: '{CSV_INPUT_FILE}'...")
        df = pd.read_csv(CSV_INPUT_FILE)
        print("CSV file read successfully.")
    except FileNotFoundError:
        print(f"Error: The file '{CSV_INPUT_FILE}' was not found.")
        print("Please ensure the CSV file is present in the root of the repository.")
        return
    except pd.errors.EmptyDataError:
        print(f"Error: The file '{CSV_INPUT_FILE}' is empty.")
        return
    except Exception as e:
        print(f"An error occurred while reading the CSV file: {e}")
        return

    # 2. Convert DataFrame to JSON array of objects
    print("Converting data to JSON...")
    # Handle potential NaT or NaN values by converting them to None (null in JSON)
    # Convert Timestamp objects to ISO format strings
    for col in df.select_dtypes(include=['datetime64[ns]']).columns:
        df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S') # Or any other format you prefer

    # Replace NaN with None for proper JSON null conversion
    df_filled = df.where(pd.notnull(df), None)
    json_data = df_filled.to_json(orient='records', indent=4, date_format='iso')
    print("Data converted to JSON successfully.")

    # 3. Read HTML template
    try:
        print(f"Reading HTML template file: '{HTML_TEMPLATE_FILE}'...")
        with open(HTML_TEMPLATE_FILE, 'r', encoding='utf-8') as f:
            html_content = f.read()
        print("HTML template read successfully.")
    except FileNotFoundError:
        print(f"Error: The HTML template file '{HTML_TEMPLATE_FILE}' was not found.")
        return
    except Exception as e:
        print(f"An error occurred while reading the HTML template: {e}")
        return

    # 4. Inject JSON data into HTML
    print("Injecting JSON data into HTML...")
    if PLACEHOLDER_LINE not in html_content:
        print(f"Error: Placeholder '{PLACEHOLDER_LINE}' not found in '{HTML_TEMPLATE_FILE}'.")
        print("Cannot inject data. Please ensure the placeholder is present in the HTML template.")
        return

    # Create the line to replace the placeholder
    # The json_data is already a string formatted as a JSON array.
    replacement_line = f'const embeddedInvoiceData = {json_data};'

    updated_html_content = html_content.replace(PLACEHOLDER_LINE, replacement_line)
    print("JSON data injected successfully.")

    # 5. Save the new HTML content
    try:
        print(f"Saving updated HTML to '{HTML_OUTPUT_FILE}'...")
        with open(HTML_OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(updated_html_content)
        print(f"Report successfully generated and saved as '{HTML_OUTPUT_FILE}'.")
    except Exception as e:
        print(f"An error occurred while saving the output HTML file: {e}")

if __name__ == '__main__':
    main()
