var answerDesc = {
    1: "snažno podržavam",
    2: "djelomično podržavam",
    3: "neutralan sam",
    4: "djelomično se protivim",
    5: "snažno se protivim"
};

var answerColors = {
    1: "#00ff00",
    2: "#009900",
    3: "yellow",
    4: "pink",
    5: "red"
};

var questionTexts = [
    "Sadašnji je broj županija optimalan i odgovora političkim, ekonomskim i društvenim potrebama zemlje.",
    "Porezni prihodi lokalnih jedinica odgovaraju njihovoj zakonskoj ulozi i potrebama.",
    "Lokalne jedinice nisu nikakva zapreka za jaču investicijsku aktivnost u zemlji.",
    "Zaposleni u jedinicama lokalne samouprave trebaju imati veću razinu radnih prava i veća primanja nego zaposleni u javnoj upravi.",
    "Jedinice lokalne samouprave trebaju više participirati u raspodjeli poreznih prihoda.",
    "Porez na nekretnine znatno će popraviti fiskalnu poziciju lokalnih jedinica i treba ga uvesti.",
    "Jedinice lokalne samouprave koriste se kao sinekure za zbrinjavanje stranačkog kadra."
];

var partyNames = [
    "Živi zid",
    "U ime obitelji",
    "Pametno",
    "ORaH",
    "Naprijed Hrvatska",
    "MOST",
    "IDS",
    "HKS",
    "HDSSB",
    "Bandić",
    "HDZ",
    "SDP"
];

var partyScores = [
    [2, 5, 5, 5, 1, 5, 1],
    [2, 4, 4, 4, 1, 5, 2],
    [5, 5, 5, 3, 1, 3, 1],
    [5, 5, 5, 5, 1, 1, 1],
    [5, 5, 5, 5, 1, 2, 2],
    [5, 5, 4, 5, 2, 3, 1],
    [4, 5, 1, 3, 1, 4, 5],
    [2, 4, 5, 4, 2, 4, 5],
    [5, 5, 5, 3, 1, 3, 3],
    [3, 4, 2, 5, 2, 2, 2],
    [1, 5, 3, 4, 1, 4, 3],
    [4, 2, 5, 5, 2, 4, 2]
];
var neutralScores = new Array(partyScores[0].length+1).join("3").split('').map(parseFloat);

function renderQuestions($target, answers) {
    $target.empty();
    var tpl = $("#template-question").html();
    for (var id = 0; id < questionTexts.length; id++) {
        var html = Mustache.render(tpl, {
            text: questionTexts[id],
            id: "question-"+id,
            val: answers && answers[id]
        });
        $target.append($(html));
    }
    $('.answer-slider').slider({
        formatter: function(value) {
            return answerDesc[value];
        }
    });
    $(".answer-slider").on('change', function(e) {
        updatePartyMatches(getUserScores());
    })
}

function renderParties($target) {
    var tpl = $("#template-party-match").html();
    for (var id = 0; id < partyNames.length; id++) {
        var html = Mustache.render(tpl, {
            name: partyNames[id],
            id: id,
            match: 0
        });
        $target.append($(html));
    }
}

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

function match(a, b) {
    return 100 * (1 - angle(normalized(a), normalized(b)) / Math.PI);
}

function calcPartyMatches(userScores) {
    var matches = [];
    for (var i = 0; i < partyScores.length; i++) {
        matches.push({
            id: i,
            score: match(partyScores[i], userScores)
        });
    }
    return matches;
}

function updatePartyMatches(userScores) {
    var matches = calcPartyMatches(userScores);
    $(".party-score").each(function() {
        var elem = $(this), id = elem.data('party-id'),
            val = Math.round(matches[id].score), percent = val+'%';
        elem.data('aria-valuenow', val).css({width: percent}).text(percent);
    });
    if ($("#keep-parties-sorted").is(".active")) {
        orderPartiesByMatching(matches);
    }
}

function getUserScores() {
    return $(".answer-slider").map(function() {
        return $(this).data('slider').getValue();
    });
}

function orderPartiesByMatching(matches) {
    var ordered = matches.slice(), $box = $("#results");
    ordered.sort(function(a, b) {
        return +(a.score > b.score) || +(a.score === b.score) - 1;
    });
    for (var i = 0; i < ordered.length; i++) {
        var p = ordered[i];
        $(".party-match[data-party-id="+p.id+"]").detach().prependTo($box);
    }
}

function orderPartiesById() {
    for (var i = 0; i < partyNames.length; i++) {
        $(".party-match[data-party-id="+i+"]").detach().appendTo("#results");
    }
}

$(function() {
    renderQuestions($("#questions"), neutralScores);
    renderParties($("#results"));
    $(".answer-slider").trigger('change');
    $(".party-score-link").on('click', function() {
        var id = $(this).data('party-id');
        var scores = partyScores[id];
        renderQuestions($("#questions"), scores);
        updatePartyMatches(scores);
        return false;
    });
    $("#keep-parties-sorted").on('click', function() {
        var elem = $(this);
        elem.toggleClass('active');
        if (!elem.hasClass('active')) {
            orderPartiesById();
        } else {
            updatePartyMatches(getUserScores());
        }
    });
});
