#include "points.h"

int read_points( FILE* in, int* x, int* y)
{
    //the data is in the form x, y
    return fscanf(in, "%d, %d", x ,y);
}
void display_points( FILE* out, int x, int y)
{
    fprintf(out, "%d, %d\n", x, y);
}