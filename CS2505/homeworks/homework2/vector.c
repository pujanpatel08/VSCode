//Pujan Patel
//PID: pujanpatel8
//As a Hokie, I will conduct myself with honor and integrity at all times. I will not lie, cheat, or steal, nor will I accept the actions of those who do.

#include <stdio.h>
#include <math.h>
#include "vector.h"

// Function to calculate the dot product of two vectors
double dot_product(const double vec1[], const double vec2[], int arr_len) {
    double result = 0.0;
    for (int i = 0; i < arr_len; i++) {
        result += vec1[i] * vec2[i];
    }
    return result;
}

// Function to calculate the angle between two vectors in degrees
double angle_between(const double vec1[], const double vec2[], int arr_len) {
    double dot = dot_product(vec1, vec2, arr_len);
    
    // Calculate magnitudes of both vectors
    double mag1 = 0.0, mag2 = 0.0;
    for (int i = 0; i < arr_len; i++) {
        mag1 += vec1[i] * vec1[i];
        mag2 += vec2[i] * vec2[i];
    }
    mag1 = sqrt(mag1);
    mag2 = sqrt(mag2);

    // Calculate cosine of the angle
    double cos_theta = dot / (mag1 * mag2);

    // Clamp cos_theta to [-1,1] to avoid domain errors due to floating point
    if (cos_theta > 1.0) cos_theta = 1.0;
    if (cos_theta < -1.0) cos_theta = -1.0;

    // Convert angle to degrees
    double angle_rad = acos(cos_theta);
    double angle_deg = angle_rad * (180.0 / M_PI);

    return angle_deg;
}

// Function to subtract two vectors (v1 - v2) given in polar coordinates
void subtract(double v1_dir, double v1_mag, double v2_dir, double v2_mag, double* new_dir, double* new_mag) {
    // Convert directions from degrees to radians
    double v1_rad = v1_dir * (M_PI / 180.0);
    double v2_rad = v2_dir * (M_PI / 180.0);

    // Convert polar to Cartesian coordinates
    double v1_x = v1_mag * cos(v1_rad);
    double v1_y = v1_mag * sin(v1_rad);
    double v2_x = v2_mag * cos(v2_rad);
    double v2_y = v2_mag * sin(v2_rad);

    // Subtract vectors
    double res_x = v1_x - v2_x;
    double res_y = v1_y - v2_y;

    // Convert back to polar coordinates
    *new_mag = sqrt(res_x * res_x + res_y * res_y);
    *new_dir = atan2(res_y, res_x) * (180.0 / M_PI);

    // Ensure direction is between 0-360 degrees
    if (*new_dir < 0) {
        *new_dir += 360.0;
    }
}
