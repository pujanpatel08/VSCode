#include <stdio.h>
#include <stdlib.h>
#include "geo.h"

//converts coordinate to total seconds
int to_seconds(struct Coordinate c) {
    int total = c.degrees * 3600 + c.minutes * 60 + c.seconds;
    if (c.direction == 'W' || c.direction == 'S') {
        total *= -1;
    }
    return total;
}

//cnverts total seconds into a DMS coordinate
struct Coordinate seconds_to_dms(int total_seconds) {
    struct Coordinate result;
    result.direction = ' ';
    result.degrees = total_seconds / 3600;
    total_seconds %= 3600;
    result.minutes = total_seconds / 60;
    result.seconds = total_seconds % 60;
    return result;
}

//reads one full line of coordinates from the input file
int read_coordinate(FILE* in,
                    struct Coordinate* long1, struct Coordinate* lat1,
                    struct Coordinate* long2, struct Coordinate* lat2) {

    return fscanf(in,
        "%3d%2d%2d%c %2d%2d%2d%c %3d%2d%2d%c %2d%2d%2d%c",
        &long1->degrees, &long1->minutes, &long1->seconds, &long1->direction,
        &lat1->degrees,  &lat1->minutes,  &lat1->seconds,  &lat1->direction,
        &long2->degrees, &long2->minutes, &long2->seconds, &long2->direction,
        &lat2->degrees,  &lat2->minutes,  &lat2->seconds,  &lat2->direction
    );
}

//calculates the taxicab distance between two points
int calc_distance(struct Coordinate long1, struct Coordinate lat1,
                  struct Coordinate long2, struct Coordinate lat2) {
    int lon_diff = abs(to_seconds(long1) - to_seconds(long2));
    int lat_diff = abs(to_seconds(lat1) - to_seconds(lat2));
    return lon_diff + lat_diff;
}

//prints the coordinates and distance in formatted output
void print_coordinates(FILE* out,
                       struct Coordinate long1, struct Coordinate lat1,
                       struct Coordinate long2, struct Coordinate lat2,
                       int total_seconds, struct Coordinate dms_distance) {
    fprintf(out,
        "(%03dd %02dm %02ds %c, %02dd %02dm %02ds %c)   "
        "(%03dd %02dm %02ds %c, %02dd %02dm %02ds %c)   "
        "%8d     %3dd %02dm %02ds\n",
        long1.degrees, long1.minutes, long1.seconds, long1.direction,
        lat1.degrees,  lat1.minutes,  lat1.seconds,  lat1.direction,
        long2.degrees, long2.minutes, long2.seconds, long2.direction,
        lat2.degrees,  lat2.minutes,  lat2.seconds,  lat2.direction,
        total_seconds,
        dms_distance.degrees, dms_distance.minutes, dms_distance.seconds
    );
}

