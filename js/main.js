//require('data.js')
//require('math.js')

function renderQuestions($target, answers) {
    $target.empty();
    var tplSection = $("#template-section").html();
    var tplQuestion = $("#template-question").html();
    for (var sectionId = 0, questionId = 0; sectionId < questions.length; sectionId++) {
        var sectionQuestions = questions[sectionId];
        
        $target.append($(Mustache.render(tplSection, {
            text: sectionQuestions.sectionTitle
        })));
        
        for (var id = 0; id < sectionQuestions.texts.length; id++, questionId++) {
            var html = Mustache.render(tplQuestion, {
                text: sectionQuestions.texts[id],
                id: "question-" + questionId,
                val: answers && answers[questionId]
            });
            $target.append($(html));
        }
    }
    $('.answer-slider').slider({
        formatter: function(value) {
            return answerDesc[value];
        },
        reversed: true
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

function calcPartyMatches(userScores) {
    var matches = [];
    for (var i = 0; i < partyScores.length; i++) {
        matches.push({
            id: i,
            score: angleAsPercent(partyScores[i], userScores)
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

function drawSimilarityGraph() {
    var nodes = [];
    var edges = [];
    var n = partyNames.length;
    var sim = similarityMatrix(partyScores);
    var network = null;
    
    for (var i = 0; i < n; i++) {
        nodes.push({id: i, value: 1, label: partyNames[i]});
    }
    
    var scaled = function(x) {
        return Math.exp(x/100 - 0.5) / Math.exp(0.5);
    };
    for (var i = 1; i < n; i++) {
        for (var j = 0; j < i; j++) {
            var xs = scaled(sim[i][j]);
            if (xs > 0.7) {
                edges.push({from: i, to: j, value: xs, title: sim[i][j].toFixed(2)+"%"});
            }
        }
    }
    
    var container = $("#similarity-graph")[0];
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
        }
    };
    network = new vis.Network(container, data, options);
}

$(function() {
    renderQuestions($("#questions"), neutralScores);
    renderParties($("#results"));
    $(".answer-slider:first").trigger('change');
    
    var updateResultsPaneWidth = function() {
        $("#results-pane").css({width: $("#questions-pane").width()});
    };
    $("#results-pane").affix({
        offset: {
            top: $(".page-header:first").outerHeight(true) - 20,
            bottom: $(document).height() - $("#similarity-section").offset().top
        }
    }).on('affixed.bs.affix', updateResultsPaneWidth);
    $(window).on('resize', updateResultsPaneWidth);
    
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
    
    drawSimilarityGraph();
});
