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

function matrixTransposed(mx) {
    var mxT = [];
    for (var c = 0; c < mx[0].length; c++) {
        var row = [];
        for (var r = 0; r < mx.length; r++) {
            row.push(mx[r][c]);
        }
        mxT.push(row);
    }
    return mxT;
}

function matrixColumn(mx, col) {
    if (mx.length < 1) return [];
    if (col >= mx[0].length) throw "Matrix column index out of range.";
    var v = [];
    for (var row = 0; row < mx.length; row++) {
        v.push(mx[row][col]);
    }
    return v;
}

Array.prototype.sum = function() {
    return this.reduce(function(a, b) {
        return a + b;
    });
};

Array.prototype.count = function(predicate) {
    return this.reduce(function(prev, cur) {
        return prev + (predicate(cur) ? 1 : 0);
    }, 0);
};

Array.prototype.max = function(isgreaterthen) {
    return this.reduce(function(prev, cur) {
        return isgreaterthen(cur, prev) ? cur : prev;
    });
};

Array.prototype.torange = function(start, stop, step) {
    step = step || 1;
    this.splice(0, this.length);
    for (; start < stop; start += step) this.push(start);
    return this;
};

function questionSplitGain(scores, splitQuestionIdx, splitValue) {
    var questionScores = matrixColumn(scores, splitQuestionIdx);
    var n = questionScores.length;
    var belowCnt = questionScores.count(function(x) {return x <= splitValue});
    var aboveCnt = n - belowCnt;
    if (belowCnt == 0 || aboveCnt == 0) return 0;
    return (Math.log(n)
            - (belowCnt/n)*Math.log(belowCnt)
            - (aboveCnt/n)*Math.log(aboveCnt)) / Math.log(2);
}

function questionGain(scores, questionIdx) {
    var splits = [].torange(1.5, 5);
    var gains = splits.map(function(x) {
        return [x, questionSplitGain(scores, questionIdx, x)];
    });
    return gains.max(function(a, b) {
        return a[1] > b[1];
    });
}

function findOptimalSplit(scores) {
    var questions = [].torange(0, scores[0].length);
    var gains = questions.map(function(x) {
        return [x, questionGain(scores, x)];
    });
    return gains.max(function(a, b) {
        return a[1] > b[1];
    });
}