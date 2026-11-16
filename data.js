// =====================================================================
//  ZÁTĚŽOVÝ TEST – reální kandidáti z minulých voleb, ALE odpovědi na
//  otázky, priority a odpovědi na nepříjemné otázky jsou ODHADNUTÉ /
//  VYMYŠLENÉ. Komentáře jsou parafráze jejich volebních programů.
//  Nepoužívat veřejně jako skutečné postoje kandidátů.
// =====================================================================
const TESTOVACI_DATA = true;

const limitPriorit = 5;

// --- SEKCE ---
// Jediné místo, kde se sekce definují. Pořadí určuje i pořadí na stránce kandidátů.
// Barvy jsou v style.css pod třídou .sekce-<klic>.
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

// Upozornění na testovací data (zobrazí se nahoře na obou stránkách)
function testovaciBanner() {
    return TESTOVACI_DATA
        ? `<div class="test-banner">ZÁTĚŽOVÝ TEST – odpovědi kandidátů jsou odhadnuté, nejde o jejich skutečné postoje.</div>`
        : '';
}

// --- OTÁZKY ANO/NE (témata, na kterých se kandidáti rozcházejí) ---
const otazky = [
    { id: 'q1',  text: 'Měl by se SKAS veřejně vyjadřovat k politickým a celospolečenským tématům (např. kauza odměn bývalé rektorky, nový vysokoškolský zákon, zákon o veřejnoprávních médiích)?' },
    { id: 'q2',  text: 'Měl by SKAS fungovat trochu jako spolek – sám pořádat akce a budovat komunitu studentů?' },
    { id: 'q3',  text: 'Měla by fakulta při finanční podpoře spolků důsledně kontrolovat kvalitu akcí, které pořádají?' },
    { id: 'q4',  text: 'Jste spokojeni s prací děkana doc. Krylova a jeho kolegia?' },
    { id: 'q5',  text: 'Kdyby se zítra volil nový děkan, patřil by doc. Krylov automaticky k favoritům?' },
    { id: 'q6',  text: 'Měl by být studentský senátor vůči vedení fakulty spíše kritický než kooperativní?' },
    { id: 'q7',  text: 'Měla by být (bezplatná) výuka akademické angličtiny povinnou součástí všech oborů?' },
    { id: 'q8',  text: 'Měla by fakulta sjednotit e-learning na jedinou platformu (např. jen Moodle)?' },
    { id: 'q9',  text: 'Měla by fakulta zavést jednotná pravidla pro používání umělé inteligence ve výuce a závěrečných pracích?' },
    { id: 'q10', text: 'Měl by se znovu otevřít a přepracovat etický kodex PřF UK?' },
    { id: 'q11', text: 'Měla by fakulta aktivně spolupracovat s klimatickými hnutími (např. Univerzity za klima)?' },
    { id: 'q12', text: 'Mělo by být zvýšení doktorandských stipendií prioritou, i kdyby to znamenalo omezit jiná stipendia?' },
    { id: 'q13', text: 'Měla by fakulta ze svého rozpočtu financovat fakultní sportovní týmy?' }
];

// --- PRIORITNÍ OBLASTI (témata, na kterých se shodnou skoro všichni – rozdíl je v tom, jak moc) ---
const oblasti = [
    { id: 'o1',  text: 'Podpora a financování studentských spolků' },
    { id: 'o2',  text: 'Prostory ke studiu a odpočinku (studovny, knihovny, klubovny)' },
    { id: 'o3',  text: 'Duševní zdraví, psychologická pomoc a bezpečné prostředí' },
    { id: 'o4',  text: 'Komunikace SKAS se studenty a transparentnost' },
    { id: 'o5',  text: 'Propagace fakulty a popularizace vědy' },
    { id: 'o6',  text: 'Podpora prváků a nástupu na fakultu' },
    { id: 'o7',  text: 'Zahraniční mobility a Erasmus+' },
    { id: 'o8',  text: 'Kvalita výuky a studentská anketa' },
    { id: 'o9',  text: 'Koleje a menzy' },
    { id: 'o10', text: 'Udržitelnost a ekologie provozu fakulty' },
    { id: 'o11', text: 'Digitalizace agendy a studijních systémů' },
    { id: 'o12', text: 'Studentský výzkum, stáže a doktorandi' },
    { id: 'o13', text: 'Sport a volnočasové aktivity' },
    { id: 'o14', text: 'Výuka cizích jazyků a programy v angličtině' },
    { id: 'o15', text: 'Biocentrum Albertov a rozvoj budov' }
];
// 15 oblastí × 3 úrovně × limit 5 → kandidát musí mít přesně 5× Priorita, 5× Důležité, 5× Okrajové.

