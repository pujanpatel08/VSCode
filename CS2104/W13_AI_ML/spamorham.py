# -*- coding: utf-8 -*-
# Naive Bayes Email Classifier using scikit-learn

import os
import io
import numpy
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# ------------------------------------------------------------------------------
# SECTION 1: Function to Read Emails from File System
# ------------------------------------------------------------------------------

def readFiles(path):
    """
    Reads email files from the specified directory.
    Extracts the body of each email (ignoring headers) and yields its content.
    
    Args:
        path (str): Path to the directory containing email files.

    Yields:
        tuple: (filename, email body as string)
    """
    for root, dirnames, filenames in os.walk(path):
        for filename in filenames:
            filepath = os.path.join(root, filename)
            inBody = False
            lines = []

            with io.open(filepath, 'r', encoding='latin1') as f:
                for line in f:
                    if inBody:
                        lines.append(line)
                    elif line == '\n':  # Empty line indicates end of header
                        inBody = True

            message = '\n'.join(lines)
            yield filepath, message

# ------------------------------------------------------------------------------
# SECTION 2: Convert Email Files into a DataFrame
# ------------------------------------------------------------------------------

def dataFrameFromDirectory(path, classification):
    """
    Builds a DataFrame from email files with a given classification (e.g., 'spam' or 'ham').

    Args:
        path (str): Path to email directory.
        classification (str): Label for classification ('spam' or 'ham').

    Returns:
        pandas.DataFrame: DataFrame containing messages and their class labels.
    """
    rows = []
    index = []
    
    for filename, message in readFiles(path):
        rows.append({'message': message, 'class': classification})
        index.append(filename)

    return pd.DataFrame(rows, index=index)

# ------------------------------------------------------------------------------
# SECTION 3: Create DataFrame for Spam and Ham Emails
# ------------------------------------------------------------------------------

# Initialize an empty DataFrame
data = pd.DataFrame({'message': [], 'class': []})

# TODO: Set your correct path to spam and ham directories (Use absolute paths)
data = pd.concat([
    dataFrameFromDirectory('spam', 'spam'),
    dataFrameFromDirectory('ham', 'ham')
])

# Print dataset summary
print(data.head())
print(data.tail())
print(data.info())

# ------------------------------------------------------------------------------
# SECTION 4: Train a Naive Bayes Classifier
# ------------------------------------------------------------------------------

# CountVectorizer tokenizes text and converts it to a frequency matrix
vectorizer = CountVectorizer()
counts = vectorizer.fit_transform(data['message'].values)

# Extract the target labels (spam or ham)
targets = data['class'].values

# Create and train the Multinomial Naive Bayes classifier
classifier = MultinomialNB()
classifier.fit(counts, targets)

# ------------------------------------------------------------------------------
# SECTION 5: Test the Model with Sample Emails (Fun Part!)
# ------------------------------------------------------------------------------

sample = ['Free iPhone!', "We regret to inform that your paper has been rejected."]
sample_counts = vectorizer.transform(sample)
predictions = classifier.predict(sample_counts)
probabilities = classifier.predict_proba(sample_counts)

print(sample, predictions)
print(sample, probabilities)

#Students own examples
sample = ['Free iPhone!', 'You have won!', 'Meeting at 2pm', 'Important update on your account', 'Let’s grab coffee', 'Congrats, you’ve been selected!']
sample_counts = vectorizer.transform(sample)
predictions = classifier.predict(sample_counts)
probabilities = classifier.predict_proba(sample_counts)
print(sample, predictions, probabilities)  

# ------------------------------------------------------------------------------
