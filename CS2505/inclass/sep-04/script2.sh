#! /bin/bash

files=$(ls)
echo "$files"
for file in $files; do
    ls -lh $file
    if [[ -d $file ]]; then 
        echo "This is a directory"
    fi
done

add_two()
{
    echo $1
    echo $2
    sum=$(($1+$2))
    echo $sum
    return $sum
}

add_two 128 128
answer="$?"
echo $answer