import os

# Set the path to your target directory
directory = "banners/"

# Supported image extensions
image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp')

# Loop through files in the directory
for filename in os.listdir(directory):
    if filename.lower().endswith(image_extensions):
        old_path = os.path.join(directory, filename)
        new_filename = '0' + filename
        new_path = os.path.join(directory, new_filename)

        # Rename the file
        os.rename(old_path, new_path)
        print(f"Renamed: {filename} -> {new_filename}")
