'''
https://machinelearningmastery.com/machine-learning-in-python-step-by-step/
Loads a dataset with associated attribute names, then reports on details
of the dataset including statistics and graphs
'''

import pandas
from pandas.plotting import scatter_matrix
import matplotlib.pyplot as plt

# Display full column width (no "...")
pandas.set_option('display.max_columns', None)
pandas.set_option('display.width', 1000)

# Load the CSV file
file = "cars.csv"
dataset = pandas.read_csv(file)

# Print dataset shape
print("The file " + file + " has data dimensioned " + str(dataset.shape[0]) + " rows by " + str(dataset.shape[1]) + " columns.")
# Show the first 20 rows
print("The first 20 rows of the dataset starting at 0 are: ")
print(dataset.head(20))

# Summary statistics for numeric columns
print("Summary of Statistics:")
print(dataset.describe())

# Group by car make
print("Number of instances per car make:")
print(dataset.groupby('Identification.Make').size())

# Box and whisker plots
dataset[['Dimensions.Height', 'Dimensions.Length', 'Dimensions.Width', 'Identification.Year']].plot(
    kind='box', subplots=True, layout=(2, 2), sharex=False, sharey=False)
plt.savefig('box.png')

# Histograms
dataset[['Dimensions.Height', 'Dimensions.Length', 'Dimensions.Width', 'Identification.Year']].hist()
plt.savefig('hist.png')

# Scatter plot matrix
scatter_matrix(dataset[['Dimensions.Height', 'Dimensions.Length', 'Dimensions.Width', 'Identification.Year']])
plt.tight_layout()
plt.savefig('matrix.png')
