#! /bin/bash

sum=0

#if [[ $# -ne 2 ]]; then
#    echo "Invoation: ./math.sh integer integer"
#    exit 1
#fi 

#left=$1
#right=$2

#sum=$((left + right))

if [[ $# -eq 0 ]]; then
    echo "Nothing to add"
    exit 1
fi

for x; do 
    echo "      $x"
    sum=$(($sum + $x))
done

echo $sum


