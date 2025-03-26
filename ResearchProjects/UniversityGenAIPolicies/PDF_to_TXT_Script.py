import fitz  # PyMuPDF
import os

def pdf_to_txt(pdf_path, txt_path):
    """Converts a PDF file to a TXT file."""
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)

        # Extract text from PDF
        with open(txt_path, "w", encoding="utf-8") as txt_file:
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                txt_file.write(page.get_text())
                txt_file.write("\n")  # Add a newline between pages

        print(f"Conversion successful: {txt_path}")
    except Exception as e:
        print(f"Error: {e}")


def main():
    """Main function to get file paths and run the conversion."""
    pdf_path = input("Enter the path to the PDF file: ").strip()

    # Validate file existence
    if not os.path.isfile(pdf_path):
        print("Invalid file path. Please try again.")
        return

    # Generate output file path
    txt_path = pdf_path.replace(".pdf", ".txt")

    # Convert PDF to TXT
    pdf_to_txt(pdf_path, txt_path)


if __name__ == "__main__":
    main()
