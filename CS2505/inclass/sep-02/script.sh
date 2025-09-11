#! /bin/bash

# chmod u+x script.sh 

echo $(whoami)

echo "Will print to the screen whatever you say"
echo "USER name: $USER"
echo 'USER name: $USER'
echo "Home directory: $HOME"
echo "Host name: $HOST"
echo "Path: $PATH"
echo "Shell: $SHELL"

ls -l

exitcode="$?" # no spaces around the assignment

# this is a comment


echo "ls exited with code $exitcode"

one=1
two=2
three=$((one + two))

echo $one
echo $two
echo $three 
