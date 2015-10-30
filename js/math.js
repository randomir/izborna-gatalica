function dot(a, b) {
    if (a.length != b.length) return;
    for (var i = 0, res = 0; i < a.length; i++) {
        res += a[i] * b[i];
    }
    return res;
}

function norm(a) {
    for (var i = 0, sum = 0; i < a.length; i++) {
        sum += a[i] * a[i];
    }
    return Math.sqrt(sum);
}

function angle(a, b) {
    var cos = dot(a, b) / norm(a) / norm(b);
    if (isNaN(cos)) cos = 0;
    cos = Math.max(-1, Math.min(cos, 1));
    return Math.acos(cos);
}

function sub(a, b) {
    if (a.length != b.length) return;
    for (var i = 0, res = a.slice(); i < res.length; i++) {
        res[i] -= b[i];
    }
    return res;
}

function add(a, b) {
    return sub(a, scale(-1, b));
}

function scale(n, a) {
    for (var i = 0, res = a.slice(); i < res.length; i++) {
        res[i] *= n;
    }
    return res;
}

function vector(n, val) {
    val = val || 0;
    var v = Array(n);
    for (var i = 0; i < n; i++) v[i] = val;
    return v;
}

function neutral(a) {
    return neutralScores.slice(0, a.length);
}

function normalized(a) {
    return sub(a, neutral(a));
}

function angleAsPercent(a, b) {
    return 100 * (1 - angle(normalized(a), normalized(b)) / Math.PI);
}

function distance(a, b) {
    return norm(sub(a, b));
}

// lower-triangular matrix of simalirity scores between parties
function similarityMatrix(vectors) {
    var n = vectors.length, similarity = [];
    for (var i = 0; i < n; i++) {
        var row = vector(n, 0);
        for (var j = 0; j <= i; j++) {
            row[j] = angleAsPercent(vectors[i], vectors[j]);
        }
        similarity.push(row);
    }
    return similarity;
}