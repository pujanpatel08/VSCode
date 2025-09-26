#include <math.h>
#include <stdio.h>

/**
 * These are the function signatures for the 3 required C functions in 
 * this assignment. You may assume the 2 vectors in the fuction calls are the same length.
 */ 

double dot_product(const double vec1[], const double vec2[], int arr_len);

double angle_between(const double vec1[], const double vec2[], int arr_len);

void subtract(double v1_dir, double v1_mag, double v2_dir, double v2_mag, double* new_dir, double* new_mag);

