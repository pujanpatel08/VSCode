#include <stdio.h>

int main()
{
	int x = 5;
	int *p = &x;
	int *q = p;
	*q = 12;
	printf("The value of x is %d\n", x);
	return 0;
}
