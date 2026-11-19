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

// --- OTÁZKY ANO/NE ---
// Každá otázka: krátké znění (text) + kontext pod tlačítkem „Kontext“.
// Kontext je buď pro/proti (Zastánci / Odpůrci), nebo jen věcné info (u otázek na děkana).
// Pořadí = pořadí v kalkulačce (zásadní pravomoci jsou záměrně na konci).
const otazky = [
    // Spolky, iniciativy a komunita
    { id: 'q1', text: 'Měly by peníze pro spolky jít hlavně těm s nejkvalitnějšími žádostmi?',
      pro: 'Peníze se využijí efektivněji, podpoří se akce s největším přínosem a spolky budou motivované psát dobré žádosti.',
      proti: 'Malé a nové spolky, které ještě neumí psát žádosti, mohou přijít zkrátka. Rovnoměrnější rozdělení drží pestrý spolkový život, i když jednotlivé akce dostanou méně.' },
    { id: 'q2', text: 'Měl by SKAS mít hranici, za kterou už spolek další podporu nedostane?',
      pro: 'Hranice – ať jde o výši dosavadní podpory, nebo o opakované porušování pravidel (žádosti po termínu, chybějící vyúčtování) – brání tomu, aby peníze brali jen ti nejaktivnější, a vede spolky k disciplíně.',
      proti: 'Aktivní spolky s dobrými nápady by mohly narazit na strop, i když peníze zbývají. Přísná pravidla dopadají i na drobná a nezaviněná pochybení – SKAS v podobných případech spíše postupuje individuálně dle okolností.' },
    { id: 'q3', text: 'Měla by fakulta poskytovat spolkům své prostory a zázemí zdarma?',
      pro: 'Spolky jsou neziskové a dělají z fakulty živé místo. Poplatky za energie, úklid a správu je zbytečně zatěžují a odrazují od pořádání akcí.',
      proti: 'Náklady nezmizí – fakulta je zaplatí z peněz, které by mohly jít na jiné potřeby studentů. Dnes fakulta za akce mimo rozvrh úhradu provozních nákladů požaduje.' },
    { id: 'q4', text: 'Měl by SKAS převzít správu studentských prostor (Loděnice, vnitroblok Hlavova 8, zahrada v Horské)?',
      pro: 'Studenti nejlépe vědí, jak prostory využít. SKAS by mohl pružně nastavovat pravidla a rozdělovat prostor mezi spolky a iniciativy.',
      proti: 'Správa znamená práci a odpovědnost za provoz i škody, kterou by nesli neplacení dobrovolníci. U konkrétního prostoru to SKAS v roce 2026 velmi těsně odmítl.' },

    // Role senátu a senátora
    { id: 'q5', text: 'Měl by se Akademický senát fakulty veřejně vyjadřovat k politickým tématům?',
      pro: 'Senát zastupuje akademickou obec a jeho hlas má váhu – například k novému vysokoškolskému zákonu, kauze odměn bývalé rektorky nebo zákonu o veřejnoprávních médiích. Mlčení může působit jako souhlas.',
      proti: 'Senát má řešit fakultu. Politická vyjádření mohou rozdělovat akademickou obec, kde lidé mají různé názory, a ubírají čas na vlastní agendu. ASF se zatím vyjadřoval hlavně k vysokoškolské politice.' },
    { id: 'q6', text: 'Je hlavní úlohou studentského senátora kontrolovat vedení fakulty?',
      pro: 'Senát je kontrolní orgán: schvaluje rozpočet a předpisy a volí děkana. Bez důsledné kontroly by vedení rozhodovalo samo.',
      proti: 'Senátor může studentům přinést víc, když sám přichází s návrhy a projekty a s vedením na nich spolupracuje. Samotná kontrola nic nového nevytvoří.' },
    { id: 'q7', text: 'Měl by senát využívat svůj rozpočet hlavně na vlastní akce a projekty pro studenty?',
      info: 'Senát má vlastní rozpočet. Může ho využívat na svůj provoz (např. odměny předsedům komisí, občerstvení na jednáních), nebo na vlastní akce a projekty. Akce pro studenty dnes pořádají hlavně spolky, které SKAS podporuje.' },

    // Studijní záležitosti
    { id: 'q8', text: 'Měla by fakulta rozvíjet cizí jazyky hlavně přes odborné předměty vyučované v cizím jazyce?',
      pro: 'Studenti se naučí odbornou terminologii přímo ve svém oboru a předměty se zároveň otevřou zahraničním studentům.',
      proti: 'Kdo jazyk dobře neovládá, ten se v odborném předmětu v angličtině ztratí. Samostatné jazykové kurzy učí jazyk systematicky – a studenti v dotazníku fakulty dali přednost povinné angličtině.' },
    { id: 'q9', text: 'Měly by studijní programy dávat studentům víc volnosti při skládání studia?',
      pro: 'Víc povinně volitelných předmětů (jako moduly v bakalářské biologii) a možnost nahradit část výuky stáží nebo praxí umožní jít za vlastním zájmem a profilovat se.',
      proti: 'Studenti dostanou méně vedení, hůř se orientují v nabídce a nemusí získat ucelený základ oboru. Volnost také ztěžuje hodnocení kvality programu.' },
    { id: 'q10', text: 'Mělo by vedení fakulty dávat vyučujícím jednotný směr ve výuce?',
      pro: 'Jasná pravidla – jak používat AI, zda nahrávat přednášky, mít materiály na jednom místě (např. v Moodlu) – usnadní studium napříč katedrami.',
      proti: 'Katedry a vyučující znají svůj obor nejlépe. Plošné pokyny shora nemusí sedět na různé typy výuky a omezují akademickou svobodu.' },
    { id: 'q11', text: 'Měla by fakulta víc tlačit na to, aby studenti i vyučující anketu neignorovali?',
      pro: 'Návratnost ankety je nízká (kolem 25 % v zimním a 15 % v letním semestru). Výhody pro vyplňující (např. přednostní zápis) a povinnost vyučujících reagovat na komentáře by z ní udělaly skutečný nástroj změny.',
      proti: 'Výhody za vyplnění mohou přinést rychlé a nekvalitní odpovědi a tlak může u studentů i vyučujících vyvolat odpor k anketě. Povinnost reagovat podle vedení nemá oporu v zákoně – ASF ji zatím jen doporučil.' },
    { id: 'q12', text: 'Měla by fakulta upravit pravidla doktorského studia ve prospěch doktorandů?',
      pro: 'Například nezapočítávat stipendium GAUK do garantovaného minimálního příjmu – kdo grant získá, měl by pak vyšší příjem, což by doktorandy víc motivovalo o GAUK usilovat. Nebo umožnit přijímání během celého roku pro pružnější start studia.',
      proti: 'Započítávání GAUK a pevný termín přijímání pomáhají fakultě uživit víc doktorandů a plánovat místa – změny mohou znamenat, že přijme méně doktorandů.' },
    { id: 'q13', text: 'Měla by fakulta kvůli AI změnit podobu závěrečných prací a zkoušek?',
      pro: 'Víc ústních obhajob a práce pod dohledem ověří, že student práci opravdu zvládá sám, a zachová hodnotu diplomu.',
      proti: 'Psaní delšího textu je samo o sobě důležitá dovednost. Ústní a dozorované formy jsou časově náročné a nevyhovují každému. AI se dá naopak učit používat zodpovědně.' },

    // Ostatní
    { id: 'q14', text: 'Měly by být budovy fakulty trvale uzamčené a přístupné jen s ISICem?',
      pro: 'Potenciálně by to odstranilo riziko vstupu cizích osob, krádeží a vandalismu v budovách.',
      proti: 'Kampus by ztratil otevřenost – hosté, uchazeči i veřejnost by měli ztížený přístup a zapomenutý ISIC by znamenal problém. Systém a případné hlídání by stály peníze.' },
    { id: 'q15', text: 'Měla by fakulta z vlastního rozpočtu financovat úpravy kampusu, které navrhují studentské iniciativy?',
      pro: 'Posezení, oživení vnitrobloků nebo třídění odpadu zlepšují každodenní život na fakultě a ukazují, že fakulta bere nápady studentů vážně. ASF už na úpravy okolí Dřeváku a vnitrobloku uvolnil 150 tisíc Kč.',
      proti: 'Jde o peníze, které by jinak šly na výuku a vědu. Podobné projekty lze financovat z externích zdrojů – univerzita, městská část, sponzoři.' },

    // Zásadní pravomoci senátu (děkan, rozpočet, předpisy)
    { id: 'q16', text: 'Kdyby ses přesunul/a zpět do roku 2024, volil/a bys za děkana doc. Krylova?',
      info: 'Akademický senát zvolil v roce 2024 děkanem doc. Vladimíra Krylova (z původně tří navržených kandidátů jeden odstoupil). Senátoři zvolení v těchto volbách budou na podzim 2028 volit děkana znovu – otázka ukazuje, jak kandidát hodnotí minulou volbu.',
      odkaz: 'https://natur.cuni.cz/fakulta/organizacni-struktura/organy-fakulty/akademicky-senat/volby/archiv-voleb/volby-kandidata-na-dekana-2024/navrhy-na-kandidaty-na-funkci-dekana' },
    { id: 'q17', text: 'Dělá současný děkan a jeho kolegium dobrou práci?',
      info: 'Děkan doc. Vladimír Krylov vede fakultu od volby v roce 2024. Mezi hlavní témata jeho působení patří dostavba Biocentra a její financování, nová Pravidla pro organizaci studia, doktorský příjem a rozpočet fakulty. Senát vedení kontroluje – schvaluje rozpočet a předpisy.' },
    { id: 'q18', text: 'Měl by senát trvat na tom, aby podíl děkanátu na rozpočtu fakulty nerostl?',
      info: 'Děkanát a celofakultní pracoviště mají dnes přes 280 milionů Kč. Rozpočty se ale nedají snadno oddělit – vedení je pod tlakem kvůli financování stavby Biocentra.',
      pro: 'Víc peněz zůstane katedrám a sekcím na výuku a vědu. Ekonomická komise ASF na tom trvá.',
      proti: 'Z celofakultních peněz se platí služby pro studenty i pro vědu – studijní oddělení, IT, podpora projektů a grantů – a nové povinnosti mohou růst rozpočtu děkanátu opravdu vyžadovat. Strop by mohl tyto služby omezit.' },
    { id: 'q19', text: 'Měly by předpisy fakulty stanovovat co nejpodrobnější a předem známá kritéria?',
      pro: 'Podrobná pravidla (např. ve studijních pravidlech nebo u přijímacího řízení) jsou předvídatelná a chrání před nadržováním a libovůlí.',
      proti: 'Neoblomná pravidla nedovolí zohlednit konkrétní situaci – třeba když je potřeba se studenta zastat. Vyučující a komise ztratí prostor pro rozumnou výjimku.' },
    { id: 'q20', text: 'Měl by se změnit současný systém voleb do senátu?',
      pro: 'Dnes se volí v oddělených okrscích s pevným počtem mandátů pro každou sekci. Změn se nabízí víc – celofakultní volba (každý má víc hlasů, s pojistkou minimálního zastoupení sekcí), strop mandátů pro jednu sekci nebo jiné rozdělení okrsků –, aby složení senátu lépe odpovídalo fakultě. Legislativní komise ASF se výpočtem mandátů aktuálně zabývá.',
      proti: 'Současný systém zaručuje každé sekci její zástupce a je jednoduchý a srozumitelný. Změny by mohly oslabit malé sekce, nebo naopak znevýhodnit ty velké.' }
];

