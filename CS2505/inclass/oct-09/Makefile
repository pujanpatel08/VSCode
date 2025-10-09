# Makefile for main.c

# Compiler and flags
CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -g
TARGET = main
SOURCE = main.c

# Default target
all: $(TARGET)

# Build the executable
$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCE)

# Run the program
run: $(TARGET)
	./$(TARGET)

# Clean up generated files
clean:
	rm -f $(TARGET)

# Debug target with additional debugging flags
debug: CFLAGS += -DDEBUG -O0
debug: $(TARGET)

# Release target with optimization
release: CFLAGS += -O2 -DNDEBUG
release: clean $(TARGET)

# Help target
help:
	@echo "Available targets:"
	@echo "  all     - Build the executable (default)"
	@echo "  run     - Build and run the program"
	@echo "  clean   - Remove generated files"
	@echo "  debug   - Build with debug flags"
	@echo "  release - Build optimized version"
	@echo "  help    - Show this help message"

# Declare phony targets
.PHONY: all run clean debug release help