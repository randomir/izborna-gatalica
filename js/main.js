//require('data.js')
//require('math.js')

function renderQuestions(answers) {
    var $target = $("#questions").empty(),
        $controls = $("#questions-controls").empty();
    var tplSection = $("#template-section").html();
    var tplQuestion = $("#template-question").html();
    var tplControls = $($controls.data('template')).html();
    for (var sectionId = 0, questionId = 0; sectionId < questions.length; sectionId++) {
        var sectionQuestions = questions[sectionId];
        
        $target.append($(Mustache.render(tplSection, {
            text: sectionQuestions.sectionTitle
        })));
        
        for (var id = 0; id < sectionQuestions.texts.length; id++, questionId++) {
            var html = Mustache.render(tplQuestion, {
                text: sectionQuestions.texts[id],
                id: questionId,
                val: answers && answers[questionId],
                entropy: questionEntropies[id]
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
        updatePartyMatchesAsSelected();
    });
    $controls.append($(Mustache.render(tplControls, {nQuestions: nQuestions})));
    $("#keep-questions-sorted").on('click', function() {
        setTimeout($.proxy(function() {
            var sorted = $(this).hasClass('active');
            if (sorted) {
                orderQuestionsByDataKey('entropy', true);
            } else {
                orderQuestionsByDataKey('question-id');
            }
            limitQuestionsAsSelected();
        }, this), 0);
    });
    $('#questions-limit').slider();
    $("#questions-limit").on('change', function(e) {
        limitQuestionsTo(e.value.newValue);
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

function renderSimilarityToggles($target) {
    var tpl = $("#template-similarity-toggle").html();
    for (var sectionId = 0; sectionId < questions.length; sectionId++) {
        var section = questions[sectionId];
        $target.append($(Mustache.render(tpl, {
            title: section.shortTitle,
            sectionId: sectionId
        })));
    }
}

function calcPartyMatchesAngleBased(userScores) {
    var matches = [];
    for (var i = 0; i < partyScores.length; i++) {
        matches.push({
            id: i,
            score: angleAsPercent(partyScores[i], userScores)
        });
    }
    return matches;
}

function calcPartyMatchesDistanceBased(userScores) {
    var matches = [], maxdist = -1;
    for (var i = 0; i < partyScores.length; i++) {
        var dist = distance(partyScores[i], userScores);
        matches.push({id: i, dist: dist});
        if (dist > maxdist) maxdist = dist;
    }
    for (var i = 0; i < partyScores.length; i++) {
        matches[i].score = 100 * (maxdist - matches[i].dist) / maxdist;
    }
    return matches;
}

function updatePartyMatches(userScores) {
    var matches = calcPartyMatchesAngleBased(userScores);
    //var matches = calcPartyMatchesDistanceBased(userScores);
    $(".party-score").each(function() {
        var elem = $(this), id = elem.data('party-id'),
            val = Math.round(matches[id].score), percent = val+'%';
        elem.data('aria-valuenow', val).css({width: percent}).text(percent);
    });
    if ($("#keep-parties-sorted").is(".active")) {
        orderPartiesByMatching(matches);
    }
}

function updatePartyMatchesAsSelected() {
    updatePartyMatches(getUserScores());
}

function getUserScores() {
    return $(".answer-slider").sort(function(a, b) {
        return +$(a).data('question-id') - +$(b).data('question-id');
    }).map(function() {
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

function orderQuestionsByDataKey(key, reverse) {
    var cmp = function(a, b) {
        var order = +$(a).data(key) - +$(b).data(key);
        return reverse ? -order : order;
    };
    $("#questions .section").remove();
    var q = $("#questions .question").detach();
    q.sort(cmp);
    $("#questions").append(q);
}

function limitQuestionsTo(n) {
    $("#questions .section").slideUp();
    $("#questions .question").slice(0, n).slideDown();
    $("#questions .question").slice(n).slideUp().find(".answer-slider").each(function() {
        var inp = $(this);
        inp.data('old-val', inp.val());
        inp.data('slider').setValue(3);
    });
    updatePartyMatchesAsSelected();
}

function limitQuestionsAsSelected() {
    limitQuestionsTo($("#questions-limit").val());
}

function sliceScoresBySection(sections) {
    var slicedScores = [];
    for (var i = 0; i < partyScores.length; i++) {
        var scores = [];
        for (var j = 0; j < sections.length; j++) {
            var sectionId = sections[j], section = questions[sectionId];
            scores = scores.concat(partyScores[i].slice(section.offset, section.offset+section.count));
        }
        slicedScores.push(scores);
    }
    return slicedScores;
}

var network = null;
function drawSimilarityGraph(selectedSections) {
    var nodes = [];
    var edges = [];
    var n = partyNames.length;
    var sim = similarityMatrix(selectedSections && sliceScoresBySection(selectedSections) || partyScores);
    
    for (var i = 0; i < n; i++) {
        nodes.push({id: i, value: 1, label: partyNames[i]});
    }
    
    var scaled = function(x) {
        return Math.exp(x/100 - 0.5) / Math.exp(0.5);
    };
    for (var i = 1; i < n; i++) {
        for (var j = 0; j < i; j++) {
            var xs = scaled(sim[i][j]);
            if (xs > 0.69) {
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
        },
    };
    if (!network) {
        network = new vis.Network(container, data, options);
    } else {
        network.setOptions({physics: {stabilization: false}});
        network.setData(data);
    }
}

$(function() {
    renderQuestions(neutralScores);
    renderParties($("#results"));
    $(".answer-slider:first").trigger('change');
    
    var updateResultsPaneWidth = function() {
        $("#results-pane").css({width: $("#questions-pane").width()});
    };
    $("#results-pane").affix({
        offset: {
            top: $("#results-pane").offset().top,
            bottom: $(document).height() - $("#similarity-section").offset().top + 40
        }
    }).on('affixed.bs.affix', updateResultsPaneWidth);
    $(window).on('resize', updateResultsPaneWidth);
    updateResultsPaneWidth();
    
    $(".party-score-link").on('click', function() {
        var id = $(this).data('party-id');
        var scores = partyScores[id];
        renderQuestions(scores);
        updatePartyMatches(scores);
        return false;
    });
    $("#keep-parties-sorted").on('click', function() {
        var elem = $(this);
        elem.toggleClass('active');
        if (!elem.hasClass('active')) {
            orderPartiesById();
        } else {
            updatePartyMatchesAsSelected();
        }
    });
    
    renderSimilarityToggles($("#similarity-toggles"));
    $("#similarity-toggles .btn").on('click', function() {
        var btn = $(this), active = btn.hasClass('active');
        btn.toggleClass('btn-default', active);
        btn.toggleClass('btn-success', !active);
        setTimeout(function() {
            var selectedSectionIds = $("#similarity-toggles input:checked").map(function() {
                return $(this).data('section-id');
            });
            drawSimilarityGraph(selectedSectionIds);
        }, 0);
    });
    $("#toggle-all").on("click", function() {
        $("#similarity-toggles .btn:not(.active)").click();
    });
    $("#toggle-none").on("click", function() {
        $("#similarity-toggles .btn.active").click();
    });
    
    drawSimilarityGraph();
});