// --- PRIORITNÍ OBLASTI (15 oblastí × 3 úrovně × limit 5 → kandidát má přesně 5/5/5) ---
const oblasti = [
    { id: 'o1',  text: 'Spolky',                        popis: 'Podpora a financování studentských spolků a iniciativ, pravidla pro žádosti a vyúčtování.' },
    { id: 'o2',  text: 'Prostory a zázemí',             popis: 'Studovny a odpočinkové prostory, kampus Albertov, drobné zázemí – mikrovlnky, šatny, automaty, otevírací doby.' },
    { id: 'o3',  text: 'Duševní zdraví a bezpečí',      popis: 'Psychologická pomoc, bezpečné a férové prostředí (etický kodex, ombudsman), inkluze, bezbariérovost, studující rodiče, bezpečnost v budovách.' },
    { id: 'o4',  text: 'Komunikace se studenty',        popis: 'Otevřenost SKAS, informování studentů o dění v senátu, sběr podnětů a zpětné vazby.' },
    { id: 'o5',  text: 'Prváci a propagace',            popis: 'Úvodní soustředění, tutoři, Příručka prváka, dny otevřených dveří a popularizace vědy.' },
    { id: 'o6',  text: 'Kvalita výuky',                 popis: 'Studentská anketa, zpětná vazba k výuce a zapojení studentů do tvorby studijních programů.' },
    { id: 'o7',  text: 'Organizace studia',             popis: 'Pravidla pro organizaci studia, SIS, srozumitelné informace o průběhu studia.' },
    { id: 'o8',  text: 'Stipendia a doktorandi',        popis: 'Příjem doktorandů, GAUK, motivační, prospěchová a sociální stipendia.' },
    { id: 'o9',  text: 'Jazyky a internacionalizace',   popis: 'Výuka cizích jazyků, cizojazyčné studijní programy, poplatky za studium v cizím jazyce.' },
    { id: 'o10', text: 'Praxe a kariéra',               popis: 'Stáže, Erasmus a další výjezdy, terénní výuka, propojení s praxí a kariérní poradenství.' },
    { id: 'o11', text: 'Udržitelnost',                  popis: 'Třídění odpadu a ekologie provozu fakulty.' },
    { id: 'o12', text: 'Rozpočet fakulty',              popis: 'Hospodaření fakulty, kontrola rozpočtu a financování Biocentra.' },
    { id: 'o13', text: 'Sport',                         popis: 'Tělesná výchova, sprchy a sportovní zázemí, děkanský sportovní den a další sportovní akce.' },
    { id: 'o14', text: 'Univerzitní politika',          popis: 'Vysokoškolská politika a témata z Akademického senátu UK.' },
    { id: 'o15', text: 'Vnitřní předpisy',              popis: 'Tvorba a změny statutu, studijního, disciplinárního a volebního řádu.' }
];

