#include <stdio.h>
#include <stdlib.h>

int main() {
    
    int * x;
    //this is read backwards
    //x is a pointer to an int
    //x * int
    //at this time, x has no target
    //
    x = NULL;
    printf( "%p\n", x );

    //how to give up x and address
    //2 ways
    //address-of operator
    
    int y = 10;

    x = &y;
    printf( "%p\n", x );
    printf( "%p\n", &y );      
    printf( "%d\n", *x );
    printf( "%d\n", y );

    *x = 8;
    printf( "%p\n", x );
    printf( "%p\n", &y );      
    printf( "%d\n", *x );
    printf( "%d\n", y );

    //way2
    //dynamic memory
    //
    x = malloc( 1 * sizeof(int) );
    //x is a local automatic variable
    //the target of x is not longer automatic
    //it is dynamically allocated
    //so we need to clean it up
    //or we need to release the memory
    printf( "%p\n", x );
    printf( "%p\n", &y );      
    printf( "%d\n", *x );
    printf( "%d\n", y );
}