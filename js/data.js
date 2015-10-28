var answerDesc = {
    1: "snažno podržavam",
    2: "djelomično podržavam",
    3: "neutralan sam",
    4: "djelomično se protivim",
    5: "snažno se protivim"
};

var questions = [{
    sectionTitle: "Reforma javne uprave i lokalne samouprave",
    shortTitle: "Javna uprava i samouprava",
    texts: [
        "Sadašnji je broj županija optimalan i odgovora političkim, ekonomskim i društvenim potrebama zemlje.",
        "Porezni prihodi lokalnih jedinica odgovaraju njihovoj zakonskoj ulozi i potrebama.",
        "Lokalne jedinice nisu nikakva zapreka za jaču investicijsku aktivnost u zemlji.",
        "Zaposleni u jedinicama lokalne samouprave trebaju imati veću razinu radnih prava i veća primanja nego zaposleni u javnoj upravi.",
        "Jedinice lokalne samouprave trebaju više participirati u raspodjeli poreznih prihoda.",
        "Porez na nekretnine znatno će popraviti fiskalnu poziciju lokalnih jedinica i treba ga uvesti.",
        "Jedinice lokalne samouprave koriste se kao sinekure za zbrinjavanje stranačkog kadra."
    ]
}, {
    sectionTitle: "Javna poduzeća",
    shortTitle: "Javna poduzeća",
    texts: [
            "Republika Hrvatska treba potpuno privatizirati udjele koje ima u više od 500 tvrtki koje nisu od strateške važnosti.",
            "Potrebno je privatizirati udjele koje Republika Hrvatska ima u svim trgovačkim društvima, čak i onima koja su trenutačno proglašena strateškim.",
            "Država treba propisivati maksimalnu veličinu plaće menadžerima u javnim poduzećima."
    ]
}, {
    sectionTitle: "Javni dug",
    shortTitle: "Javni dug",
    texts: [
            "Hrvatska nema velik broj zaposlenih u javnom sektoru.",
            "Veličinu proračunskog deficita treba i zakonski ograničiti kako bi se onemogućilo neodgovorno financijsko ponašanje Vlade RH.",
            "Dugogodišnje koncesije nad državnom imovinom poželjan su model smanjivanja velikog javnog duga zemlje.",
            "Deficit proračuna treba smanjivati radikalnim mjerama štednje jer se samo tako može pod kontrolu dovesti rastući javni dug zemlje."
    ]
}, {
    sectionTitle: "Zdravstvo",
    shortTitle: "Zdravstvo",
    texts: [
        "Uvođenje privatnog sektora u zdravstvo povećat će efikasnost sustava i smanjiti trošak njegova financiranja iz javnih izvora.",
        "Imunološki zavod država je trebala privatizirati ili bar pred privatne investitore postaviti iste uvjete po kojima je ona sama poslije postupila.",
        "HZZO treba osnovati kreditne ili financijske ustanove koje će ulagati na financijskim tržištima i tako poticati razvoj gospodarstva i osigurati dodatna sredstva za zdravstveni sustav."
    ]
}, {
    sectionTitle: "Nezaposlenost mladih i poticanje poduzetništva",
    shortTitle: "Nezaposlenost mladih",
    texts: [
        "Hrvatska narodna banka treba imati aktivniju ulogu u razvoju hrvatskoga gospodarstva.",
        "Financijsko obrazovanje i kultura poduzetništva treba ući u obvezni obrazovni program.",
    ]
}, {
    sectionTitle: "Porezna reforma",
    shortTitle: "Porezna reforma",
    texts: [
        "Porez na nekretnine pravedan je i poželjan porez."
    ]
}];

(function _updateQuestionsMeta(questions) {
    for (var sectionId = 0, offset = 0; sectionId < questions.length; sectionId++) {
        var section = questions[sectionId];
        section.count = section.texts.length;
        section.offset = offset;
        offset += section.count;
    }
})(questions);
    
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

// [nParties x nQuestions]
var partyScores = [
    /* tema 1               tema 2.1   tema 2.2      tema 2.3     tema 2.4   tema 2.5 */
    [2, 5, 5, 5, 1, 5, 1,   5, 5, 1,   5, 5, 5, 5,   5, 5, 5,     1, 1,      5],
    [2, 4, 4, 4, 1, 5, 2,   2, 4, 4,   2, 4, 2, 4,   4, 2, 3/*-*/,1, 1,      5],
    [5, 5, 5, 3, 1, 3, 1,   1, 2, 5,   3, 1, 2, 3,   3, 2, 3,     3, 1,      3],
    [5, 5, 5, 5, 1, 1, 1,   4, 4, 1,   4, 1, 5, 2,   5, 5, 4,     1, 1,      2],
    [5, 5, 5, 5, 1, 2, 2,   1, 5, 2,   5, 1, 2, 2,   5, 2, 2,     1, 1,      2],
    [5, 5, 4, 5, 2, 3, 1,   2, 5, 5,   3, 1, 3, 1,   1, 3, 1,     3, 1,      2],
    [4, 5, 1, 3, 1, 4, 5,   2, 5, 5,   4, 2, 1, 4,   3, 2, 2,     1, 1,      4],
    [2, 4, 5, 4, 2, 4, 5,   2, 5, 2,   2, 1, 4, 3,   5, 5, 5,     2, 2,      4],
    [5, 5, 5, 3, 1, 3, 3,   2, 5, 1,   5, 1, 3, 3,   4, 5, 4,     1, 1,      5],
    [3, 4, 2, 5, 2, 2, 2,   2, 5, 2,   2, 5, 5, 5,   4, 2, 5,     1, 3,      2],
    [1, 5, 3, 4, 1, 4, 3,   2, 5, 2,   2, 2, 1, 5,   5, 2, 5,     1, 2,      4],
    [4, 2, 5, 5, 2, 4, 2,   1, 5, 4,   3, 1, 1, 5,   3, 5, 3,     1, 1,      5]
];
var neutralScores = new Array(partyScores[0].length+1).join("3").split('').map(parseFloat);
var nParties = partyScores.length;
var nQuestions = partyScores[0].length;

// [nQuestions x nGrades(5)]
var partyScoresFreq = (function _calcScoreFreq(partyScores) {
    var freq = [];
    for (var questionId = 0; questionId < nQuestions; questionId++) {
        var cnt = [undefined, 0, 0, 0, 0, 0];
        for (var partyId = 0; partyId < nParties; partyId++) {
            cnt[partyScores[partyId][questionId]]++;
        }
        freq.push(cnt.slice(1));
    }
    return freq;
})(partyScores);

// [nQuestions x 1]
var questionEntropies = (function _calcEntropies(f) {
    var ents = [];
    for (var questionId = 0; questionId < nQuestions; questionId++) {
        var ent = 0;
        for (var i = 0; i < f[questionId].length; i++) {
            var p = f[questionId][i] / nParties;
            if (p > 0) ent -= p * Math.log(p);
        }
        ents.push(ent/Math.log(2));
    }
    return ents;
})(partyScoresFreq);
