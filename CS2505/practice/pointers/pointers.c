#include <stdio.h>

int main() {

    int age = 21; //variable has a value and an address
    int *pAge = &age;

    printf("This is the value of age: %d\n", age);
    printf("This is the memory address of age: %p\n", &age);

    printf("This is the value of age: %d\n", *pAge);
    printf("This is the memory address of age: %p\n", pAge);

    return 0;
}