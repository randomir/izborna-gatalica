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

function renderQuestions($target) {
    var tpl = $("#template-question").html();
    for (var id = 0; id < questionTexts.length; id++) {
        var html = Mustache.render(tpl, {text: questionTexts[id], id: "question-"+id});
        $target.append($(html));
    }
    $('.answer-slider').slider({
        formatter: function(value) {
            return answerDesc[value];
        }
    });
    //$(".answer-slider").on('change', function(e) {
    //    var slider = $("#"+$(this).data('slider-id'));
    //    $(".slider-selection", slider).css({background: answerColors[e.value.newValue]});
    //});
    $(".answer-slider").on('change', function(e) {
        var userScores = $(".answer-slider").map(function() {
            return $(this).data('slider').getValue();
        });
        updatePartyMatches(userScores);
    });
}

function renderParties($target) {
    var tpl = $("#template-party-match").html();
    for (var id = 0; id < partyNames.length; id++) {
        var html = Mustache.render(tpl, {name: partyNames[id], id: "party-"+id, match: 0});
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
    return Math.acos(cos);
}

function add(a, b) {
    if (a.length != b.length) return;
    for (var i = 0, res = a.slice(); i < a.length; i++) {
        res[i] += b[i];
    }
    return res;
}

function scale(n, a) {
    for (var i = 0; i < a.length; i++) {
        a[i] *= n;
    }
    return a;
}

function normalized(a) {
    var mid = new Array(a.length+1).join("3").split('').map(parseFloat);
    return add(a, scale(-1, mid));
}

function match(a, b) {
    return 100 * (1 - angle(normalized(a), normalized(b)) / Math.PI);
}

function calcPartyMatches(userScores) {
    var matches = [];
    for (var i = 0; i < partyScores.length; i++) {
        matches.push(match(partyScores[i], userScores));
    }
    return matches;
}

function updatePartyMatches(userScores) {
    var matches = calcPartyMatches(userScores);
    $(".party-score").each(function(idx) {
        var elem = $(this), val = Math.round(matches[idx]), percent = val+'%';
        elem.data('aria-valuenow', val).css({width: percent}).text(percent);
    });
}

$(function() {
    renderQuestions($("#questions"));
    renderParties($("#results"));
    $(".answer-slider").trigger('change');
});
