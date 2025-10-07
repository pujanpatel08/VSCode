CFLAGS = -Wall -Wextra -c -g -std=c11

all: arrays 

arrays: main.o array.o array.h
	gcc -o arrays main.o array.o

main.o: main.c array.h
	gcc ${CFLAGS} main.c

array.o: array.c array.h
	gcc ${CFLAGS} array.c

clean: 
	rm *.o arrays 

