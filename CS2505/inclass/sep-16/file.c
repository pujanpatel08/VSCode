#include <stdio.h>

int main() {
    int x, y, z;

    FILE* in = fopen("input.txt", "r");
    //FILE * is a pointer
    //a pointer is a variable that holds a memory address
    //fopen will open a file, adn you specify the direction, e.g. input or output
    //I means read, or input
    FILE* out = fopen("output.txt", "w");
    //w means write, or output

    int how_much = fscanf(in, "%d %d %d", &x, &y, &z);

      // the & in C is the adddress-of operator
    /*
    This operator gives you the address-of the variable
    we need the address of a variable when we want to pass
    that variable into a function, modify that variable AND
    know about the modification
    */
   if ((how_much = fscanf(in, "%d %d %d", &x, &y, &z) == 3)) {
    fprintf(out, "I read this many data points: %d\n", how_much);
    fprintf(out, "And they are as follows: %d %d %d", x, y, z);
   }
   else {
        fprintf(out, "I had an error reading the data\n");
   }

    fclose(in);
    fclose(out);

    return 0;
}