// Rozbalovací popis oblasti („Co sem patří“)
function popisOblastiHtml(o) {
    return o.popis ? `<details class="kontext"><summary>Co sem patří</summary><p>${o.popis}</p></details>` : '';
}

// --- NÁVOD, JAK VOLIT (podle Volebního a jednacího řádu ASF a stránky voleb) ---
const ODKAZ_HLASOVANI = 'https://hlasovani.is.cuni.cz/';
function jakVolitHtml() {
    const radky = sekce.map(s => `<li><strong>${s.nazev}:</strong> až ${s.voli} ${s.voli >= 5 ? 'kandidátů' : 'kandidáty'}</li>`).join('');
    return `<div class="jak-volit" id="jak-volit">
        <h2>Jak volit</h2>
        <p class="jak-volit-hlavni"><strong>Máš víc než jeden hlas!</strong> Můžeš označit až tolik kandidátů, kolik se ve tvé sekci volí senátorů:</p>
        <ul>${radky}</ul>
        <ol>
            <li><strong>Kdy:</strong> 24.–26. 11. 2026, elektronicky.</li>
            <li><strong>Kde:</strong> <a href="${ODKAZ_HLASOVANI}" target="_blank">hlasovani.is.cuni.cz ↗</a> – přihlásíš se číslem osoby (na ISICu pod fotkou) a heslem do CAS, stejně jako do SIS.</li>
            <li><strong>Koho:</strong> volíš kandidáty ze své sekce (okrsku).</li>
            <li><strong>Kolik:</strong> nejvýše tolik, kolik je mandátů v tvé sekci. Nemusíš využít všechny hlasy – dej je těm, které v senátu opravdu chceš. Víc hlasů, než je povoleno, lístek zneplatní.</li>
            <li><strong>Kdo vyhraje:</strong> zvoleni jsou kandidáti s nejvíce hlasy. Kdo se nedostane, ale získá hlas aspoň od 20 % voličů, stává se náhradníkem.</li>
        </ol>
        <p class="mensi">Volby jsou tajné – ukládá se jen to, že jsi hlasoval/a, ne koho jsi volil/a.</p>
        <a class="volit-tlacitko" href="${ODKAZ_HLASOVANI}" target="_blank">Jít volit ↗</a>
    </div>`;
}

