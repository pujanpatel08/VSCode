#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

#define SIZE 20

struct Array
{
	int values[SIZE];
	int count;
};

bool add( struct Array* data, int element );
bool addAt( struct Array* data, int element, int index );
int find( struct Array  data, int element );
bool contains( struct Array  data, int element );
bool removeAt( struct Array * data, int index);
void display( struct Array  data, FILE* out, bool all );
void clear( struct Array* data );
void initialize( struct Array* data );
