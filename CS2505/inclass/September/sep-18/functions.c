
#include "functions.h"

void read_data( int numbers[], int* counter)
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