// Rozbalovací kontext k otázce (Zastánci / Odpůrci, nebo věcné info). Používá kalkulačka i profily.
function kontextHtml(o, otevreno = false, onToggle = '') {
    if (!o.pro && !o.proti && !o.info) return '';
    let obsah = '';
    if (o.info) obsah += `<p>${o.info}</p>`;
    if (o.pro) obsah += `<p><strong class="kontext-pro">Zastánci:</strong> ${o.pro}</p>`;
    if (o.proti) obsah += `<p><strong class="kontext-proti">Odpůrci:</strong> ${o.proti}</p>`;
    if (o.odkaz) obsah += `<p><a href="${o.odkaz}" target="_blank">Zdroj ↗</a></p>`;
    return `<details class="kontext" ${otevreno ? 'open' : ''} ${onToggle ? `ontoggle="${onToggle}"` : ''}><summary>Kontext</summary>${obsah}</details>`;
}

// Komentáře z programů kandidátů byly přiřazené ke starším oblastem.
// Tahle tabulka je převede na nové oblasti (starý klíč → nový klíč); u sloučených se texty spojí.
const PREVOD_STARYCH_OBLASTI = { o1: 'o1', o2: 'o2', o3: 'o3', o4: 'o3', o5: 'o4', o6: 'o7', o7: 'o5', o8: 'o6', o9: 'o10', o10: 'o10', o11: 'o11', o12: 'o9', o13: 'o5', o14: 'o10', o15: 'o8' };
function prevedKomentare(stare) {
    const nove = {};
    Object.entries(stare || {}).forEach(([klic, text]) => {
        const k = PREVOD_STARYCH_OBLASTI[klic] || klic;
        nove[k] = nove[k] ? nove[k] + ' ' + text : text;
    });
    return nove;
}

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

// Odpovědi na otázky jako pole v pořadí q1..q20 (1 = Ano, -1 = Ne) – až je kandidát pošle
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
        odpovedi: {}, priority: {}, komentare: prevedKomentare(komentare), neprijemne: {}
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
