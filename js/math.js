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

function add(a, b) {
    if (a.length != b.length) return;
    for (var i = 0, res = a.slice(); i < res.length; i++) {
        res[i] += b[i];
    }
    return res;
}

function scale(n, a) {
    for (var i = 0, res = a.slice(); i < res.length; i++) {
        res[i] *= n;
    }
    return res;
}

function normalized(a) {
    return add(a, scale(-1, neutralScores));
}

function angleAsPercent(a, b) {
    return 100 * (1 - angle(normalized(a), normalized(b)) / Math.PI);
}
