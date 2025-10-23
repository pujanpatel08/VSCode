#ifndef GEO_H
#define GEO_H

#include <stdio.h>

struct Coordinate {
    int degrees;
    int minutes;
    int seconds;
    char direction;
};

//reads one line of input into four coordinates and returns number of successful fields read (should be 16 on success)
int read_coordinate(FILE* in,
                    struct Coordinate* long1, struct Coordinate* lat1,
                    struct Coordinate* long2, struct Coordinate* lat2);

//prints formatted coordinates and distance info to output file
void print_coordinates(FILE* out,
                       struct Coordinate long1, struct Coordinate lat1,
                       struct Coordinate long2, struct Coordinate lat2,
                       int total_seconds, struct Coordinate dms_distance);

//calculates the taxicab distance between two coordinate pairs
int calc_distance(struct Coordinate long1, struct Coordinate lat1,
                  struct Coordinate long2, struct Coordinate lat2);

//converts a DMS coordinate into total seconds
int to_seconds(struct Coordinate c);

//converts a distance in total seconds into DMS format
struct Coordinate seconds_to_dms(int total_seconds);

#endif
