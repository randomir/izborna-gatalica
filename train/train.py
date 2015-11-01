#!/usr/bin/env python
import numpy as np
from sklearn import tree
from sklearn.externals.six import StringIO

scores = np.array([
    [2, 5, 5, 5, 1, 5, 1, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 1, 1, 5],
    [2, 4, 4, 4, 1, 5, 2, 2, 4, 4, 2, 4, 2, 4, 4, 2, 3, 1, 1, 5],
    [5, 5, 5, 3, 1, 3, 1, 1, 2, 5, 3, 1, 2, 3, 3, 2, 3, 3, 1, 3],
    [5, 5, 5, 5, 1, 1, 1, 4, 4, 1, 4, 1, 5, 2, 5, 5, 4, 1, 1, 2],
    [5, 5, 5, 5, 1, 2, 2, 1, 5, 2, 5, 1, 2, 2, 5, 2, 2, 1, 1, 2],
    [5, 5, 4, 5, 2, 3, 1, 2, 5, 5, 3, 1, 3, 1, 1, 3, 1, 3, 1, 2],
    [4, 5, 1, 3, 1, 4, 5, 2, 5, 5, 4, 2, 1, 4, 3, 2, 2, 1, 1, 4],
    [2, 4, 5, 4, 2, 4, 5, 2, 5, 2, 2, 1, 4, 3, 5, 5, 5, 2, 2, 4],
    [5, 5, 5, 3, 1, 3, 3, 2, 5, 1, 5, 1, 3, 3, 4, 5, 4, 1, 1, 5],
    [3, 4, 2, 5, 2, 2, 2, 2, 5, 2, 2, 5, 5, 5, 4, 2, 5, 1, 3, 2],
    [1, 5, 3, 4, 1, 4, 3, 2, 5, 2, 2, 2, 1, 5, 5, 2, 5, 1, 2, 4],
    [4, 2, 5, 5, 2, 4, 2, 1, 5, 4, 3, 1, 1, 5, 3, 5, 3, 1, 1, 5]
])
scores_off = scores - 3
scores_norm = (scores_off.T / np.linalg.norm(scores_off, axis=1)).T


def classify(user, scores_norm):
    u = np.nan_to_num(user / np.linalg.norm(user))
    d = np.sum(user * scores_norm, axis=1)
    return np.argmax(d)

def generate(n_samples, scores_norm):
    n_questions = len(scores_norm[0])
    X = np.random.random_integers(-2, 2, [n_samples, n_questions])
    Y = []
    for x in X:
        Y.append(classify(x, scores_norm))
    return X, Y

def train(X, Y):
    clf = tree.DecisionTreeClassifier()
    clf = clf.fit(X, Y)
    return clf

def export(clf, filename):
    with open(filename, 'w') as f:
        tree.export_graphviz(clf, out_file=f)

X, Y = generate(1000, scores_norm)
clf = train(X, Y)
export(clf, 'tree.dot')
