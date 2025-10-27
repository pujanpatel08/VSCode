// this is a comment
/*
This is a multiline comment
*/

// #include is a mechanism to go and get a file and bring it to the 
// place where we typed #include

#include <stdio.h>

/*
2 flavors for #include 
    ones with <>
    and ones with ""

Ones that use <> use the standard location for includes
the ones that use "" you will specify the path to the file

any line that starts with a # is a preprocessor directive
more on this later
*/

// This is a function, we know its a function becuase of the ()
// every c program will have 1 and only 1 main function
// main returns an int, or an integer
// an int is a whole number, can be positive and negative
int main() {
    // this is a block of code from the { to the }
    printf("Hello, World!\n");
    // printf is the function to print a string with formatting

    // to run this program we msut compile this program
    // gcc is our compiler
    // we give it some options, and the file(s) to compile
    // assuming no errors, we can then run the executable
    // running gcc main.c creates a file called a.out
    // running a.out will run the executable
    // a.out need the file path so run ./a.out
    // to change the file name from a.out to something else, when compiling, run gcc mian.c -o *newName*
    // need to debug, add the debugging symbols: gcc -o hello -g main.c
    // we do not list our header files, or our .h files

    int x;
    x = 10;

    printf( "x is %d\n", x);
    printf( "x is %u bytes long\n", sizeof(x));
    
    // This is the return value we use when nothing bad has happened
    // generally means that we ran succesfully
    // or no errors occured
    // 0 meaning false in C
    return 0;
}