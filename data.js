// =====================================================================
//  Volby do Studentské komory ASF PřF UK 2026 – OSTRÁ DATA
//  Kandidáti podle https://natur.cuni.cz/.../volby-do-studentske-komory-asf-2026
//  Komentáře u oblastí = stručné parafráze volebních programů kandidátů.
//  Odpovědi Ano/Ne, priority a nepříjemné otázky vyplňují SAMI KANDIDÁTI.
//  Kdo nemá vyplněné všechny priority (5/5/5), není ve výsledcích kalkulačky.
// =====================================================================

const limitPriorit = 5;

// --- SEKCE ---
// Jediné místo, kde se sekce definují. Pořadí určuje i pořadí na stránce kandidátů.
// Barvy jsou v style.css pod třídou .sekce-<klic>.
const sekce = [
    { nazev: 'Biologie',       klic: 'bio',  kratce: 'Biologie',   voli: 7 },
    { nazev: 'Geografie',      klic: 'geo',  kratce: 'Geografie',  voli: 3 },
    { nazev: 'Chemie',         klic: 'chem', kratce: 'Chemie',     voli: 2 },
    { nazev: 'Geologie a ÚŽP', klic: 'uzp',  kratce: 'Geol & ÚŽP', voli: 2 }
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

// --- OTÁZKY ANO/NE (témata, na kterých se kandidáti rozcházejí) ---
// q1–q6: obecné otázky k roli senátu; q7–q17: sporná témata z letošních programů
const otazky = [
    { id: 'q1',  text: 'Měl by se SKAS veřejně vyjadřovat k politickým a celospolečenským tématům (např. kauza odměn bývalé rektorky, nový vysokoškolský zákon, zákon o veřejnoprávních médiích)?' },
    { id: 'q2',  text: 'Měla by fakulta na své půdě umožňovat studentské akce s politickým charakterem, včetně demonstrací?' },
    { id: 'q3',  text: 'Měl by SKAS fungovat trochu jako spolek – sám pořádat akce a budovat komunitu studentů?' },
    { id: 'q4',  text: 'Měla by fakulta při finanční podpoře spolků důsledně kontrolovat kvalitu akcí, které pořádají?' },
    { id: 'q5',  text: 'Jste spokojeni s prací děkana doc. Krylova a jeho kolegia?' },
    { id: 'q6',  text: 'Kdyby se zítra volil nový děkan, patřil by doc. Krylov automaticky k favoritům?' },
    { id: 'q7',  text: 'Měl by být studentský senátor vůči vedení fakulty spíše kritický než kooperativní?' },
    { id: 'q8',  text: 'Měla by být výuka cizích jazyků (hlavně obecné angličtiny) bezplatnou a povinnou součástí studijních plánů všech oborů?' },
    { id: 'q9',  text: 'Měla by tělesná výchova zůstat pro bakaláře povinná?' },
    { id: 'q10', text: 'Měla by fakulta omezit používání generativní AI ve vlastní propagaci a ve výuce?' },
    { id: 'q11', text: 'Měla by fakulta zavést jednotná pravidla pro používání AI ve studiu a víc učit, jak s AI pracovat?' },
    { id: 'q12', text: 'Měly by být odborné stáže kreditově ohodnocené a součástí studijních plánů napříč obory?' },
    { id: 'q13', text: 'Měli by vyučující povinně zveřejňovat prezentace a studijní materiály na jednom místě (např. v Moodlu)?' },
    { id: 'q14', text: 'Měla by se výrazně rozšířit hybridní výuka a nahrávání přednášek?' },
    { id: 'q15', text: 'Měli by vyučující povinně reagovat na výsledky studentské ankety?' },
    { id: 'q16', text: 'Měla by fakulta zavést čipový vstupní systém do budov?' },
    { id: 'q17', text: 'Měla by fakulta investovat do vlastní posilovny a sálu na cvičení v kampusu?' }
];

// --- PRIORITNÍ OBLASTI (témata, na kterých se shodne většina; rozdíl je v tom, jak moc) ---
// 15 oblastí × 3 úrovně × limit 5 → kandidát má přesně 5× Priorita, 5× Důležité, 5× Okrajové.
const oblasti = [
    { id: 'o1',  text: 'Podpora a financování studentských spolků' },
    { id: 'o2',  text: 'Prostory ke studiu a odpočinku' },
    { id: 'o3',  text: 'Duševní zdraví a psychologická péče' },
    { id: 'o4',  text: 'Bezpečné, férové a inkluzivní prostředí' },
    { id: 'o5',  text: 'Komunikace senátu se studenty a transparentnost' },
    { id: 'o6',  text: 'Informovanost o organizaci studia (web, SIS, návody)' },
    { id: 'o7',  text: 'Podpora prváků a sdílení zkušeností mezi ročníky' },
    { id: 'o8',  text: 'Kvalita výuky, studijní materiály a studentská anketa' },
    { id: 'o9',  text: 'Kariéra, praxe a stáže' },
    { id: 'o10', text: 'Zahraniční výjezdy a stáže' },
    { id: 'o11', text: 'Udržitelnost a třídění odpadu' },
    { id: 'o12', text: 'Výuka cizích jazyků' },
    { id: 'o13', text: 'Popularizace vědy a propagace fakulty' },
    { id: 'o14', text: 'Terénní a praktická výuka' },
    { id: 'o15', text: 'Podpora doktorandů a studentského výzkumu' }
];

// Kandidát je v kalkulačce jen tehdy, když ohodnotil VŠECHNY oblasti a nepřekročil limit v žádné úrovni.
function maPlnePriority(k) {
    const p = k.priority || {};
    if (!oblasti.every(o => [1, 2, 3].includes(p[o.id]))) return false;
    return [1, 2, 3].every(u => oblasti.filter(o => p[o.id] === u).length <= limitPriorit);
}

// Zápatí obou stránek
function paticka() {
    return `<footer class="paticka">
        <nav class="paticka-nav"><a href="index.html">Úvod</a> · <a href="kalkulacka.html">Kalkulačka</a> · <a href="kandidati.html">Kandidáti</a> · <a href="o-kalkulacce.html">Proč to celé?</a></nav>
        Nezávislá studentská iniciativa, nikoli oficiální nástroj SKAS ani ASF.<br>
        Vytvořeno pro účely voleb do Studentské komory Akademického senátu PřF UK (SK ASF) v roce 2026.
        Za obsah odpovídají samotní kandidáti, kteří veškeré údaje poskytli, nebo jsou součástí jejich veřejných kandidatur.
    </footer>`;
}

// --- NEPŘÍJEMNÉ OTÁZKY (stejné pro všechny) ---
const neprijemneOtazky = [
    { id: 'n1', text: 'Budeš mít na práci v senátu dost času? Čeho se kvůli ní vzdáš?' },
    { id: 'n2', text: 'Plánuješ během mandátu výjezd do zahraničí? Pokud ano, jak zůstaneš v kontaktu se senátem a studenty?' },
    { id: 'n3', text: '„Plnit, co studenti chtějí“ je hezká fráze. Jak konkrétně budeš v kontaktu i s běžnými studenty, kteří nejsou ve spolcích ani v senátu?' },
    { id: 'n4', text: 'Kde se vzalo tvé odhodlání kandidovat? Co tě přiměje dát do práce ve SKAS 110 %?' }
];

// Odpovědi na otázky jako pole v pořadí q1..q17 (1 = Ano, -1 = Ne) – až je kandidát pošle
const odp = pole => Object.fromEntries(pole.map((v, i) => ['q' + (i + 1), v]));

// Priority zapsané po úrovních: prio('o1 o3 …' = Priorita, '…' = Důležité, '…' = Okrajové) – až je kandidát pošle
const prio = (tri, dve, jedna) => {
    const p = {};
    [[tri, 3], [dve, 2], [jedna, 1]].forEach(([seznam, u]) => seznam.split(' ').filter(Boolean).forEach(id => p[id] = u));
    return p;
};

const drive = id => `https://drive.google.com/file/d/${id}/view`;

// Kandidát: údaje z životopisu + komentáře z programu.
// Až kandidát pošle odpovědi, doplň: odpovedi: odp([...]), priority: prio('...', '...', '...'), neprijemne: { n1: '...', ... }
function kandidat(id, jmeno, sekceNazev, driveId, obor, rocnik, kontakt, komentare, foto = `foto/${id}.jpg`) {
    return {
        id, jmeno, foto,
        info: { sekce: sekceNazev, obor, rocnik, kontakt, odkaz: drive(driveId) },
        odpovedi: {}, priority: {}, komentare, neprijemne: {}
    };
}

// --- KANDIDÁTI (pořadí uvnitř sekce = pořadí na stránce kandidátů, podle webu fakulty) ---
const kandidati = [
    // ===== BIOLOGIE (7 mandátů) =====
    kandidat('basta', 'Miroslav Bašta', 'Biologie', '1ceq9N1pBuCotmSUflXS6FC6QhYOzgSdM',
        'Vývojová a buněčná biologie', '5. ročník Ph.D.', 'miroslav.basta@natur.cuni.cz', {
            o8: 'Chce rozšířit hybridní výuku a zajistit kvalitní studijní materiály.',
            o1: 'Chce udržet podporu spolků a sehnat jim důstojné zázemí.',
            o6: 'Chce modernizovat fakultní web, hlavně funkční vyhledávání.',
            o7: 'Chce podpořit seznamovací akce pro nastupující magistry z jiných škol.'
        }),
    kandidat('belza', 'Václav Cedrik Belza', 'Biologie', '1qO15oM3r9fCdlnRFhp25LdzSSj4CGCQz',
        'Botanika', '1. ročník Ph.D.', '', {
            o5: 'Chce v senátu projednávat i nápady studentů mimo SKAS a kriticky prověřovat nové návrhy, aby neprošly unáhlené změny.',
            o6: 'Chce sjednotit informace a požadavky napříč katedrami a zlepšit dostupnost informací o průběhu studia a závěrečných zkouškách.',
            o7: 'Chce řešit organizaci studentských tutorů a jejich roli.'
        }),
    kandidat('cerny', 'Dominik Černý', 'Biologie', '1bPH-SxCfwDJ9lPYjRwo4OLA-S278xXs8',
        'Botanika', '1. ročník nMgr.', '', {
            o8: 'Chce, aby vyučující museli reagovat na studentské ankety, a protestuje proti bezhlavému používání AI ve výuce a propagaci fakulty.',
            o5: 'Chce založit kalendář všech studentských akcí a platformu pro mezioborové aktivity.',
            o7: 'Chce víc podpořit prváky, hlavně v prvním zkouškovém.',
            o11: 'Chce na chodbách třídit i kov.',
            o9: 'Chce propagovat i nevědecká uplatnění přírodovědných titulů.'
        }),
    kandidat('jilek', 'Vojtěch Jílek', 'Biologie', '104mP4Ny_PcF_PVz7eQJRnduzeDN6aXQw',
        'Biologie se zaměřením na vzdělávání', '2. ročník Bc.', 'jilekvo@natur.cuni.cz', {
            o6: 'Chce včasné informace přes školní e-mail a snadno dohledatelné návody na webu (zápis, náležitosti prací).',
            o2: 'Chce hledat nové výukové prostory, zvelebit Chladič, knihovny a chodby a prodloužit otevírací dobu knihoven.',
            o8: 'Chce studijní materiály na jednom místě, bezplatně zpřístupněné prezentace a podporu tvorby skript.',
            o1: 'Chce dál podporovat spolky a umožňovat studentské akce včetně politických a demokratických (volby, demonstrace).',
            o13: 'Chce víc prezentovat fakultu na veletrzích, YouTube a Instagramu.'
        }),
    kandidat('juranova', 'Veronika Juráňová', 'Biologie', '1XaIJnYNtuhHp1AjcAAuY6j-TPGjMn1Cf',
        'Učitelství biologie a geografie', '3. ročník Bc.', '', {
            o2: 'Chce zvelebit prostory na Benátské 2 a Viničné 5 (zásuvky, místo k ohřátí oběda) a řešit přeplněné přednášky.',
            o4: 'Chce podporu studentů a vyučujících s handicapem a spolupráci s ombudsmankou.',
            o15: 'Chce hlídat spravedlivé financování doktorátů na biologii.',
            o9: 'Chce užitečné praxe, kontakty a debaty s lidmi z oboru.',
            o5: 'Chce být mostem mezi studenty a vedením, srozumitelně informovat o dění a dát hlas učitelským oborům.'
        }),
    kandidat('kivader', 'Martin Kivader', 'Biologie', '1QnOdITGHWuYlxPXUuTXfYdiAa6lVVGiT',
        'Teoretická a evoluční biologie', '1. ročník Ph.D.', '', {
            o4: 'Chce dohlížet na spravedlivé zacházení se všemi členy akademické obce a na činnost senátu.',
            o1: 'Chce dál podporovat spolky a nezávislé studentské iniciativy.',
            o13: 'Kritizuje zbytečnou generativní AI ve vizuálech fakulty a u přednášejících.'
        }),
    kandidat('kubu', 'Martin Kubů', 'Biologie', '1ESg6mVp2WQFyNFNoKtbG674MnNwLC8oV',
        'Molekulární a buněčná biologie, genetika a virologie', '5. ročník Ph.D.', '', {
            o4: 'Chce férové a bezpečné prostředí s jasnými etickými hranicemi, ochranu před zneužíváním moci a důvěryhodné řešení podnětů; dál pracovat na etickém kodexu.',
            o5: 'Chce být oboustrannou spojkou mezi studenty a vedením fakulty.'
        }),
    kandidat('lis', 'Jonáš Lis', 'Biologie', '1WGxmjmmZldP72OlDP6GttH5uIyxsbpKU',
        'Botanika', '1. ročník Ph.D.', '', {
            o12: 'Chce prosadit bezplatnou výuku cizích jazyků, hlavně angličtiny.',
            o6: 'Chce zlepšit komunikaci organizace studia a snížit byrokracii, aby kvůli kliknutí v SIS nikdo neprodlužoval studium.',
            o8: 'Chce zjednodušit hodnocení výuky, aby ho vyplňovalo víc lidí.',
            o5: 'Nabízí osobní konzultace ve studentském klubu a chce zvýšit odolnost fakulty vůči politickým vlivům.'
        }),
    kandidat('lukacova', 'Klára Lukáčová', 'Biologie', '1oRBS6VEzdBzY_duq0jefdn0b27ttxNVI',
        'Terestrická ekologie', '2. ročník nMgr.', 'lukacovklar@natur.cuni.cz', {
            o6: 'Chce přehlednější studijní plány a organizaci studia.',
            o10: 'Chce zjednodušit přístup k zahraničním stážím.',
            o2: 'Chce studijní a odpočinkové prostory, hlavně na Viničné 7.',
            o3: 'Chce dostupnější psychologickou péči a kariérní poradenství.',
            o1: 'Chce propojit studenty akcemi a propagací spolků.'
        }),
    kandidat('nejedla', 'Eliška Nejedlá', 'Biologie', '1AOIQUI7yeftcNa7i8BKsBRiyrEtkVAxV',
        'Imunologie', '1. ročník nMgr.', '', {
            o5: 'Chce nosit do senátu podněty studentů a hájit jejich zájmy.',
            o6: 'Chce lépe vysvětlovat organizaci studia, hlavně na začátku a na konci.',
            o1: 'Chce lépe propagovat a rozvíjet spolky.'
        }),
    kandidat('pipalova', 'Eliška Pipalová', 'Biologie', '1Gk3QpMYyaAN0lsj1XMbTLWxTXXmwaC0G',
        'Reprodukční a vývojová biologie', '1. ročník nMgr.', 'pipalovel@natur.cuni.cz', {
            o9: 'Chce kredity za odborné stáže, spolupráci s firmami, kariérní semináře a setkání s absolventy.',
            o12: 'Chce víc předmětů v angličtině a kvalitní jazykovou přípravu.',
            o10: 'Chce lepší informace o výjezdech a jejich financování.',
            o5: 'Chce informovat přes sociální sítě a hlídat transparentnost rozpočtu.',
            o2: 'Chce odpočinkové zóny.',
            o8: 'Chce, aby se zpětná vazba skutečně promítala do výuky.'
        }),
    kandidat('polak', 'Arnošt Polák', 'Biologie', '1vvAUJ29yOoGttUCp3H4AaWCQITG9s0FX',
        'Bioinformatika', '2. ročník nMgr.', 'arnost.polak@natur.cuni.cz', {
            o8: 'Chce dohlédnout na včasné a řádné reakreditace studijních programů se zapojením studentů.',
            o1: 'Chce zachovat a co nejvíc navýšit podporu spolků a dát jim větší roli ve fakultním PR.',
            o15: 'Chce s knihovnami rozšířit elektronické zdroje o oborové časopisy.'
        }),

    // ===== GEOGRAFIE (3 mandáty) =====
    kandidat('fisarova', 'Justýna Fišarová', 'Geografie', '1XfyXclTDBGix0o1HnHpogDvUNzo94l6q',
        'Demografie se sociologií', '3. ročník Bc.', 'fisarovjus@natur.cuni.cz', {
            o12: 'Chce rozvíjet jazykové vzdělávání, nejen angličtinu.',
            o2: 'Chce víc míst k sezení a odpočinku a podpořit iniciativu Za lepší Albertov.',
            o1: 'Chce u spolků omezit zbytečnou byrokracii a nastavit rozumná pravidla pro malé i velké spolky.',
            o5: 'Chce být spojkou mezi senátem, vedením a studenty a zlepšit komunikaci mezi fakultami.'
        }),
    kandidat('gregor', 'Baldo Gregor', 'Geografie', '1u0-Z2D9A8vuDjmfoCHskxE3bhEGlrzt4',
        'Fyzická geografie a geoekologie', '1. ročník', '', {
            o5: 'Klade důraz na férovou debatu a transparentní jednání.'
        }),
    kandidat('jandik', 'Jan Jandík', 'Geografie', '1ahj1gX9lnmpNMSFtsxGaA-tAC4rmNMSm',
        'Fyzická geografie a geoekologie', '1. ročník nMgr.', '', {
            o5: 'Chce zjišťovat podněty studentů, předávat je vedení a srozumitelně informovat o rozhodnutích senátu.',
            o2: 'Chce lepší zázemí pro samostudium, skupinovou práci a odpočinek.',
            o9: 'Chce propojit studium s praxí a víc stáží.',
            o8: 'Chce materiály na jednom místě a včasné odpovědi vyučujících na e-maily.',
            o7: 'Chce příležitosti ke sdílení zkušeností mezi ročníky.'
        }),
    kandidat('kucera', 'Ondřej Kučera', 'Geografie', '1S4QPNNo7pCpxBjawOEnu9udpwzedkzQ6',
        'Sociální geografie a regionální rozvoj', '1. ročník Ph.D.', 'kuceraondrej3@natur.cuni.cz', {
            o12: 'Chce dotáhnout zařazení jazyků do studijních plánů.',
            o1: 'Chce odstranit zbývající díry v novém systému podpory spolků.',
            o11: 'Chce lepší třídění odpadu, bezobalová řešení a strategii udržitelné mobility.',
            o2: 'Chce fakultní posilovnu a sál na aerobik v kampusu.'
        }),
    kandidat('prasivka', 'Jonáš Prašivka', 'Geografie', '1MYHhyxqM6weghem2BGuohwQ3y3TPHFel',
        'Geografie a kartografie', '2. ročník Bc.', '', {
            o1: 'Chce maximální podporu spolků včetně zakládání nových.',
            o8: 'Chce jednotná pravidla pro AI ve studiu a víc výuky práce s AI.',
            o6: 'Chce klást otázky k organizaci studia tam, kde se dá najít odpověď.'
        }),
    kandidat('slovak', 'Martin Slovák', 'Geografie', '141Vl5wvwV4t-kVf9Co7_sVUMzLwLoJGK',
        'Demografie se sociologií', '2. ročník', '', {
            o7: 'Chce buddy program propojující prváky se staršími studenty.',
            o13: 'Chce, aby studenti představovali obory na svých bývalých středních školách.',
            o2: 'Chce pohodlnější odpočinkové prostory.',
            o1: 'Chce uspořádat fakultní turnaj v GeoGuessru.'
        }),

    // ===== CHEMIE (2 mandáty) =====
    kandidat('buresova', 'Anna Burešová', 'Chemie', '1ooATHpqHrGK6vyOOf0x_qFcRDVls-w4p',
        'Biochemie', '2. ročník Bc.', 'buresovaanna2@natur.cuni.cz', {
            o7: 'Chce víc propagovat studentské tutory na DOD a seznamovacích kurzech.',
            o2: 'Chce rozšířit studentské prostory, topení v Chladiči a automat na kávu a čaj.',
            o1: 'Chce podporu nových spolků a mezispolkových akcí a důstojné prostory pro spolky.',
            o8: 'Chce pravidelně vyhodnocovat anonymní ankety; navrhuje procentuální docházku na TV.'
        }),
    kandidat('hrebenar', 'Jan Jindřich Hřebenář', 'Chemie', '10iVR6LzTwbV9Ro5HA7OLLHSvECP1Dn0n',
        'Chemie a fyzika materiálů', '1. ročník nMgr.', 'hrebenaj@natur.cuni.cz', {
            o4: 'Chce čipový vstupní systém proti vstupu nepovolaných osob.',
            o11: 'Chce reuse/swap centrum pro vyřazené přístroje, sklo a chemikálie.',
            o13: 'Chce prověřit obnovení Chemických úterků pro veřejnost.',
            o12: 'Chce pro všechny výuku obecné angličtiny, případně dalších jazyků.'
        }),
    kandidat('janacek', 'Matyáš Janáček', 'Chemie', '1AA4jYj40Y7TOKj4usoGS3AR3zvFs7bHR',
        'Medicinální chemie', '3. ročník', 'janacekma@natur.cuni.cz', {
            o2: 'Chce šatny nebo skříňky a delší otevírací dobu knihoven a studoven.',
            o6: 'Chce jednodušší přístup do CAS a SIS a placení kartou v knihovnách.',
            o1: 'Chce podporovat spolky a svobodnou diskuzi na fakultě.'
        }),
    kandidat('willimetz', 'Karolína Willimetz', 'Chemie', '18hNI0N8WajAcgXzBjnN0OMdzbUQilkhd',
        'Didaktika chemie', '2. ročník Ph.D.', '', {
            o13: 'Chce zázemí a know-how pro studenty popularizující vědu a větší účast fakulty na Noci vědců a veletrzích.',
            o7: 'Chce podporovat akce a komunity pro prváky.'
        }),

    // ===== GEOLOGIE A ÚŽP (2 mandáty) =====
    kandidat('kabatova', 'Pavla Kabátová', 'Geologie a ÚŽP', '1KwPb3BtyOESR7uxMg8ENTVf2klXKhF5C',
        'Management udržitelnosti', '1. ročník nMgr.', 'kabatovpav@natur.cuni.cz', {
            o11: 'Chce pracovní skupinu pro udržitelnost, jednotné třídění odpadu včetně bioodpadu a vratné kelímky v Živině.',
            o10: 'Chce umožnit výjezd už od 1. ročníku Bc. a semináře o jiných výjezdech než Erasmus.',
            o14: 'Chce víc terénní a praktické výuky.',
            o5: 'Chce pravidelná setkání se studenty a jednoduchý kanál pro podněty.',
            o2: 'Chce prostory ke studiu i po 18. hodině.',
            o8: 'Chce aktualizované sylaby a práci s výsledky hodnocení výuky.'
        }),
    kandidat('kojzarova', 'Andrea Kojzarova', 'Geologie a ÚŽP', '14HgHVZZF_IiFmHj7w-ze7tyokskYlcxF',
        'Geologie (paleontologie)', '1. ročník nMgr.', '', {
            o5: 'Chce být dostupnou zástupkyní geologů a informovat o rozhodnutích senátu.',
            o7: 'Pořádá přednášku pro prváky o zkouškovém a chce sdílení zkušeností mezi ročníky.'
        }),
    kandidat('pernicky', 'Patrik Pernický', 'Geologie a ÚŽP', '1Il-yFWJ-sUN9fNniW4TiJMMR7i6_Cj0p',
        'Geologie', '3. ročník', 'patrik.pernicky@natur.cuni.cz', {
            o5: 'Lepší komunikace mezi senátem a voliči.',
            o8: 'Kvalita výuky, věda a stipendia.',
            o3: 'Podpora duševního zdraví a bezpečného prostředí.',
            o1: 'Studentský život, spolky a komunita.'
        }),
    kandidat('simandlova', 'Václava Šimandlová', 'Geologie a ÚŽP', '1kVmxL-PmkM5te9t-8d234kDmXf6cMAoA',
        'Hydrologie a hydrogeologie', '1. ročník nMgr.', 'simandlv@natur.cuni.cz', {
            o15: 'Chce včas informovat o zapojení do výzkumu už od 1. ročníku a víc peněz pro doktorandy.',
            o14: 'Chce víc terénních cvičení a exkurzí.',
            o12: 'Chce povinnou obecnou angličtinu podle úrovně studenta.',
            o3: 'Chce lepší dostupnost psychologického poradenství a workshopy o vyhoření a stresu.',
            o1: 'Chce méně byrokracie při pořádání akcí a transparentnější podporu spolků.'
        }),
    kandidat('zemancova', 'Nicol Zemancová', 'Geologie a ÚŽP', '1zQm2XgyotLv76UwYbUoqoNNzYBSAZB84',
        'Management udržitelnosti', '1. ročník nMgr.', 'zemancon@natur.cuni.cz', {
            o11: 'Chce pracovní skupinu pro udržitelnost a třídění bioodpadu a kovu.',
            o9: 'Chce pracovní veletrh, newsletter se stážemi a viditelnější Kariérní centrum UK.',
            o10: 'Chce lepší informovanost o Erasmu.',
            o2: 'Chce víc míst k odpočinku a spolupráci s iniciativou Za lepší Albertov.'
        })
];
