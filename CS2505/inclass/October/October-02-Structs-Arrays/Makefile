
# target: dependencies
# 	command
#
# this is a comment

points: main.o points.o points.h
	gcc -lm main.o points.o -o points

main.o: main.c points.h
	gcc -c -Wall -Wextra main.c
	
points.o: points.c points.h
	gcc -c -Wall -Wextra points.c

clean:
	rm *.o points


