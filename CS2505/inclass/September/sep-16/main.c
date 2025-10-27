#include <stdio.h>

//gcc -o guess -Wall -Wextra main.c
//gcc is our compiler
//-o neams our output whatever we put after -o
//-Wall means warn all, or give me all the warnings
//-Wextra means give me all of the warnings -Wall doesn't give
//then I give c files I want to compile


int main() {
    int x;
    printf("Tell me a number:\n");
    scanf("%d", &x); // read in x

    if (x == 7) {
        printf("Yeah, x is %d\n", x);
    }
    else {
        printf("Boo x was not 7\n");
        printf("x is %d\n", x);
    }

    return 0;
}