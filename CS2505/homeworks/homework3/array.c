#include "array.h"
#include <stdio.h>
#include <stdbool.h>

// As a Hokie, I will conduct myself with honor and integrity at all times.
// I will not lie, cheat, or steal, nor will I accept the actions of those who do.

/*
This function will set every array index to the value 0 and sets the count of the data to 0.
*/
void initialize(struct Array* data) {
    for (int i = 0; i < SIZE; i++) {
        data->values[i] = 0;
    }
    data->count = 0;
}

/*
This function takes a pointer to an Array struct and a number as an element. 
The element should be placed at the next available position in the Array struct. 
If the array has no more available indices, then false is returned from the function. 
Otherwise, return true.
*/
bool add(struct Array* data, int element) {
    if (data->count < SIZE) {
        data->values[data->count] = element;
        data->count++;
        return true;
    } 
    return false; 
}

/*
This function takes a pointer to an Array struct, a number as an element, and an index. 
The element should be placed at the given index in the Array. Return true if the addition was successful.

If the given index is 0 or less than 0, add data to the beginning of the array. 
If index is count or greater than count, add data to the end of the array. 
Otherwise, make a space in the array and store the data at the given index. 
Any data that was at the given index and in index positions greater than the given one, are moved up one index position. 
If the array has no more available indices, then false is returned from the function. Otherwise, return true.
*/
bool addAt(struct Array* data, int element, int index) {
    if (data->count < SIZE) {
        if (index <= 0) {
            for (int i = data->count; i > 0; i--) {
                data->values[i] = data->values[i - 1];
            }
            data->values[0] = element;
            data->count++;
            return true;
        } else if (index >= data->count) {
            data->values[data->count] = element;
            data->count++;
            return true;
        } else {
            for (int i = data->count; i > index; i--) {
                data->values[i] = data->values[i - 1];
            }
            data->values[index] = element;
            data->count++;
            return true;
        }
    }
    return false; 
}

/*
This function takes an Array struct (not a pointer) and a number as an element. 
If the element exists in the Array, return the first index where the element appears. 
If the element does not appear in the Array, return -1.
*/
int find(struct Array data, int element) {
    for (int i = 0; i < data.count; i++) {
        if (data.values[i] == element) {
            return i;
        }
    } 
    return -1; 
}

/*
This function takes an Array struct (not a pointer) and a number as an element. 
If the element is in the Array, return true; otherwise, return false.
*/
bool contains(struct Array data, int element) { 
    for (int i = 0; i < data.count; i++) {
        if (data.values[i] == element) {
            return true;
        }
    }
    return false; 
}

/*
This function takes a pointer to an Array struct and an index value. 
The element at position ‘index’ should be removed and all elements followed it should be moved to a lower index in the Array by one. 
If the item at the index is successfully removed, return true; otherwise, return false.
*/
bool removeAt(struct Array* data, int index) { 
    if (index >= 0 && index < data->count) {
        for (int i = index; i < data->count - 1; i++) {
            data->values[i] = data->values[i + 1];
        }
        data->count--;
        return true;
    }
    return false; 
}

/*
This function takes an Array struct and a file pointer. 
Output the data in the given array to the output file in a comma separated list of values.
If all is true, then every element in the array is displayed, including any that may not have values. 
Also a message about the size of the array is given on the next line.
If all is false, then you only display the elements that have been set. 
Also, on the next line, a message about how many elements are in the array is output.

See the example output for details on the second line of output.
*/
void display(struct Array data, FILE* out, bool all) {
    if (all) {
        fprintf(out, "\t");
        for (int i = 0; i < SIZE; i++) {
            fprintf(out, "%d", data.values[i]);
            if (i < SIZE - 1) {
                fprintf(out, ", ");
            }
        }
        fprintf(out, "\n\tSIZE of array: %d\n", SIZE);
    } else {
        if (data.count > 0) {
            fprintf(out, "\t");
            for (int i = 0; i < data.count; i++) {
                fprintf(out, "%d", data.values[i]);
                if (i < data.count - 1) {
                    fprintf(out, ", ");
                }
            }
            fprintf(out, "\n");
        }
        fprintf(out, "\tCount of elements in array: %d\n", data.count);
    }
}

/*
This function takes a pointer to an Array struct. All elements should be reset to 0.
*/
void clear(struct Array* data) {
    for (int i = 0; i < SIZE; i++) {
        data->values[i] = 0;
    }
    data->count = 0;
}

