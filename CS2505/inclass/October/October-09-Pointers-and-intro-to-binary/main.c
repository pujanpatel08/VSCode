
#include <stdio.h>
#include <stdlib.h>

void release_memory( int* *ptr )
{
	free(*ptr);
	*ptr = NULL;
}

int main()
{

	int * x;
	//this is read backwards
	//x is a pointer to an int
	//x * int
	//at this time, x has no target
	//
	x = NULL;
	printf( "%p\n", x );

	//how to give x an address
	//2 ways
	//address-of operator &
	
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

	//way #2 
	//dynamic memory
	//
	x = malloc( 1 * sizeof(int) );
	// x is a local automatic variable
	// the target of x is no longer automatic
	// it is dynamically allocated
	// so we need to clean it up
	// or we need to release the memory
	*x = 5;
	printf( "%p\n", x );
	printf( "%p\n", &y );
	printf( "%d\n", *x );
	printf( "%d\n", y );

	//if we don't release the memory we'll have
	//a memory leak
	release_memory(&x);
	//this will release the target of the pointer
	//it does NOT change the value in the pointer
	//that is, the pointer still retains the same
	//memory address it had before
	//access the target after a call to free is
	//an error.
	printf( "%p\n", x );
	printf( "%p\n", &y );
	//printf( "%d\n", *x );
	printf( "%d\n", y );
}
