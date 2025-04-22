'''
https://machinelearningmastery.com/machine-learning-in-python-step-by-step/
Loads a dataset with associated attribute names, then reports on details
of the dataset including statistics and graphs
'''

# Import the pandas library for data analysis
import pandas

# Import the scatter_matrix function to create a matrix of scatter plots
from pandas.plotting import scatter_matrix

# Import the pyplot module from matplotlib for plotting
import matplotlib.pyplot as plt


# Define the filename of the CSV file to load
file = "iris.csv"

# Specify the column names for the dataset
names = ['sepal-length', 'sepal-width', 'petal-length', 'petal-width', 'class']

# Load the CSV data into a pandas DataFrame with the specified column names
dataset = pandas.read_csv(file, names=names)

# Print the number of rows and columns in the dataset
print("The file " + file + " has data dimensioned " + str(dataset.shape[0]) + " rows by " + str(dataset.shape[1]) + " columns.")

# Print the first 20 rows of the dataset to get an overview
print("The first 20 rows of the dataset starting at 0 are: ")
print(dataset.head(20))

# Print summary statistics (mean, std, min, max, etc.) for each numeric column
print("Summary of Statistics:")
print(dataset.describe())

# Print the number of instances (rows) for each class/category
print(dataset.groupby('class').size())

# Create box-and-whisker plots for each numeric column in a 2x2 grid
dataset.plot(kind='box', subplots=True, layout=(2, 2), sharex=False, sharey=False)

# Save the boxplot figure to a file named 'box.png'
plt.savefig('box.png')

# Create histograms for each numeric column to show distributions
dataset.hist()

# Save the histogram figure to a file named 'hist.png'
plt.savefig('hist.png')

# Create a scatter plot matrix to visualize relationships between numeric columns
scatter_matrix(dataset)

# Save the scatter plot matrix to a file named 'matrix.png'
plt.savefig('matrix.png')