// Kandidát je v kalkulačce jen tehdy, když ohodnotil VŠECHNY oblasti a nepřekročil limit v žádné úrovni.
function maPlnePriority(k) {
    const p = k.priority || {};
    if (!oblasti.every(o => [1, 2, 3].includes(p[o.id]))) return false;
    return [1, 2, 3].every(u => oblasti.filter(o => p[o.id] === u).length <= limitPriorit);
}

// Zápatí obou stránek
function paticka() {
    return `<footer class="paticka">
        Vytvořeno pro účely voleb do Studentské komory Akademického senátu PřF UK (SKAS) v roce 2026.
        Za obsah odpovídají samotní kandidáti, kteří veškeré údaje poskytli, nebo jsou součástí jejich veřejných kandidatur.
        ${TESTOVACI_DATA ? '<br><strong>Testovací verze: odpovědi a priority kandidátů jsou odhadnuté.</strong>' : ''}
    </footer>`;
}

// --- NEPŘÍJEMNÉ OTÁZKY (stejné pro všechny) ---
const neprijemneOtazky = [
    { id: 'n1', text: 'Budeš mít na práci v senátu dost času? Čeho se kvůli ní vzdáš?' },
    { id: 'n2', text: 'Plánuješ během mandátu výjezd do zahraničí? Pokud ano, jak zůstaneš v kontaktu se senátem a studenty?' },
    { id: 'n3', text: '„Plnit, co studenti chtějí“ je hezká fráze. Jak konkrétně budeš v kontaktu i s běžnými studenty, kteří nejsou ve spolcích ani v senátu?' },
    { id: 'n4', text: 'Kde se vzalo tvé odhodlání kandidovat? Co tě přiměje dát do práce ve SKAS 110 %?' }
];

// Odpovědi na otázky jako pole v pořadí q1..q13 (1 = Ano, -1 = Ne)
const odp = pole => Object.fromEntries(pole.map((v, i) => ['q' + (i + 1), v]));

// Priority zapsané po úrovních: prio('o1 o3 …' = Priorita, '…' = Důležité, '…' = Okrajové)
const prio = (tri, dve, jedna) => {
    const p = {};
    [[tri, 3], [dve, 2], [jedna, 1]].forEach(([seznam, u]) => seznam.split(' ').filter(Boolean).forEach(id => p[id] = u));
    return p;
};

