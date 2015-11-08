#!/usr/bin/env python
import numpy as np
import json
from itertools import izip
from functools import partial
from sklearn import tree
from sklearn.externals.six import StringIO

scores = np.array([
    #0  0  0  0  0  0  0  0  0  0  1  1  1  1  1  1  1  1  1  1  2  2  2  2  2  2  2  2  2  2  3  3  3  3  3  3  3
    #0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5  6
    [2, 5, 5, 5, 1, 5, 1, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 1, 1, 5, 3, 3, 3, 2, 5, 3, 3, 3, 1, 5, 1, 3, 3, 3, 5, 4, 5],
    [2, 4, 4, 4, 1, 5, 2, 2, 4, 4, 2, 4, 2, 4, 4, 2, 3, 1, 1, 5, 1, 5, 5, 2, 2, 2, 2, 1, 5, 1, 1, 5, 1, 4, 2, 4, 5],
    [5, 5, 5, 3, 1, 3, 1, 1, 2, 5, 3, 1, 2, 3, 3, 2, 3, 3, 1, 3, 4, 5, 2, 2, 3, 3, 2, 1, 5, 1, 5, 1, 2, 1, 1, 3, 2],
    [5, 5, 5, 5, 1, 1, 1, 4, 4, 1, 4, 1, 5, 2, 5, 5, 4, 1, 1, 2, 5, 5, 2, 2, 4, 4, 3, 1, 2, 2, 4, 5, 2, 4, 2, 1, 4],
    [5, 5, 5, 5, 1, 2, 2, 1, 5, 2, 5, 1, 2, 2, 5, 2, 2, 1, 1, 2, 4, 5, 2, 3, 4, 4, 2, 1, 2, 1, 1, 5, 1, 1, 2, 1, 2],
    [5, 5, 4, 5, 2, 3, 1, 2, 5, 5, 3, 1, 3, 1, 1, 3, 1, 3, 1, 2, 2, 5, 3, 2, 3, 4, 2, 2, 2, 1, 4, 2, 1, 2, 1, 1, 4],
    [4, 5, 1, 3, 1, 4, 5, 2, 5, 5, 4, 2, 1, 4, 3, 2, 2, 1, 1, 4, 5, 5, 4, 2, 4, 2, 3, 2, 4, 1, 3, 4, 4, 2, 3, 2, 3],
    [2, 4, 5, 4, 2, 4, 5, 2, 5, 2, 2, 1, 4, 3, 5, 5, 5, 2, 2, 4, 2, 3, 5, 4, 2, 4, 5, 3, 2, 3, 1, 2, 2, 3, 5, 4, 4],
    [5, 5, 5, 3, 1, 3, 3, 2, 5, 1, 5, 1, 3, 3, 4, 5, 4, 1, 1, 5, 1, 5, 5, 4, 1, 5, 5, 5, 1, 4, 1, 2, 1, 1, 1, 2, 1],
    [3, 4, 2, 5, 2, 2, 2, 2, 5, 2, 2, 5, 5, 5, 4, 2, 5, 1, 3, 2, 4, 3, 4, 2, 4, 2, 1, 1, 3, 3, 1, 2, 3, 1, 2, 2, 5],
    [1, 5, 3, 4, 1, 4, 3, 2, 5, 2, 2, 2, 1, 5, 5, 2, 5, 1, 2, 4, 4, 4, 4, 2, 2, 3, 2, 1, 1, 5, 1, 2, 1, 5, 3, 1, 3],
    [4, 2, 5, 5, 2, 4, 2, 1, 5, 4, 3, 1, 1, 5, 3, 5, 3, 1, 1, 5, 5, 5, 2, 3, 3, 5, 2, 1, 1, 5, 2, 2, 1, 4, 3, 2, 3]
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

def generate_distrib(n_samples_per_class, scores_norm):
    """Generate a set of points with `n_samples_per_class` distribution of
    point's classes."""
    n_samples = sum(n_samples_per_class)
    X, Y = [], []
    while len(Y) < n_samples:
        Xi, Yi = generate(n_samples, scores_norm)
        for x, y in izip(Xi, Yi):
            if n_samples_per_class[y] > 0:
                X.append(list(x))
                Y.append(y)
                n_samples_per_class[y] -= 1
    return X, Y

def train(X, Y, **kwargs):
    clf = tree.DecisionTreeClassifier(**kwargs)
    clf = clf.fit(X, Y)
    return clf

def export_dot(clf, filename, **kwargs):
    with open(filename, 'w') as f:
        tree.export_graphviz(clf, out_file=f, **kwargs)

def export_json(clf, filename):
    t = clf.tree_
    N = t.n_node_samples[0]
    round2 = partial(round, ndigits=2)
    with open(filename, 'w') as f:
        json.dump({
            "n_nodes": t.node_count,
            "max_depth": t.max_depth,
            "feature": t.feature.tolist(),
            "threshold": t.threshold.tolist(),
            "children_left": t.children_left.tolist(),
            "children_right": t.children_right.tolist(),
            "gini": t.impurity.tolist(),
            "n_samples": [round2(100.0*n/N) for n in
                          t.n_node_samples.tolist()],
            "distribution": [map(round2, 100.0*x/n) for x, n in
                             izip(t.value[:,0], t.n_node_samples)],
        }, fp=f, indent=2)


if __name__ == '__main__':
    # train test (overfit)
    #clf12 = train(scores, np.arange(0, 12))
    #export_dot(clf12, '12.dot')
    #export_json(clf12, '12.json')

    X, Y = generate_distrib(len(scores_norm) * [1000000], scores_norm)
    clf = train(X, Y, max_depth=7)
    export_dot(clf, 'tree.dot', proportion=True)
    export_json(clf, 'tree.json')
