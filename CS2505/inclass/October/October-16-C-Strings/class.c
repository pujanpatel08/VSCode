#include <stdio.h>
#include <stdlib.h>

int main() {

  int* x = calloc(4, sizeof(int)); //A
  x[2] = 3; //B
  int* y = x+2;
  x = NULL;
  y[1] = 8; //C
  free(y-2);
}


