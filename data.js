const limitPriorit = 2;

const otazky = [
    { id: 'q1', text: 'Měly by se přednášky povinně nahrávat?' },
    { id: 'q2', text: 'Jste pro zavedení elektronického indexu?' }
];

const oblasti = [
    { id: 'o1', text: 'Reforma doktorského studia' },
    { id: 'o2', text: 'Dotování menzy a bufetů' },
    { id: 'o3', text: 'Zahraniční výjezdy' },
    { id: 'o4', text: 'Podpora studentských spolků' }
];

const kandidati = [
    { 
        id: 'novak', jmeno: 'Jan Novák', 
        odpovedi: { q1: 1, q2: -1 }, 
        priority: { o1: 3, o2: 3, o3: 2, o4: 1 },
        info: { sekce: 'Biologie', obor: 'Botanika', rocnik: '2. Mgr.', kontakt: 'novak@natur.cuni.cz', odkaz: 'https://jannovak.cz' },
        komentare: { q1: 'Přednášky by měly být online.' },
        neprijemneOtazky: [ { q: 'Senát vyžaduje čas. Čeho se vzdáte?', a: 'Omezím směny v práci.' } ]
    }
];