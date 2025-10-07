
#include "functions.h"

void read_data( int *numbers, int* counter)
//the pointer, *, on the parameters means
/*
    1. that the counter is pass-by-pointer
    2. we should expect that the parameter is changed

    We use pass-by-pointer when
    1. we to change a parameter
    2. and let the calling function know about the change. 
*/
{
    int x;
    while(scanf("%d", &x) == 1 && *counter < ARRAY_SIZE)
    {
           // printf( "%d\n",x );
            numbers[*counter] = x;
            (*counter)++;
    }
}

int sum_numbers(int numbers[], int counter)
/*
the int counter here is pass-by-copy or pass-by-value
the default passing mechaism for everything in C is
pass-by-copy
this includes when you pass a pointer, you get a copy
of the address
*/
{
    int sum = 0;
    for ( int i=0; i<counter; i++ )
        sum += numbers[i];

    return sum;
}
void print_numbers( int numbers[], int counter)
{
    for ( int i=0; i<counter; i++ )
        printf("%d ", numbers[i]);
    printf("\n");
}

double compute_average( int sum, int counter)
{
    //return (double)sum / counter;
    double average = (double)sum / counter;
    return average;
}
