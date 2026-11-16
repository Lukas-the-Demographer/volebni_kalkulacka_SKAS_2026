const limitPriorit = 5;

// --- SEKCE ---
// Jediné místo, kde se sekce definují. Barvy jsou v style.css pod třídou .sekce-<klic>.
const sekce = [
    { nazev: 'Biologie',       klic: 'bio',  kratce: 'Biologie',   voli: 7 },
    { nazev: 'Geografie',      klic: 'geo',  kratce: 'Geografie',  voli: 3 },
    { nazev: 'Chemie',         klic: 'chem', kratce: 'Chemie',     voli: 2 },
    { nazev: 'Geologie a OŽP', klic: 'ozp',  kratce: 'Geol & OŽP', voli: 2 }
];

// Vrátí CSS třídu barvy pro danou sekci, např. 'Biologie' → 'sekce-bio'
function sekceTrida(nazev) {
    const s = sekce.find(x => x.nazev === nazev);
    return s ? 'sekce-' + s.klic : '';
}

// Lišta filtrů sekcí. aktivni = název sekce nebo 'Vse', fn = jméno funkce volané po kliknutí.
function filtrySekci(aktivni, fn, sPoctemMandatu = false) {
    let html = `<div class="filter-bar"><button class="filter-btn ${aktivni === 'Vse' ? 'active' : ''}" onclick="${fn}('Vse')">Celá fakulta</button>`;
    sekce.forEach(s => {
        const popis = sPoctemMandatu ? `${s.kratce} (Volí ${s.voli})` : s.nazev;
        html += `<button class="filter-btn sekce-${s.klic} ${aktivni === s.nazev ? 'active' : ''}" onclick="${fn}('${s.nazev}')">${popis}</button>`;
    });
    return html + `</div>`;
}

// --- 15 OTÁZEK ---
const otazky = [
    { id: 'q1', text: 'Měly by se přednášky povinně nahrávat i po covidu?' },
    { id: 'q2', text: 'Jste pro zavedení elektronického indexu pro všechny ročníky?' },
    { id: 'q3', text: 'Měla by fakulta více dotovat jídlo v menze?' },
    { id: 'q4', text: 'Jste pro striktnější pravidla pro prodlužování doktorského studia?' },
    { id: 'q5', text: 'Měly by se zavést povinné ekologické standardy pro fakultní bufety?' },
    { id: 'q6', text: 'Měla by se část rozpočtu přesunout od výzkumu více k výuce?' },
    { id: 'q7', text: 'Jste pro větší podporu studentských spolků z fakultních peněz?' },
    { id: 'q8', text: 'Měl by se zavést podzimní zkušební termín jako standard?' },
    { id: 'q9', text: 'Jste pro to, aby byly studijní plány flexibilnější (více volitelných předmětů)?' },
    { id: 'q10', text: 'Měly by být zavedeny anonymní ankety k hodnocení vyučujících s reálným dopadem?' },
    { id: 'q11', text: 'Je současný systém grantové podpory studentů spravedlivý?' },
    { id: 'q12', text: 'Měla by fakulta financovat psychologickou poradnu pro studenty?' },
    { id: 'q13', text: 'Jste pro zrušení papírových přihlášek na zkoušky v SISu?' },
    { id: 'q14', text: 'Měly by se rozšířit otvírací hodiny fakultních knihoven do nočních hodin?' },
    { id: 'q15', text: 'Souhlasíte s výstavbou nových fakultních budov na úkor zeleně v kampusu?' }
];

