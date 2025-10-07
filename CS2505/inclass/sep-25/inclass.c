#include <stdio.h>

int main()
{
    FILE* in = fopen("input.txt", "r");
    double data1;
    int data2;

    while(fscanf(in, "%lf:%*[^:]:%d\n", &data1, &data2 ) == 2)
    {
        fprintf(stdout, "data 1: %.1lf\tdata 2: %d\n", data1, data2);
    }
    fclose(in);
}