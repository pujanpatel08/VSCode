#include <stdio.h>
#include <string.h>

struct Student {
    char name[20];
    int age;
    float gpa;
}; 

int main() {

    struct Student Pujan;
    strcpy(Pujan.name, "Pujan");
    Pujan.age = 19;
    Pujan.gpa = 3.957;

    printf("The students name is: %s\n", Pujan.name);
    printf("The students age is: %d\n", Pujan.age);
    printf("The students gpa is: %.2f\n", Pujan.gpa);
   
    return 0;
}  