// --- 15 PRIORITNÍCH OBLASTÍ ---
const oblasti = [
    { id: 'o1', text: 'Reforma doktorského studia' },
    { id: 'o2', text: 'Dostupnost a cena stravování' },
    { id: 'o3', text: 'Digitalizace studijní agendy (SIS, indexy)' },
    { id: 'o4', text: 'Podpora a financování studentských spolků' },
    { id: 'o5', text: 'Ekologizace a udržitelnost provozu fakulty' },
    { id: 'o6', text: 'Modernizace laboratoří a vybavení' },
    { id: 'o7', text: 'Rozšiřování kapacit studoven a knihoven' },
    { id: 'o8', text: 'Kvalita a dostupnost psychologické pomoci' },
    { id: 'o9', text: 'Mezinárodní výjezdy a program Erasmus+' },
    { id: 'o10', text: 'Rovné příležitosti a prevence obtěžování' },
    { id: 'o11', text: 'Popularizace vědy pro veřejnost' },
    { id: 'o12', text: 'Transparentnost fakultního rozpočtu' },
    { id: 'o13', text: 'Kariérní centrum a propojení s praxí' },
    { id: 'o14', text: 'Podpora pro studenty se specifickými potřebami' },
    { id: 'o15', text: 'Rozšiřování odpočinkových zón na fakultě' }
];

// --- TVOJE REÁLNÁ DATA ---
const kandidati = [
    { 
        id: 'novak', jmeno: 'Adam Novák', 
        odpovedi: { q1: 1, q2: -1, q3: 0, q4: 1, q5: -1, q6: 1, q7: 1, q8: -1, q9: 1, q10: 1, q11: 0, q12: 1, q13: 1, q14: -1, q15: -1 }, 
        priority: { o1: 3, o2: 3, o3: 2, o4: 1, o5: 0 },
        info: { sekce: 'Biologie', obor: 'Botanika', rocnik: '2. Mgr.', kontakt: 'novak@natur.cuni.cz', odkaz: 'https://jannovak.cz' },
        komentare: { q1: 'Nahrávání je základ pro pracující studenty.' },
        neprijemneOtazky: [ { q: 'Senát vyžaduje čas. Čeho se vzdáte?', a: 'Omezím směny v práci.' } ]
    },
    { 
        id: 'svobodova', jmeno: 'Zuzana Svobodová', 
        odpovedi: { q1: 1, q2: 1, q3: 1, q4: -1, q5: 1, q6: -1, q7: 1, q8: 1, q9: 0, q10: 1, q11: 1, q12: 1, q13: 1, q14: 1, q15: -1 }, 
        priority: { o1: 1, o2: 1, o3: 3, o4: 2 },
        info: { sekce: 'Geografie', obor: 'Demografie', rocnik: '1. Nav.', kontakt: 'svobodova@natur.cuni.cz', odkaz: '#' },
        komentare: { q2: 'Papír je přežitek.' },
        neprijemneOtazky: []
    },
    { 
        id: 'dvorak', jmeno: 'Karel Dvořák', 
        odpovedi: { q1: -1, q2: 1, q3: -1, q4: 1, q5: -1, q6: -1, q7: -1, q8: 1, q9: -1, q10: 0, q11: 1, q12: -1, q13: 1, q14: -1, q15: 1 }, 
        priority: { o12: 3, o13: 3, o6: 2 },
        info: { sekce: 'Chemie', obor: 'Analytická chemie', rocnik: '3. Bc.', kontakt: 'dvorak@natur.cuni.cz', odkaz: '#' },
        komentare: {},
        neprijemneOtazky: []
    },
    { 
        id: 'cerna', jmeno: 'Barbora Černá', 
        odpovedi: { q1: 1, q2: 1, q3: 0, q4: 0, q5: 1, q6: 1, q7: 1, q8: 0, q9: 1, q10: 1, q11: -1, q12: 1, q13: 1, q14: 0, q15: -1 }, 
        priority: { o5: 3, o15: 3, o8: 2 },
        info: { sekce: 'Geologie a OŽP', obor: 'Ochrana ŽP', rocnik: '2. Bc.', kontakt: 'cerna@natur.cuni.cz', odkaz: '#' },
        komentare: { o5: 'Klimatická krize nepočká, musíme začít u sebe.' },
        neprijemneOtazky: []
    }
];

