#include <stdio.h>
#include <stdint.h>

void print_byte( int8_t byte );
void print_bits( uint8_t num );
void print_bytes( int num );

int main()
{
	int8_t byte = -42;
	print_byte( byte );
	uint8_t byte2 = 42;
	print_byte( byte2 );

	int number = 0x12AB34CD;
	print_bytes(number);
}


void print_bytes( int num )
{
	uint8_t* byte = (uint8_t*)&(num);
	for ( int i=0; i<4; i++ )
	{
		print_byte(*byte);
		byte++;
	}
}

void print_byte( int8_t byte )
{
	fprintf( stdout, "%hhd %hhu ", byte, byte );
	print_bits( byte );
	fprintf( stdout, "0x%hhX ", byte );

	fputs("\n", stdout);
}

void print_bits( uint8_t num )
{
	for ( int i=sizeof(uint8_t)*8-1; i>=0; i-- )
	{	
		fprintf(stdout, "%d", (num>>i) & 1 );
		if ( i%4 == 0 ) fprintf(stdout, " ");
	}
}






