#include <stdio.h>
#include <stdlib.h>
#include "geo.h"

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: ./project2 <input file> <output file>\n");
        return 1;
    }

    FILE *in = fopen(argv[1], "r");
    FILE *out = fopen(argv[2], "w");

    if (!in || !out) {
        fprintf(stderr, "Error opening files.\n");
        return 1;
    }

    fprintf(out, "First coordinate                  Second coordinate                 seconds     DMS\n");
    fprintf(out, "----------------------------------------------------------------------------------------------------------\n");

    struct Coordinate long1, lat1, long2, lat2;

    while (read_coordinate(in, &long1, &lat1, &long2, &lat2) == 16) {
        int total_seconds = calc_distance(long1, lat1, long2, lat2);
        struct Coordinate dms = seconds_to_dms(total_seconds);
        print_coordinates(out, long1, lat1, long2, lat2, total_seconds, dms);
    }

    fclose(in);
    fclose(out);
    return 0;
}
