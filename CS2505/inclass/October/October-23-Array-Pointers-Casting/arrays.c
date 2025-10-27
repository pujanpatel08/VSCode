#include <stdio.h>

void print_array( FILE* out, int* array, int count );
int main()
{
	int array[] = {1,2,3,4,5};

	int* first_elemenet = array;
	int* second_element = &array[1];

	fprintf( stdout, "%d %d\n", *first_elemenet, *second_element);

	print_array(stdout, array, 5);

}

void print_array( FILE* out, int* array, int count )
{
	for ( int i=0; i<count; i++, array++ )
	{
		fprintf( out, "%p ", (array) );
		//fprintf( out, "%d ", array[i] );
		fprintf( out, "%d ", *(array) );
	}
	fputs("\n", stdout);
}





