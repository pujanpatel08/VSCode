#!/bin/bash

#store commandline arguments in variables
classes_folder=$1
semester_folder=$2
archive_dir="archive"

#check archive folder
if [ -d "$archive_dir" ]; then
    echo "Folder called archive already exists."
else
    mkdir "$archive_dir"
    echo "Folder called archive created."
fi

#check classes folder
if [ ! -d "$classes_folder" ]; then
    echo "Folder $classes_folder does not exist. Nothing moved."
    exit 1
fi

#check semester folder
if [ -d "$archive_dir/$semester_folder" ]; then
    echo "Folder for $semester_folder already exists."
else
    mkdir "$archive_dir/$semester_folder"
    echo "Folder called $semester_folder created inside the archive."
fi

#move files
mv "$classes_folder"/* "$archive_dir/$semester_folder"/

echo "Move complete."