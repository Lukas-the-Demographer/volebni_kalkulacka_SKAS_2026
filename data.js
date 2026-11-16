const limitPriorit = 5;

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

// --- ZÁTĚŽOVÝ GENERÁTOR (Tohle pak můžeš smazat) ---
// Doplní počty kandidátů na požadované kvóty.
const kvoty = { 'Biologie': 12, 'Geografie': 8, 'Chemie': 5, 'Geologie a OŽP': 9 };
const soucasniStavy = { 'Biologie': 1, 'Geografie': 1, 'Chemie': 1, 'Geologie a OŽP': 1 };
const jmena = ['David', 'Petr', 'Martin', 'Tomáš', 'Jakub', 'Filip', 'Jan', 'Ondřej', 'Lucie', 'Tereza', 'Anna', 'Adéla', 'Eliška', 'Kateřina'];
const prijmeni = ['Kučera', 'Veselý', 'Horák', 'Němec', 'Marek', 'Pokorný', 'Kříž', 'Králová', 'Růžičková', 'Fialová', 'Bartošová', 'Vlčková'];

Object.keys(kvoty).forEach(sekce => {
    while(soucasniStavy[sekce] < kvoty[sekce]) {
        let n = jmena[Math.floor(Math.random()*jmena.length)];
        let p = prijmeni[Math.floor(Math.random()*prijmeni.length)];
        let fiktivni = {
            id: `fiktivni_${sekce.substring(0,3)}_${soucasniStavy[sekce]}`,
            jmeno: `${n} ${p}`,
            info: { sekce: sekce, obor: 'Fiktivní obor', rocnik: 'X. ročník', kontakt: 'fiktivni@natur.cuni.cz', odkaz: '#' },
            odpovedi: {}, priority: {}, komentare: {}, neprijemneOtazky: []
        };
        // Náhodné odpovědi a priority
        otazky.forEach(q => fiktivni.odpovedi[q.id] = [-1, 0, 1][Math.floor(Math.random()*3)]);
        let vybraneOblasti = [...oblasti].sort(() => 0.5 - Math.random()).slice(0, 12);
        vybraneOblasti.forEach((o, index) => {
            if(index < 4) fiktivni.priority[o.id] = 3;
            else if(index < 8) fiktivni.priority[o.id] = 2;
            else fiktivni.priority[o.id] = 1;
        });
        kandidati.push(fiktivni);
        soucasniStavy[sekce]++;
    }
});