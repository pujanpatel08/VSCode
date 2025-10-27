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
    /*
    int x;
    int y;
    while( read_points(in, &x, &y)== 2)
    {
        display_points(stdout, x, y);
    }
    */

    char name[100];
    char address[100] = "blank";
    char phone[100];

  //  fscanf(in, "%s,%s,%s\n", name, address, phone );
    fscanf( in, "%[^,],%*[^,],%[^\n]\n", name, phone);
    //these are scansets in the [ ]
    //actually they are negative scansets because of the ^ means not
    //so everything that is not a ,
    //the %* will ignore, or not store, the data that is read
    //so you don't need a variable to store that data
    fprintf( stdout, "Name: %s\nAddress: %s\nPhone: %s\n",name, address, phone );

    fclose(in);

    return 0;
}
