//Pujan Patel
//PID: pujanpatel8
//As a Hokie, I will conduct myself with honor and integrity at all times. I will not lie, cheat, or steal, nor will I accept the actions of those who do.

#include <math.h>
#include "vector.h"


//computes tdot product of vectors
double dot_product(const double vec1[], const double vec2[], int arr_len) {
    double sum = 0.0;
    for (int i = 0; i < arr_len; i++) {
        sum += vec1[i] * vec2[i];
    }
    return sum;
}

//calcs angle between vectors
double angle_between(const double vec1[], const double vec2[], int arr_len) {
    //dot product
    double dot = dot_product(vec1, vec2, arr_len);

    double mag1 = 0.0, mag2 = 0.0;
    for (int i = 0; i < arr_len; i++) {
        mag1 += vec1[i] * vec1[i];
        mag2 += vec2[i] * vec2[i];
    }
    mag1 = sqrt(mag1);
    mag2 = sqrt(mag2);

    //avoid dividing by zero
    if (mag1 == 0.0 || mag2 == 0.0) {
        return 0.0;
    }

    //cos(theta) = dot / (|v1| * |v2|)
    double cos_theta = dot / (mag1 * mag2);

    if (cos_theta > 1.0) cos_theta = 1.0;
    if (cos_theta < -1.0) cos_theta = -1.0;

    double radians = acos(cos_theta);
    return radians * (180.0 / M_PI);
}

//subtracts vector v2 from v1 
void subtract(double v1_dir, double v1_mag, double v2_dir, double v2_mag, double* new_dir, double* new_mag) {
    //convert degrees to radians
    double v1_rad = v1_dir * M_PI / 180.0;
    double v2_rad = v2_dir * M_PI / 180.0;

    double v1_x = v1_mag * cos(v1_rad);
    double v1_y = v1_mag * sin(v1_rad);
    double v2_x = v2_mag * cos(v2_rad);
    double v2_y = v2_mag * sin(v2_rad);

    double result_x = v1_x - v2_x;
    double result_y = v1_y - v2_y;

    *new_mag = sqrt(result_x * result_x + result_y * result_y);

    //compute direction
    double result_rad = atan2(result_y, result_x);
    double result_deg = result_rad * (180.0 / M_PI);

    //normalize to 0–360 degrees
    if (result_deg < 0) {
        result_deg += 360.0;
    }

    *new_dir = result_deg;
}
