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
}, {
    sectionTitle: "Migranti i imigranti",
    shortTitle: "Migracije",
    texts: [
        "Hrvatska uopće ne treba primati migrante dok god ima visoku nezaposlenost.",
        "Hrvatska treba primiti samo kršćane jer to najbolje odgovara nacionalnim interesima.",
        "Migranti iz Sirije su dobrodošli i država im treba ponuditi smještaj, posao i priliku za brzu integraciju u društvo.",
        "Hrvatska treba useljavati imigrante koji su joj potrebni za tržište radne snage bez obzira na to iz kojeg dijela svijeta dolaze i koje su vjere i nacionalnosti.",
        "Hrvatska treba voditi strogu imigracijsku politiku i omogućiti doseljavanje visokoobrazovanih imigranata koji znaju hrvatski jezik i koji mogu položiti bankovno jamstvo u slučaju javnih troškova proizišlih iz useljavanja.",
        "Useljavanje treba biti strogo kontrolirano i usmjereno prema dijelovima zemlje gdje je najmanje stanovništva.",
        "Hrvatska treba imigrante rasporediti po svim općinama tako da broj imigranata po općini ne prelazi više od 1,5 % domicilnog stanovništva.",
        "Hrvatska treba razvijati politiku tolerancije kod domaćeg stanovništva prema imigrantima, ali i osigurati da se imigranti prilagode temeljnim vrijednostima hrvatskoga društva."
    ]
}, {
    sectionTitle: "Švicarski franak",
    shortTitle: "Švicarski franak",
    texts: [
        "Država treba pomoći svim dužnicima u švicarskim francima, bez obzira na namjenu kredita",
        "Država treba pomoći samo onim dužnicima u švicarskim francima koji zadovoljavaju određene socijalne kriterije (primjerice prva nekretnina i sl.)."
    ]
}, {
    sectionTitle: "Politika prema braniteljima",
    shortTitle: "Politika prema braniteljima",
    texts: [
        "Politika prema braniteljima mora ostati samostalan resor, a ne se priključiti socijalnoj ili nekoj drugoj politici.",
        "Hrvatski branitelji trebaju dobiti dionice svih javnih tvrtki za koje se planira izlazak na tržište kapitala."
    ]
}, {
    sectionTitle: "Socijalna politika",
    shortTitle: "Socijalna politika",
    texts: [
        "Primanje socijalne naknade ili drugih socijalnih davanja treba onemogućiti osobama koje imaju vrijednu imovinu ili nekretnine.",
        "Svi građani Republike Hrvatske trebaju u jednakoj mjeri snositi troškove poskupljenja struje kako bi se pomoglo socijalno ugroženim građanima."
    ]
}, {
    sectionTitle: "Mirovinska politika",
    shortTitle: "Mirovinska politika",
    texts: [
        "Hrvatska treba, kao što nam preporuča i Europska komisija u svom izvješću, uvesti penalizaciju prijevremenog umirovljenja.",
        "Sve radno sposobne umirovljenike, uključujući braniteljsku populaciju, treba pokušati ponovno uključiti u tržište rada.",
        "Hrvatska treba čim prije povećati dobnu granicu za odlazak u mirovnu kako bi se omogućila stabilna isplata mirovina u budućnosti."
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
    /* tema 1              2.1      2.2         2.3      2.4   2.5 3                        4 */
    [2, 5, 5, 5, 1, 5, 1,  5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 1, 1, 5,  3, 3, 3, 2, 5, 3, 3, 3,  1, 5, 1, 3, 3, 3, 5, 4, 5],
    [2, 4, 4, 4, 1, 5, 2,  2, 4, 4, 2, 4, 2, 4, 4, 2, 3, 1, 1, 5,  1, 5, 5, 2, 2, 2, 2, 1,  5, 1, 1, 5, 1, 4, 2, 4, 5],
    [5, 5, 5, 3, 1, 3, 1,  1, 2, 5, 3, 1, 2, 3, 3, 2, 3, 3, 1, 3,  4, 5, 2, 2, 3, 3, 2, 1,  5, 1, 5, 1, 2, 1, 1, 3, 2],
    [5, 5, 5, 5, 1, 1, 1,  4, 4, 1, 4, 1, 5, 2, 5, 5, 4, 1, 1, 2,  5, 5, 2, 2, 4, 4, 3, 1,  2, 2, 4, 5, 2, 4, 2, 1, 4],
    [5, 5, 5, 5, 1, 2, 2,  1, 5, 2, 5, 1, 2, 2, 5, 2, 2, 1, 1, 2,  4, 5, 2, 3, 4, 4, 2, 1,  2, 1, 1, 5, 1, 1, 2, 1, 2],
    [5, 5, 4, 5, 2, 3, 1,  2, 5, 5, 3, 1, 3, 1, 1, 3, 1, 3, 1, 2,  2, 5, 3, 2, 3, 4, 2, 2,  2, 1, 4, 2, 1, 2, 1, 1, 4],
    [4, 5, 1, 3, 1, 4, 5,  2, 5, 5, 4, 2, 1, 4, 3, 2, 2, 1, 1, 4,  5, 5, 4, 2, 4, 2, 3, 2,  4, 1, 3, 4, 4, 2, 3, 2, 3],
    [2, 4, 5, 4, 2, 4, 5,  2, 5, 2, 2, 1, 4, 3, 5, 5, 5, 2, 2, 4,  2, 3, 5, 4, 2, 4, 5, 3,  2, 3, 1, 2, 2, 3, 5, 4, 4],
    [5, 5, 5, 3, 1, 3, 3,  2, 5, 1, 5, 1, 3, 3, 4, 5, 4, 1, 1, 5,  1, 5, 5, 4, 1, 5, 5, 5,  1, 4, 1, 2, 1, 1, 1, 2, 1],
    [3, 4, 2, 5, 2, 2, 2,  2, 5, 2, 2, 5, 5, 5, 4, 2, 5, 1, 3, 2,  4, 3, 4, 2, 4, 2, 1, 1,  3, 3, 1, 2, 3, 1, 2, 2, 5],
    [1, 5, 3, 4, 1, 4, 3,  2, 5, 2, 2, 2, 1, 5, 5, 2, 5, 1, 2, 4,  4, 4, 4, 2, 2, 3, 2, 1,  1, 5, 1, 2, 1, 5, 3, 1, 3],
    [4, 2, 5, 5, 2, 4, 2,  1, 5, 4, 3, 1, 1, 5, 3, 5, 3, 1, 1, 5,  5, 5, 2, 3, 3, 5, 2, 1,  1, 5, 2, 2, 1, 4, 3, 2, 3]
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
