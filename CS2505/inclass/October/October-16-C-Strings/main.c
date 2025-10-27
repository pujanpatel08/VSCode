#include <stdio.h>
#include <string.h>
#include <stdlib.h>

char* copy_string( const char* const name );

int main()
{
	/*
	 * Strings in C
	 * C strings are arrays of characters
	 */ 
	char name[150] = "Dave McPherson";
	printf("Name: %s\n", name );

	/*
	 * C chose to use a "special character" to 
	 * end each string.
	 * Forgetting to use this character will cause
	 * so many issues.
	 * That character is known as the Null Terminated Character
	 * or
	 * '\0'
	 * Note the use of the ' ' to indicate that this is a character
	 * and the \ means that the 0 is not a number, but a character.
	 *
	 * this means we need to leave 1 extra space for this character.
	 *
	 * The \0 is not part of the length of the string
	 */ 
	char* name_copy;
	name_copy = copy_string(name);
	printf("Copy: %s\n", name_copy);
	free(name_copy);
}

char* copy_string( const char* const name )
{
	int length = strlen(name);
	char *name_copy = calloc(length+1 , sizeof(char));
	for ( int i=0; i<length; i++ )
	{
		name_copy[i] = name[i];
	}
	return name_copy;
}

void copy_string_2( const char* const name, char* *dest)
{
	int length = strlen(name);
	char *name_copy = calloc(length+1 , sizeof(char));
	for ( int i=0; i<length; i++ )
	{
		name_copy[i] = name[i];
	}
	*dest = name_copy;
}


