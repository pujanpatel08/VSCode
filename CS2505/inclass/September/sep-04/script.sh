#! /bin/bash 

# echo "Echo will print to the screen"

#echo "User name:           $USER"
#echo 'User name:           $USER'
#echo "Home directory:      $HOME"
#echo "Host name:           $HOSTNAME"
#echo "Path:                $PATH"
#echo "Current working dir: $PWD"

#ls -l

#exitcode="$?"

#echo "Exit code from ls was $exitcode"

one=1
two=2
three=$((one + two))

echo "one $one"
echo "two $two"
echo "three $three"

one=2

((three = one + two))

echo "one $one"
echo "two $two"
echo "three $three"

let one=5

let three=one+two
echo "one $one"
echo "two $two"
echo "three $three"

let "one = 15"

let "three = one + two"
echo "one $one"
echo "two $two"
echo "three $three"

files=$(ls)

echo $files