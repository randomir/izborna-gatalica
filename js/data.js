var answerDesc = {
    1: "snažno podržavam",
    2: "djelomično podržavam",
    3: "neutralan sam",
    4: "djelomično se protivim",
    5: "snažno se protivim"
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
