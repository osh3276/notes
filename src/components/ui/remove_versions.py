#!/usr/bin/env python3
"""
Script to remove version specifications (@#.#.#) from the first 10 lines of files in the UI folder.
This script will find patterns like @1.2.3, @0.487.0, etc. and remove them from import statements.
"""

import os
import re
import glob
from pathlib import Path

def remove_version_specs_from_file(file_path):
    """
    Remove version specifications from the first 10 lines of a file.

    Args:
        file_path (str): Path to the file to process

    Returns:
        bool: True if file was modified, False otherwise
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        if not lines:
            return False

        modified = False
        # Process only the first 10 lines
        for i in range(min(10, len(lines))):
            original_line = lines[i]
            # Remove version specifications like @1.2.3, @0.487.0, etc.
            # Pattern matches @ followed by version numbers (digits, dots, alphanumeric)
            modified_line = re.sub(r'@[\d\w\.-]+', '', original_line)

            if original_line != modified_line:
                lines[i] = modified_line
                modified = True
                print(f"  Line {i+1}: Removed version spec")
                print(f"    Before: {original_line.strip()}")
                print(f"    After:  {modified_line.strip()}")

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            return True

        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all files in the current directory."""

    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    print(f"Processing files in: {script_dir}")

    # File extensions to process
    extensions = ['*.ts', '*.tsx', '*.js', '*.jsx']

    total_files = 0
    modified_files = 0

    for ext in extensions:
        pattern = script_dir / ext
        files = glob.glob(str(pattern))

        for file_path in files:
            # Skip the Python script itself
            if file_path.endswith('.py'):
                continue

            total_files += 1
            file_name = os.path.basename(file_path)
            print(f"\nProcessing: {file_name}")

            if remove_version_specs_from_file(file_path):
                modified_files += 1
                print(f"  ✓ Modified {file_name}")
            else:
                print(f"  - No changes needed for {file_name}")

    print(f"\n" + "="*50)
    print(f"Summary:")
    print(f"  Total files processed: {total_files}")
    print(f"  Files modified: {modified_files}")
    print(f"  Files unchanged: {total_files - modified_files}")

    if modified_files > 0:
        print(f"\n✓ Successfully removed version specifications from {modified_files} files!")
    else:
        print(f"\n- No version specifications found in the first 10 lines of any files.")

if __name__ == "__main__":
    main()
