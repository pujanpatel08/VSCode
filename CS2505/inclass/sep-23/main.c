#include <stdio.h>
#include "points.h"
/*
main takes arguments
historically they are called argc and argv
argc - or argument count
argv - or vector of arguments
*/
int main(int argc, char* argv[])
{
    if ( argc != 2 )
    {
        printf("Usage: points <file>\n");
        return 1;
    }
    FILE* in = fopen(argv[1], "r");
    int x;
    int y;
    while( read_points(in, &x, &y)== 2)
    {
        display_points(stdout, x, y);
    }

    fclose(in);

    return 0;
}