// --- KANDIDÁTI (pořadí uvnitř sekce = pořadí na stránce kandidátů) ---
const kandidati = [
    // ===== BIOLOGIE =====
    {
        id: 'strakova', jmeno: 'Lucie Straková', foto: 'foto/strakova.jpg',
        info: { sekce: 'Biologie', obor: 'Reprodukční a vývojová biologie', rocnik: '1. nMgr.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1]),
        priority: prio('o1 o3 o8 o14 o4', 'o6 o5 o2 o13 o7', 'o9 o10 o11 o12 o15'),
        komentare: {
            o1: 'Chce podporovat spolky, aktivní studenty a kulturní život na fakultě a víc propojit biologickou sekci.',
            o3: 'Chce víc propagovat fakultního psychologa a lékaře, aby se studenti nebáli říct si o pomoc.',
            o8: 'Navrhuje jasně definovat otázky u SZZ v biologii a upravit zastaralé kreditové hodnocení předmětů.'
        },
        neprijemne: {
            n1: 'Čas si udělám, akce teď organizuju i tak. Ubrat budu muset spíš u některých spolkových aktivit.',
            n2: 'Delší výjezd zatím neplánuju. Kdyby se něco změnilo, budu na zasedáních online.',
            n3: 'Chci chodit tam, kde studenti normálně jsou – na seznamováky, do klubů, na sociální sítě sekce.',
            n4: 'Spoustu věcí na fakultě mám ráda a pár mi jich vadí. Chci, aby se tu studovalo příjemněji.'
        }
    },
    {
        id: 'polak', jmeno: 'Arnošt Polák', foto: 'foto/polak.jpg',
        info: { sekce: 'Biologie', obor: 'Bioinformatika', rocnik: '3. Bc.', kontakt: 'arnost.polak@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, -1, 1]),
        priority: prio('o1 o2 o12 o15 o14', 'o7 o5 o9 o4 o11', 'o3 o6 o8 o10 o13'),
        komentare: {
            q2: 'Akce mají dělat spolky, SKAS je má hlavně podporovat a nesuplovat je.',
            q3: 'Kontrola ano, ale nesmí z ní být byrokracie, která spolky udusí.',
            o1: 'Chce udržet a co nejvíc navýšit podporu spolků a dát jim větší prostor v propagaci fakulty.',
            o2: 'Navrhuje zmapovat poptávku po studijních prostorech, dát do chodeb stoly se zásuvkami a prodloužit otevírací dobu knihoven.',
            o15: 'Vidí v Biocentru šanci pro špičkovou vědu; v ekonomické komisi AS UK hájil financování stavby.',
            o14: 'Chce nové mezioborové programy, ideálně v angličtině pro nejlepší studenty ze světa.'
        },
        neprijemne: {
            n1: 'V senátu už jedno období jsem, takže vím, kolik času to zabere. Mám to zahrnuté v plánu.',
            n2: 'Krátké výjezdy možná, delší pobyt ne. Většinu agendy jde řešit i na dálku.',
            n3: 'Jako tutor jsem v kontaktu s prváky, kteří ještě nikam nepatří. Chci dál dělat i otevřené konzultace.',
            n4: 'Za poslední roky jsem viděl, kolik se dá v senátu reálně prosadit, a chci na to navázat.'
        }
    },
    {
        id: 'lis', jmeno: 'Jonáš Lis', foto: 'foto/lis.jpg',
        info: { sekce: 'Biologie', obor: 'Botanika', rocnik: '1. nMgr.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, -1]),
        priority: prio('o4 o8 o1 o6 o3', 'o2 o12 o5 o9 o10', 'o7 o11 o13 o14 o15'),
        komentare: {
            o4: 'Hlavní téma: SKAS a volby do něj jsou důležité, potřebujeme vyšší účast a víc kandidátů.'
        },
        neprijemne: {
            n1: 'Ano. Senát beru jako hlavní mimostudijní aktivitu, něco jiného tomu ustoupí.',
            n2: 'Ne, výjezd neplánuju.',
            n3: 'Chci, aby se o senátu víc mluvilo i mimo „bublinu“ – a to jde jen tak, že budu lidi oslovovat přímo.',
            n4: 'Štve mě, jak málo lidí chodí k volbám. Když se tím nezačne zabývat nikdo, nic se nezmění.'
        }
    },
    {
        id: 'kubu', jmeno: 'Martin Kubů', foto: 'foto/kubu.jpg',
        info: { sekce: 'Biologie', obor: 'Molekulární a buněčná biologie, genetika a virologie', rocnik: '3. Ph.D.', kontakt: '', odkaz: '' },
        odpovedi: odp([1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1]),
        priority: prio('o3 o7 o14 o12 o1', 'o4 o8 o2 o6 o5', 'o9 o10 o11 o13 o15'),
        komentare: {
            q1: 'U témat, která přímo dopadají na studenty a vědu, by SKAS mlčet neměl.',
            o3: 'Nevhodné chování vyučujících a školitelů je podle něj nepřijatelné, chce otevřít diskusi, aby se lidé nebáli to nahlásit.',
            o7: 'Chce rovné příležitosti pro zahraniční studenty, kterým jazyková bariéra brání zapojit se.'
        },
        neprijemne: {
            n1: 'Doktorát je náročný, ale flexibilní. Ubrat budu muset z volného času, ne z laborky.',
            n2: 'Konferenční cesty ano, delší stáž zatím ne. Zasedání zvládnu i online.',
            n3: 'Učím praktika, takže potkávám studenty, kteří by se senátorovi sami neozvali.',
            n4: 'Za roky v laborce jsem viděl věci, které by se dít neměly. Chci, aby se o nich mluvilo.'
        }
    },
    {
        id: 'belza', jmeno: 'Václav Cedrik Belza', foto: 'foto/belza.jpg',
        info: { sekce: 'Biologie', obor: 'Botanika', rocnik: '1. nMgr.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, 1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 1, -1]),
        priority: prio('o4 o8 o12 o6 o11', 'o1 o3 o2 o14 o5', 'o7 o9 o10 o13 o15'),
        komentare: {
            o4: 'Chce jasnou komunikaci a domluvu mezi studentskou a zaměstnaneckou částí senátu.',
            o8: 'Navrhuje sjednotit náročnost předmětů se stejným počtem kreditů a rozšířit hodnocení předmětů.',
            o12: 'Chce debatu o reformě doktorského studia a jejím dopadu na fakultu.'
        },
        neprijemne: {
            n1: 'Ano, a seznamovák budu dělat dál – tam se dozvím nejvíc.',
            n2: 'Možná krátká terénní stáž, ale nic, co by mě odřízlo.',
            n3: 'Každý rok poznám na seznamováku stovky prváků a jejich problémů. To je můj kanál.',
            n4: 'Chci, aby se řešily praktické věci – AI ve výuce, kredity, anketa – a ne jen procedury.'
        }
    },
    {
        id: 'byronova', jmeno: 'Markéta Byronová', foto: 'foto/byronova.jpg',
        info: { sekce: 'Biologie', obor: 'Zoologie', rocnik: '1. Ph.D.', kontakt: 'byronovm@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, 1, 1, 1, 1, -1, -1, -1, 1, -1, 1, 1, -1]),
        priority: prio('o5 o4 o6 o1 o8', 'o12 o3 o10 o2 o7', 'o9 o11 o13 o14 o15'),
        komentare: {
            o4: 'Chce dál zmenšovat propast mezi studenty a vedením a usilovat o otevřenost a transparentnost.',
            o5: 'Chce intenzivnější komunikaci se středními školami a veřejností a podporu celofakultních akcí.'
        },
        neprijemne: {
            n1: 'V senátu už jedno období jsem a s organizací akcí to skloubit jde.',
            n2: 'Terénní cesty ano, ale vždy krátké. Na zasedání se připojím online.',
            n3: 'Jako tutorka a organizátorka akcí jsem v kontaktu se studenty od přijímaček dál.',
            n4: 'Viděla jsem, kde má fakulta mezery, a za první období i to, jak je zalátat.'
        }
    },
    {
        id: 'dix', jmeno: 'Anaïs Ariadne Dix', foto: 'foto/dix.jpg',
        info: { sekce: 'Biologie', obor: 'Ekologie (Hydrobiologie)', rocnik: '1. nMgr.', kontakt: '', odkaz: '' },
        odpovedi: odp([1, 1, -1, 1, -1, -1, 1, 1, 1, -1, 1, -1, -1]),
        priority: prio('o6 o5 o12 o4 o10', 'o3 o1 o7 o8 o13', 'o2 o9 o11 o14 o15'),
        komentare: {
            o6: 'Chce lépe propagovat existující mentoring pro studenty nižších ročníků.',
            o12: 'Navrhuje platformu pro sdílení zkušeností s bakalářskými a diplomovými pracemi.'
        },
        neprijemne: {
            n1: 'Ano, ubere se z koní a potápění, ale ne úplně.',
            n2: 'Možná letní terénní kurz. Mezitím budu dostupná online.',
            n3: 'Přes mentoring a přes lidi, kteří prezentují fakultu na středních školách.',
            n4: 'Mně samotné by v prvních ročnících hodně pomohlo, kdyby informace byly na jednom místě.'
        }
    },
    {
        id: 'fiedler', jmeno: 'Jan Fiedler', foto: 'foto/fiedler.jpg',
        info: { sekce: 'Biologie', obor: 'Protistologie', rocnik: '2. nMgr.', kontakt: '', odkaz: '' },
        odpovedi: odp([1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1]),
        priority: prio('o4 o1 o8 o2 o3', 'o12 o6 o5 o13 o10', 'o7 o9 o11 o14 o15'),
        komentare: {
            o4: 'Chce otevřenou platformu pro sdílení nápadů a podnětů celé akademické obce.',
            o1: 'Plánuje pravidelná setkání a workshopy, které posílí komunitu napříč obory.'
        },
        neprijemne: {
            n1: 'Diplomka je teď hlavní, ale senát s ní jde dohromady.',
            n2: 'Neplánuju.',
            n3: 'Pravidelná otevřená setkání, kam může přijít kdokoli, ne jen spolkaři.',
            n4: 'Chci, aby se tu každý cítil vítán – a to se samo nestane.'
        }
    },
    {
        id: 'karban', jmeno: 'Šimon Karban', foto: 'foto/karban.jpg',
        info: { sekce: 'Biologie', obor: 'Genetika, molekulární biologie a virologie', rocnik: '2. nMgr.', kontakt: 'karbansim@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, -1, -1]),
        priority: prio('o7 o1 o5 o14 o6', 'o4 o12 o8 o3 o11', 'o2 o9 o10 o13 o15'),
        komentare: {
            o7: 'Chce systém výběru na Erasmus+, který nenechá studenty čekat do konce semestru, a víc propagovat možnosti aliance 4EU+.',
            o1: 'Spolky jsou podle něj srdcem fakulty a měly by být součástí propagace (veletrhy, DOD, soustředění).'
        },
        neprijemne: {
            n1: 'Ano. Tutorské aktivity si rozvrhnu tak, aby se senátem nekolidovaly.',
            n2: 'Krátké výjezdy v rámci 4EU+ možná. Vím, jak zůstat ve spojení – dělám to i teď.',
            n3: 'Přes tutory a přes studenty, kteří řeší výjezdy – to jsou často lidé mimo spolky.',
            n4: 'Sám jsem zažil, jak složitá je cesta do zahraničí, a chci ji ostatním usnadnit.'
        }
    },
    {
        id: 'kivader', jmeno: 'Martin Kivader', foto: 'foto/kivader.jpg',
        info: { sekce: 'Biologie', obor: 'Botanika', rocnik: '1. nMgr.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, 1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1]),
        priority: prio('o4 o8 o1 o2 o13', 'o3 o6 o5 o11 o10', 'o7 o9 o12 o14 o15'),
        komentare: {
            q6: 'Senát je kontrolní orgán. Kooperace ano, ale kontrola je jeho hlavní úkol.',
            o4: 'Chce konzultovat studijní záležitosti přímo se studenty ve studentském klubu.',
            o8: 'Chce dohlížet na činnost studijní a legislativní komise i nového kolegia děkana.'
        },
        neprijemne: {
            n1: 'Ano, a ještě mi zbude čas naučit se žonglovat.',
            n2: 'Ne.',
            n3: 'Sedím v klubu a moderuju fakultní skupinu – kdo chce něco říct, ví, kde mě najít.',
            n4: 'Jedno období už za sebou mám a vím, že dohled nad vedením má smysl.'
        }
    },
    {
        id: 'spicka', jmeno: 'Jan Špička', foto: 'foto/spicka.jpg',
        info: { sekce: 'Biologie', obor: 'Botanika', rocnik: '1. nMgr.', kontakt: 'spickajan@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, 1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1]),
        priority: prio('o12 o3 o4 o11 o5', 'o2 o1 o8 o7 o10', 'o6 o9 o13 o14 o15'),
        komentare: {
            o12: 'Chce víc peněz pro studentské projekty už v magisterském studiu, víc stáží a jejich kreditové ohodnocení.',
            o3: 'Klade důraz na dostupné psychologické poradenství a relaxační prostory.',
            o4: 'Chce modernizovat komunikační kanály fakulty, aby studenti věděli, co se děje.'
        },
        neprijemne: {
            n1: 'Pracuju a studuju, takže ubrat budu muset u brigády.',
            n2: 'Terénní výzkum ano, ale v Česku.',
            n3: 'Přes sociální sítě a přes lidi z ročníku – ne každý chodí do spolků, ale každý je na sítích.',
            n4: 'Chci, aby studenti měli víc příležitostí si vyzkoušet vědu dřív, než dostanou diplom.'
        }
    },

    // ===== GEOGRAFIE =====
    {
        id: 'kahoun', jmeno: 'Lukáš Kahoun', foto: 'foto/kahoun.jpg',
        info: { sekce: 'Geografie', obor: 'Demografie', rocnik: '2. Ph.D.', kontakt: 'kahounl@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1]),
        priority: prio('o1 o2 o12 o4 o13', 'o11 o3 o8 o6 o9', 'o5 o7 o10 o14 o15'),
        komentare: {
            o1: 'Chce udržet podporu spolků, pořádat Přírodovědce sobě a zprůhlednit pravidla využívání fakultních prostor.',
            o2: 'Řeší drobnosti: víc míst k sezení, mikrovlnku na Albertově 6, bezbariérový přístup do Z3.',
            o12: 'Chce spravedlivá a transparentní stipendia pro všechny doktorandy.'
        },
        neprijemne: {
            n1: 'Kapacitu mám – jinak bych nekandidoval.',
            n2: 'Ne.',
            n3: 'Naslouchání je moje silná stránka. Chci slyšet i ty, kdo se do dění nezapojují.',
            n4: 'Chci, aby SKAS dál dělal dobrou práci, kterou dělá teď.'
        }
    },
    {
        id: 'kucera', jmeno: 'Ondřej Kučera', foto: 'foto/kucera.jpg',
        info: { sekce: 'Geografie', obor: 'Sociální geografie a regionální rozvoj', rocnik: '1. nMgr.', kontakt: 'kuceraondrej3@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 1]),
        priority: prio('o4 o1 o14 o8 o7', 'o6 o5 o13 o3 o2', 'o9 o10 o11 o12 o15'),
        komentare: {
            q7: 'Ano, ale tak, aby se tím nezvýšila celková náročnost studia.',
            o14: 'Výuka jazyků je podle něj silně podhodnocená – akademická angličtina by měla být součástí všech oborů.',
            o1: 'Chce jednodušší financování stávajících spolků a podporu vzniku nových.',
            o4: 'Chce komunikaci oběma směry: nápady studentů do senátu, informace ze senátu ke studentům.'
        },
        neprijemne: {
            n1: 'Ano. Méně kávy v kavárně, víc kávy na zasedáních.',
            n2: 'Cestuju rád, ale v semestru ne na dlouho.',
            n3: 'Přes kanály SKAS a přes lidi, které znám ze soustředění.',
            n4: 'Mám fakultu rád a chci jí něco vrátit.'
        }
    },
    {
        id: 'tadlik', jmeno: 'Ondřej Tadlík', foto: 'foto/tadlik.jpg',
        info: { sekce: 'Geografie', obor: 'Geografie a kartografie', rocnik: '2. Bc.', kontakt: '', odkaz: '' },
        odpovedi: odp([1, -1, -1, -1, -1, 1, -1, -1, 1, 1, 1, 1, -1]),
        priority: prio('o10 o9 o3 o8 o1', 'o15 o2 o4 o12 o7', 'o5 o6 o11 o13 o14'),
        komentare: {
            q1: 'Vývoj české demokracie je nejistý a akademická obec se musí umět ozvat.',
            q11: 'Klimatická hnutí jsou přirozený partner přírodovědecké fakulty.',
            o10: 'Chce snížit energetickou náročnost budov a spolupracovat se spolky a klimatickými hnutími.',
            o9: 'Chce vyšší rozpočet UK na rekonstrukci kolejí.',
            o8: 'Navrhuje revizi studijního a zkušebního řádu s ohledem na kreditovou váhu předmětů.'
        },
        neprijemne: {
            n1: 'Ano, je to pro mě priorita.',
            n2: 'Ne.',
            n3: 'Přes spolky i mimo ně – a přes témata, která se týkají všech, jako koleje.',
            n4: 'Akademické prostředí musí být odolné vůči politickým tlakům. To mě motivuje.'
        }
    },
    {
        id: 'gregor', jmeno: 'Baldo Gregor', foto: 'foto/gregor.jpg',
        info: { sekce: 'Geografie', obor: 'Geografie a kartografie', rocnik: '2.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 1, -1, 1]),
        priority: prio('o12 o10 o11 o3 o5', 'o15 o13 o7 o2 o1', 'o4 o6 o8 o9 o14'),
        komentare: {
            o12: 'Program ve verších: laboratoře na světové úrovni a spolupráce s praxí, stáže a výzkum pro všechny.',
            o10: 'Zelený kampus, méně odpadu, ekologické projekty.',
            o11: 'Flexibilní digitální výuka – online i offline.'
        },
        neprijemne: {
            n1: 'Čas si najdu, i kdyby to stálo pár rýmů méně.',
            n2: 'Neplánuju.',
            n3: 'Festivaly vědy, dny otevřených dveří – tam potkám každého.',
            n4: 'Chci, aby se o našich úspěších dozvěděl i svět.'
        }
    },

    // ===== CHEMIE =====
    {
        id: 'galova', jmeno: 'Karolína Gálová', foto: 'foto/galova.jpg',
        info: { sekce: 'Chemie', obor: 'Učitelství chemie pro SŠ', rocnik: '2. nMgr.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1]),
        priority: prio('o5 o6 o1 o4 o8', 'o12 o3 o2 o14 o11', 'o7 o9 o10 o13 o15'),
        komentare: {
            o5: 'Chce dát studentům zázemí a know-how pro popularizaci vědy a víc zapojit fakultu do Noci vědců a veletrhů.',
            o6: 'Navrhuje akce pro prváky – seznámení, praktické rady ke studiu i rozpočtu.'
        },
        neprijemne: {
            n1: 'Ano. Učím a studuju, takže ubrat budu muset z popularizačních akcí.',
            n2: 'Ne, chci na fakultě zůstat i na doktorát.',
            n3: 'Přes prváky – akce pro ně budu dělat sama.',
            n4: 'Chci na fakultě zůstat dlouho, takže mi záleží, jak bude vypadat.'
        }
    },
    {
        id: 'willimetz', jmeno: 'Robert Willimetz', foto: 'foto/willimetz.jpg',
        info: { sekce: 'Chemie', obor: 'Anorganická chemie', rocnik: '3. Ph.D.', kontakt: 'robert.willimetz@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, -1, 1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1]),
        priority: prio('o2 o1 o15 o5 o3', 'o11 o6 o8 o12 o10', 'o4 o7 o9 o13 o14'),
        komentare: {
            o2: 'Chce aktivně plánovat studentské prostory v Biocentru, zrekonstruovat klub Chladič a rozšířit knihovnu.',
            o1: 'Pro spolky víc peněz, víc propagace a hlavně prostory – Loděnice, Plavecká.',
            o3: 'Navrhuje vyšší úvazek fakultních psycholožek.'
        },
        neprijemne: {
            n1: 'Ano. Senátorem jsem i teď, vím, do čeho jdu.',
            n2: 'Ne, dokončuju doktorát tady.',
            n3: 'Schránka na podněty v Chladiči a pravidelné sbírání podnětů přes sítě.',
            n4: 'Jsem na fakultě osmým rokem a chci zúročit, co jsem se za tu dobu naučil.'
        }
    },
    {
        id: 'liska', jmeno: 'Vojtěch Liška', foto: 'foto/liska.jpg',
        info: { sekce: 'Chemie', obor: 'Anorganická chemie', rocnik: '3. Ph.D.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, -1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, -1]),
        priority: prio('o11 o8 o3 o1 o4', 'o12 o5 o6 o2 o14', 'o7 o9 o10 o13 o15'),
        komentare: {
            o11: 'Chce kvalitní online materiály a víc využívat Moodle.',
            o8: 'Chce lépe využívat anketu, aby studenti věděli, do čeho při výběru předmětů jdou.',
            o3: 'Dostupná psychologická pomoc a bezpečné prostředí.'
        },
        neprijemne: {
            n1: 'Ano, ale ubere to z času na start-up.',
            n2: 'Možná krátká stáž, budu online.',
            n3: 'Učím laboratorní techniku – tam potkám úplně všechny prváky.',
            n4: 'Znám obě strany barikády a chci je propojit.'
        }
    },
    {
        id: 'janacek', jmeno: 'Matyáš Janáček', foto: 'foto/janacek.jpg',
        info: { sekce: 'Chemie', obor: 'Medicinální chemie', rocnik: '1. Bc.', kontakt: 'janacekma@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, -1, 1]),
        priority: prio('o2 o11 o6 o1 o8', 'o4 o9 o14 o13 o5', 'o3 o7 o10 o12 o15'),
        komentare: {
            q8: 'Jeden vyučující používá Google Classroom, druhý Moodle, třetí obojí – to je zbytečný chaos.',
            o11: 'Chce sjednotit e-learning na jednu platformu a zjednodušit přístup do SIS a CAS (jeden účet, jedno heslo).',
            o2: 'Chce úložné skříňky a šatny pro studenty a delší otevírací dobu knihoven a studoven.'
        },
        neprijemne: {
            n1: 'Jsem v prváku, takže čas mám. Ubere to z plavání.',
            n2: 'Ne.',
            n3: 'Jsem prvák mezi prváky – nikdo mi nemusí nic zprostředkovávat.',
            n4: 'Všiml jsem si věcí, které se dají změnit hned, a nechci čekat čtyři roky.'
        }
    },

    // ===== GEOLOGIE A OŽP =====
    {
        id: 'koutnik', jmeno: 'Jakub Koutník', foto: 'foto/koutnik.jpg',
        info: { sekce: 'Geologie a OŽP', obor: 'Aplikovaná geologie / hydrogeologie', rocnik: '2. nMgr.', kontakt: 'koutnikjak@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, 1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1]),
        priority: prio('o5 o6 o1 o13 o2', 'o4 o9 o3 o12 o8', 'o7 o10 o11 o14 o15'),
        komentare: {
            o5: 'Chce dlouhodobou strategii propagace a náboru na sociálních sítích a efektivnější propagaci geologie na SŠ.',
            o6: 'Chce snížit počet studentů, kteří končí v prvním ročníku kvůli maličkostem.',
            q13: 'Sport drží komunitu pohromadě a fakultu dobře reprezentuje.',
            o13: 'Chce cílenější podporu sportovních oddílů a rozjet tým FC Přírodověda.',
            o1: 'Chce podporovat spolkovou činnost – sám organizuje akce pro stovky lidí.'
        },
        neprijemne: {
            n1: 'Sport mě naučil zvládat víc věcí najednou. Ubrat budu muset z organizace některých akcí.',
            n2: 'Na zápasy ano, ale na pár dní. Senát nepojede beze mě.',
            n3: 'Na hokeji a na akcích potkávám stovky lidí, kteří do žádného spolku nechodí.',
            n4: 'Sport mě naučil dotahovat věci do konce. Chci to přenést do senátu.'
        }
    },
    {
        id: 'kriz', jmeno: 'Ondřej Kříž', foto: 'foto/kriz.jpg',
        info: { sekce: 'Geologie a OŽP', obor: 'Geologie', rocnik: '1. Bc.', kontakt: 'krizondrej1@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1]),
        priority: prio('o6 o4 o1 o8 o14', 'o7 o3 o11 o2 o5', 'o9 o10 o12 o13 o15'),
        komentare: {
            o6: 'Chce zjednodušit přechod na VŠ: doplnit příručku prváka, další přednášky a nové formáty předávání informací.',
            o4: 'Chce naslouchat studentům všech ročníků a přinést do SKAS pohled nováčků.'
        },
        neprijemne: {
            n1: 'Studuju dvě školy, takže čas si musím hlídat. Senát má přednost před dalšími aktivitami.',
            n2: 'Krátké výjezdy Erasmus+ ano, na zasedání budu online.',
            n3: 'Jsem sám nováček – stačí se ptát spolužáků.',
            n4: 'Změny prosadí jen aktivní studenti. Chci být jedním z nich.'
        }
    },
    {
        id: 'sulc', jmeno: 'Jan Šulc', foto: 'foto/sulc.jpg',
        info: { sekce: 'Geologie a OŽP', obor: 'Geologie', rocnik: '3. Ph.D.', kontakt: '', odkaz: '' },
        odpovedi: odp([-1, -1, 1, 1, 1, -1, 1, -1, 1, 1, 1, 1, -1]),
        priority: prio('o7 o3 o9 o15 o10', 'o1 o2 o12 o14 o4', 'o5 o6 o8 o11 o13'),
        komentare: {
            o7: 'Chce víc zapojit studenty do evropských výzkumných programů a mobilit.',
            o3: 'Fakulta má být bezpečné místo – ochrana před šikanou a diskriminací.',
            o9: 'Navrhuje rozšířit kapacitu menzy Albertov a investovat do dostupných kolejí.'
        },
        neprijemne: {
            n1: 'Ano, v senátu už jsem a rozvrh mám nastavený.',
            n2: 'Konference ano, delší pobyt ne.',
            n3: 'Učím praktikum ze všeobecné geologie, potkávám tam všechny ročníky.',
            n4: 'Nový děkan, nová doba, nové výzvy – chci u toho být.'
        }
    },
    {
        id: 'pernicky', jmeno: 'Patrik Pernický', foto: 'foto/pernicky.jpg',
        info: { sekce: 'Geologie a OŽP', obor: 'Geologie', rocnik: '1. Bc.', kontakt: 'patrik.pernicky@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([-1, 1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1]),
        priority: prio('o12 o1 o9 o2 o13', 'o5 o6 o8 o10 o15', 'o3 o4 o7 o11 o14'),
        komentare: {
            o12: 'Chce větší podporu vědy a výzkumu.',
            o1: 'Podpora studentských spolků, klubů a akcí.'
        },
        neprijemne: {
            n1: 'Ano. Ubere to z času v jeskyních, ale ne úplně.',
            n2: 'Ne.',
            n3: 'Na terénních exkurzích – tam je každý, nejen spolkaři.',
            n4: 'Fakultu znám dlouho, i když jsem v prváku. Chci ukázat, že to není na škodu.'
        }
    },
    {
        id: 'slacalova', jmeno: 'Veronika Sláčalová', foto: 'foto/slacalova.jpg',
        info: { sekce: 'Geologie a OŽP', obor: 'Ochrana životního prostředí', rocnik: '3. Bc.', kontakt: 'slacalov@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, -1]),
        priority: prio('o1 o2 o10 o8 o7', 'o5 o6 o14 o3 o4', 'o9 o11 o12 o13 o15'),
        komentare: {
            q10: 'Etický kodex by se měl znovu otevřít a projednat se studenty.',
            o2: 'Chce víc míst pro samostudium a setkávání.',
            o10: 'V budově ÚŽP chce víc nádob na tříděný odpad včetně bioodpadu.',
            o8: 'Chce motivovat studenty k vyplňování ankety a brát jejich připomínky vážně; víc terénní výuky.'
        },
        neprijemne: {
            n1: 'Ano. Ubere to z lektorování.',
            n2: 'Erasmus možná v magistru, budu online.',
            n3: 'Primárně ÚŽP – tam znám skoro každého. Ostatní sekce přes zástupce.',
            n4: 'Chci, aby nápady spolužáků nezůstaly jen v kuloárech.'
        }
    },
    {
        id: 'juha', jmeno: 'Ondřej Juha', foto: 'foto/juha.jpg',
        info: { sekce: 'Geologie a OŽP', obor: 'Hydrologie a hydrogeologie', rocnik: '3. nMgr.', kontakt: 'ondrej.juha@natur.cuni.cz', odkaz: '' },
        odpovedi: odp([1, 1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 1, 1]),
        priority: prio('o6 o1 o3 o8 o12', 'o7 o2 o4 o5 o13', 'o9 o10 o11 o14 o15'),
        komentare: {
            o6: 'Chce dál zlepšovat Úvodní soustředění a pomáhat studentům jako tutor.',
            q12: 'Doktorandské stipendium je dlouhodobě nízké, ale ostatním studentům by se brát nemělo.',
            o12: 'Chce hájit studenty u novely VŠ zákona a zvýšit doktorandské stipendium i pro ty, kdo nastoupili dřív.',
            o8: 'Studentská anketa by se měla víc promítat do stylu výuky; víc praktických předmětů a terénu.'
        },
        neprijemne: {
            n1: 'Ano. Soustředění a tutorování dělám i tak, senát k tomu přirozeně patří.',
            n2: 'Ne, dokončuju magistra.',
            n3: 'Jako tutor a organizátor soustředění znám prváky ze všech sekcí.',
            n4: 'Úspěch ve studiu podle mě stojí na vztazích. Chci je na fakultě budovat.'
        }
    }
];
