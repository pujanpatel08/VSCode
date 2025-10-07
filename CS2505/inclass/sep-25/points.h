
#include <stdio.h>

struct Point
{
    int x;
    int y;
}; // <=== yes the ; goes here


int read_points( FILE*, int*, int*);
void display_points( FILE* out, int x, int y);