#include <stdio.h>

void function( int * nums, int* p, int* q );
void print_array( int * nums, int count );
void print_backwards( int * nums, int count );

int main()
{
	int nums[] = {10,20,30,40,50};
	int *p = nums + 2;
	int *q = &nums[4];

	print_array( nums, 5 );
	function( nums, p, q );

	return 0;
}
void function( int * nums, int* p, int* q )
{
	p = p - 1;
	*p = *q - 10;
	nums = q;

	print_backwards( nums, 5 );

}
void print_array( int * nums, int count )
{
	for ( int i=0; i<count; i++ )
	{
		fprintf(stdout, "%d ", nums[i] );
	}
	fputs( "\n", stdout );
}

void print_backwards( int * nums, int count )
{
	for ( int i=0; i<count; i++ )
	{
		fprintf(stdout, "%d ", *(nums-i));
	}
	fputs( "\n", stdout );
}

