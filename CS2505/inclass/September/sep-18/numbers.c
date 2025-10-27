

#include "functions.h"

int main()
{
    int numbers[ARRAY_SIZE];//this is an aray of ten numbers
   
    int counter = 0;
    printf("Tell me no more than 10 integers: ");
    read_data(numbers, &counter);
    print_numbers(numbers, counter);
    int sum = sum_numbers(numbers, counter);
    double average = compute_average(sum, counter);
    printf("The sum of your numbers is %d\n", sum);
    printf("The average of your numbers is %f\n", average);
    return 0;
}