// --- FIKTIVNÍ TESTOVACÍ KANDIDÁTI (pevná data, až budou skuteční, celý blok smaž) ---
// Odpovědi jsou pole 15 hodnot v pořadí q1..q15 (1 = Ano, -1 = Ne, 0 = Nevím).
// Priority: 3 = Priorita, 2 = Důležité, 1 = Okrajové.
function fiktivni(id, jmeno, sekce, odp, priority) {
    const odpovedi = {};
    odp.forEach((v, i) => odpovedi['q' + (i + 1)] = v);
    return {
        id, jmeno, odpovedi, priority,
        info: { sekce, obor: 'Fiktivní obor', rocnik: 'X. ročník', kontakt: 'fiktivni@natur.cuni.cz', odkaz: '#' },
        komentare: {}, neprijemneOtazky: []
    };
}

kandidati.push(
    // Biologie (+11 → celkem 12)
    fiktivni('kucera',    'David Kučera',      'Biologie', [ 1, 1, 1, 0,-1, 1, 1,-1, 1, 1, 0, 1, 1,-1,-1], { o2: 3, o9: 3, o6: 2, o13: 2, o15: 1 }),
    fiktivni('vesela',    'Petra Veselá',      'Biologie', [ 1, 0, 1,-1, 1, 1, 1, 1, 1, 1,-1, 1, 1, 1,-1], { o8: 3, o5: 3, o14: 2, o10: 2, o7: 1 }),
    fiktivni('horak',     'Martin Horák',      'Biologie', [-1, 1,-1, 1,-1,-1, 0, 1,-1, 1, 1,-1, 1, 0, 1], { o1: 3, o6: 3, o12: 2, o11: 1 }),
    fiktivni('nemcova',   'Tereza Němcová',    'Biologie', [ 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1,-1], { o3: 3, o7: 3, o8: 2, o4: 2, o2: 1 }),
    fiktivni('marek',     'Jakub Marek',       'Biologie', [ 0,-1, 1, 1, 0,-1, 1,-1, 1, 0, 1, 0, 1,-1, 0], { o4: 3, o11: 3, o9: 2, o15: 1 }),
    fiktivni('pokorna',   'Lucie Pokorná',     'Biologie', [ 1, 1, 1,-1, 1, 0, 0, 1, 1, 1,-1, 1, 1, 1,-1], { o10: 3, o8: 3, o14: 2, o5: 2, o12: 1 }),
    fiktivni('kriz',      'Filip Kříž',        'Biologie', [-1, 1,-1, 1, 0,-1,-1, 1, 0, 1, 1,-1, 1,-1, 1], { o6: 3, o13: 3, o1: 2, o3: 1 }),
    fiktivni('kralova',   'Anna Králová',      'Biologie', [ 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1,-1], { o5: 3, o15: 3, o2: 2, o7: 2, o9: 1 }),
    fiktivni('ruzicka',   'Ondřej Růžička',    'Biologie', [ 1, 1,-1, 1,-1, 1, 0,-1, 1, 1, 1, 0, 1, 0, 0], { o1: 3, o12: 3, o3: 2, o6: 1 }),
    fiktivni('fialova',   'Eliška Fialová',    'Biologie', [ 1, 1, 1,-1, 1, 1, 1, 0, 1, 1,-1, 1, 1, 1,-1], { o8: 3, o14: 3, o10: 2, o4: 1 }),
    fiktivni('bartos',    'Tomáš Bartoš',      'Biologie', [ 0, 1, 0, 1,-1,-1, 1, 1, 0, 1, 1,-1, 1,-1, 1], { o13: 3, o9: 3, o11: 2, o2: 1 }),

    // Geografie (+7 → celkem 8)
    fiktivni('vlckova',   'Kateřina Vlčková',  'Geografie', [ 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,-1, 1, 1, 1,-1], { o9: 3, o5: 3, o7: 2, o15: 1 }),
    fiktivni('prochazka', 'Jan Procházka',     'Geografie', [-1, 1,-1, 1,-1,-1, 0, 1,-1, 0, 1,-1, 1,-1, 1], { o12: 3, o13: 3, o3: 2, o6: 1 }),
    fiktivni('simkova',   'Adéla Šimková',     'Geografie', [ 1, 0, 1,-1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0,-1], { o8: 3, o10: 3, o14: 2, o2: 2 }),
    fiktivni('benes',     'Petr Beneš',        'Geografie', [ 0, 1, 1, 1, 0,-1, 1,-1, 1, 1, 1, 0, 1, 1, 0], { o4: 3, o11: 3, o9: 2, o1: 1 }),
    fiktivni('duskova',   'Klára Dušková',     'Geografie', [ 1, 1, 0,-1, 1, 1, 0, 1, 1, 1,-1, 1, 1, 1,-1], { o5: 3, o15: 3, o8: 2, o7: 1 }),
    fiktivni('holub',     'Vojtěch Holub',     'Geografie', [-1, 1,-1, 0,-1, 0,-1, 1, 0, 1, 1,-1, 1,-1, 1], { o6: 3, o3: 3, o12: 2, o13: 1 }),
    fiktivni('sedlackova','Markéta Sedláčková','Geografie', [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0], { o2: 3, o7: 3, o4: 2, o14: 1 }),

    // Chemie (+4 → celkem 5)
    fiktivni('jelinek',   'Michal Jelínek',    'Chemie',   [-1, 1, 0, 1,-1,-1, 0, 1,-1, 1, 1,-1, 1, 0, 1], { o6: 3, o1: 3, o13: 2, o12: 1 }),
    fiktivni('urbanova',  'Veronika Urbanová', 'Chemie',   [ 1, 1, 1,-1, 1, 1, 1, 1, 1, 1,-1, 1, 1, 1,-1], { o8: 3, o10: 3, o14: 2, o5: 1 }),
    fiktivni('kolar',     'Pavel Kolář',       'Chemie',   [ 0, 1,-1, 1, 0,-1, 1,-1, 1, 1, 1, 0, 1,-1, 0], { o6: 3, o9: 3, o11: 2, o3: 1 }),
    fiktivni('moravcova', 'Simona Moravcová',  'Chemie',   [ 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,-1], { o7: 3, o2: 3, o15: 2, o4: 1 }),

    // Geologie a OŽP (+8 → celkem 9)
    fiktivni('pospisil',  'Matěj Pospíšil',    'Geologie a OŽP', [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,-1, 1, 1, 0,-1], { o5: 3, o11: 3, o15: 2, o9: 1 }),
    fiktivni('hajkova',   'Kristýna Hájková',  'Geologie a OŽP', [ 1, 0, 1,-1, 1, 1, 1, 1, 1, 1,-1, 1, 1, 1,-1], { o5: 3, o8: 3, o10: 2, o14: 1 }),
    fiktivni('krejci',    'Štěpán Krejčí',     'Geologie a OŽP', [-1, 1,-1, 1, 0,-1, 0, 1,-1, 1, 1,-1, 1,-1, 1], { o6: 3, o12: 3, o1: 2, o13: 1 }),
    fiktivni('zemanova',  'Nikola Zemanová',   'Geologie a OŽP', [ 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1,-1], { o15: 3, o7: 3, o2: 2, o4: 1 }),
    fiktivni('stastny',   'Radek Šťastný',     'Geologie a OŽP', [ 0, 1, 1, 1,-1,-1, 1,-1, 0, 1, 1, 0, 1, 0, 0], { o9: 3, o4: 3, o13: 2, o3: 1 }),
    fiktivni('blahova',   'Monika Bláhová',    'Geologie a OŽP', [ 1, 1, 1,-1, 1, 1, 1, 1, 1, 1,-1, 1, 1, 1,-1], { o5: 3, o10: 3, o8: 2, o15: 2, o11: 1 }),
    fiktivni('navratil',  'Daniel Navrátil',   'Geologie a OŽP', [-1, 1, 0, 1,-1, 0,-1, 1, 0, 1, 1,-1, 1,-1, 1], { o1: 3, o6: 3, o12: 2, o3: 1 }),
    fiktivni('kopecka',   'Hana Kopecká',      'Geologie a OŽP', [ 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1,-1], { o11: 3, o5: 3, o7: 2, o2: 1 })
);