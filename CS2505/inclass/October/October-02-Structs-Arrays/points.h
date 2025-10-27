
#include <stdio.h>

struct Point
{
    int x;
    int y;
}; // <=== yes the ; goes here


int read_points( FILE*, int*, int*);
void display_points( FILE* out, struct Point p );
struct Point update_point( int x, int y);
void update_point_2(struct Point * p, int x, int y);
double compute_distance( struct Point p1, struct Point p2 );
