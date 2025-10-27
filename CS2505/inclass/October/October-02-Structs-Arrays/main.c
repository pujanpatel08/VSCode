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
	
    struct Point p1;
    struct Point p2;
    int counter = 0;

    while( read_points(in, &x, &y)== 2)
    {
	if ( counter % 2 == 0 )
	{
		//p1 = update_point(x, y);
		update_point_2(&p1, x, y);
		display_points(stdout,p1);
	}
	else
	{
		//p2 = update_point(x, y);
		update_point_2(&p2, x, y);
		display_points(stdout,p2);
		double distance = compute_distance(p1, p2);
		fprintf(stdout, "The distance between p1 and p2 is %lf\n", distance);
	}
	counter++;
    }
    
/*
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

    */
    fclose(in);


    return 0;
}
