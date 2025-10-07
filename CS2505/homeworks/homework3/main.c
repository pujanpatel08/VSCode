#include "array.h"
#include <string.h>

int main( int argc, char** argv )
{
	if ( argc != 3 )
	{
		fprintf(stderr, "USAGE: %s <input file> <output file>\n", argv[0] );
		exit(1);
	}

	FILE* in = fopen( argv[1], "r" );
	FILE* out = fopen( argv[2], "w" );

	struct Array arramy;

	initialize(&arramy);
	
	char command[100] = {'\0'};

	int num1, num2;

	while( fscanf( in, "%s",command ) == 1 ) 
	{
		fprintf( out, "Command: %s ", command );
		if ( strcmp( command, "add" ) == 0 )
		{
			fscanf(in, "%d", &num1 );
			fprintf( out, "%d", num1 );
			char c = '0';
			fscanf( in, "%c", &c );
			bool added = false;
			if ( c == ' ' )
			{
				fscanf(in, "%d", &num2 );
				fprintf( out, " %d\n", num2 );
				added = addAt( &arramy, num1, num2 );
			}
			else
			{
				fputs( "\n", out );
				added = add( &arramy, num1 );
			}
			if ( added ) 
				fprintf( out, "\t%d successfully added\n", num1 );
			else
				fprintf( out, "\t%d not added\n", num1 );


		}
		else if ( strcmp( command, "find" ) == 0 )
		{
			fscanf( in, "%d", &num1 );
			fprintf( out, "%d\n", num1 );
			int index = find(arramy, num1 );
			if ( index != -1 )
				fprintf( out, "\t%d found at index %d\n", num1, index );
			else
				fprintf( out, "\t%d not found in array\n", num1 );
		}
		else if ( strcmp( command, "contains" ) == 0 )
		{
			fscanf( in, "%d", &num1 );
			fprintf( out, "%d\n", num1 );
			bool contained = contains(arramy, num1 );
			if ( contained )
				fprintf( out, "\t%d contained in array\n", num1);
			else
				fprintf( out, "\t%d not contained in array\n", num1 );
		}
		else if ( strcmp( command, "removeAt" ) == 0 )
		{
			fscanf( in, "%d", &num1 );
			fprintf( out, "%d\n", num1 );
			bool removed = removeAt(&arramy, num1 );
			if ( removed )
				fprintf( out, "\tdata removed from array at index %d\n", num1);
			else
				fprintf( out, "\tdata not removed array at index %d\n", num1 );
			
		}
		else if ( strcmp( command, "display" ) == 0 )
		{
			fscanf(in, "%s", command);
			bool all = false;
			if ( strcmp(command, "all") == 0 )
			{
				all = true;
			}
			fprintf(out, "%s\n", command);
			display( arramy, out, all);
		}
		else if ( strcmp( command, "clear" ) == 0 )
		{
			fputs( "\n", out );
			clear( &arramy );
		}

	}

	fclose(in);
	fclose(out);

	return 0;
}
