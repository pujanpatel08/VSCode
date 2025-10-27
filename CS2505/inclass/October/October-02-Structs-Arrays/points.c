#include "points.h"
#include <math.h>

int read_points( FILE* in, int* x, int* y)
{
    //the data is in the form x, y
    return fscanf(in, "%d, %d", x ,y);
}
void display_points( FILE* out, struct Point p )
{
    fprintf(out, "%d, %d\n", p.x, p.y);
    
}
struct Point update_point( int x, int y)
{
	struct Point p;
	p.x = x;
	p.y = y;

	return p;
}

void update_point_2( struct Point *p, int x, int y)
{
	(*p).x = x; //derefence the pointer then field select
	p->y = y;
}
double compute_distance( struct Point p1, struct Point p2 )
{
	double diff_x = p1.x - p2.x;
	double diff_y = p1.y - p2.y;

	return sqrt( diff_x * diff_x + diff_y * diff_y );
}
