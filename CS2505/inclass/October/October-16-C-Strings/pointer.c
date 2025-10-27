
#include <stdio.h>

void print_values( const int *, int count );

int main()
{
	int values[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

	print_values(values, 10);

}

void print_values( const int *data, int count )
{
	data[9] = 11;
	printf("Index\tData\n");
	for ( int i=0; i<count; i++ )
	{
		printf( "%d\t%d\n", i, *data );
		data++;
	}
}



