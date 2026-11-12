import { getRelativeLocaleUrl } from 'astro:i18n';

export const languages = { fr: 'FR', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

const fr = {
  'site.tagline': 'conseil régional of electronic music enthusiasts',
  'site.description':
    'C.R.E.M.E, collectif de DJs de Paris et Toulouse né des memes : jungle, UK garage, dubstep, footwork, jersey club, house, techno, trance, latin club…',
  'nav.home': 'accueil',
  'nav.members': 'membres',
  'nav.events': 'events',
  'nav.sets': 'sets',
  'nav.contact': 'contact',
  'about.title': 'à propos',
  'about.text': [
    'La C.R.E.M.E est un collectif de DJs originaires de Paris et Toulouse.',
    'Créateurs de memes à l’origine, ses membres se sont rencontrés en ligne, via les pages de memes, les groupes Facebook et la culture internet, avant de se retrouver autour de la musique électronique et du DJing.',
    'Fervents diggers, ils proposent des sélections qui couvrent un large champ des possibles : de la bass music britannique (jungle, UK garage, dubstep, grime, drum & bass) aux styles américains de ghetto music (footwork, juke, jersey club, electro, ghettotech), en passant par les vastes répertoires de la house et de la techno, jusqu’à la trance et le latin club.',
    'Avec C.R.E.M.E, l’objectif est d’organiser des soirées chaleureuses, inclusives et un peu zinzin, où toutes les formes de musique électronique ont leur place sur le dancefloor.',
  ],
  'events.title': 'événements',
  'events.upcoming': 'à venir',
  'events.past': 'événements passés',
  'events.none': 'aucun event prévu pour le moment. restez connectés.',
  'events.seeAll': 'tous les events',
  'events.link': 'voir l’event',
  'events.lineup': 'line-up',
  'sets.title': 'les sets',
  'sets.intro': 'tous les sets de la crew, compilés dans une seule playlist.',
  'sets.play': 'lancer la playlist',
  'sets.openYoutube': 'ouvrir la playlist sur youtube',
  'sets.list': 'tous les sets',
  'sets.prev': 'préc.',
  'sets.next': 'suiv.',
  'sets.page': 'pages des sets',
  'members.title': 'membres',
  'members.back': 'retour aux membres',
  'members.links': 'liens',
  'members.listen': 'écouter',
  'members.gigs': 'dates passées',
  'members.gallery': 'galerie',
  'footer.follow': 'suivre',
  'footer.contact': 'contact',
  'footer.legal': 'mentions légales',
  'legal.title': 'mentions légales',
  'legal.description': 'Mentions légales et données personnelles du site de C.R.E.M.E.',
  'notFound.title': 'erreur 404',
  'notFound.text': 'commande introuvable. la page a sûrement été mangée par un meme.',
  'notFound.back': 'retour à l’accueil',
  'lang.switch': 'switch to english',
} as const;

export type UiKey = keyof typeof fr;

const en: Record<UiKey, string | readonly string[]> = {
  'site.tagline': 'conseil régional of electronic music enthusiasts',
  'site.description':
    'C.R.E.M.E, a DJ collective from Paris and Toulouse born from memes: jungle, UK garage, dubstep, footwork, jersey club, house, techno, trance, latin club…',
  'nav.home': 'home',
  'nav.members': 'members',
  'nav.events': 'events',
  'nav.sets': 'sets',
  'nav.contact': 'contact',
  'about.title': 'about',
  'about.text': [
    'C.R.E.M.E is a DJ collective from Paris and Toulouse.',
    'Meme makers at heart, its members first met online, through meme pages, Facebook groups and internet culture, before coming together around electronic music and DJing.',
    'Dedicated diggers, they play selections that cover a wide field of possibilities: from UK bass music (jungle, UK garage, dubstep, grime, drum & bass) to American ghetto music (footwork, juke, jersey club, electro, ghettotech), through the vast repertoires of house and techno, all the way to trance and latin club.',
    'With C.R.E.M.E, the goal is to throw warm, inclusive and slightly bonkers parties, where every form of electronic music has its place on the dancefloor.',
  ],
  'events.title': 'events',
  'events.upcoming': 'upcoming',
  'events.past': 'past events',
  'events.none': 'no event scheduled yet. stay tuned.',
  'events.seeAll': 'all events',
  'events.link': 'see the event',
  'events.lineup': 'line-up',
  'sets.title': 'the sets',
  'sets.intro': 'every set from the crew, compiled in one playlist.',
  'sets.play': 'play the playlist',
  'sets.openYoutube': 'open the playlist on youtube',
  'sets.list': 'all the sets',
  'sets.prev': 'prev',
  'sets.next': 'next',
  'sets.page': 'sets pages',
  'members.title': 'members',
  'members.back': 'back to members',
  'members.links': 'links',
  'members.listen': 'listen',
  'members.gigs': 'past gigs',
  'members.gallery': 'gallery',
  'footer.follow': 'follow',
  'footer.contact': 'contact',
  'footer.legal': 'legal notice',
  'legal.title': 'legal notice',
  'legal.description': 'Legal notice and privacy information for the C.R.E.M.E website.',
  'notFound.title': 'error 404',
  'notFound.text': 'command not found. this page was probably eaten by a meme.',
  'notFound.back': 'back to home',
  'lang.switch': 'passer en français',
};

const ui: Record<Lang, Record<UiKey, string | readonly string[]>> = { fr, en };

export function useTranslations(lang: Lang) {
  return function t<K extends UiKey>(key: K): (typeof fr)[K] {
    return (ui[lang][key] ?? ui[defaultLang][key]) as (typeof fr)[K];
  };
}

/** URL of `path` (e.g. "/members") in the given language. */
export const localePath = (lang: Lang, path = '/') =>
  getRelativeLocaleUrl(lang, path.replace(/^\//, ''));

/** Picks the text in `lang`, falling back to any available language. */
export const pick = (text: { fr?: string; en?: string } | undefined, lang: Lang) =>
  text?.[lang] ?? text?.fr ?? text?.en;

export const formatDate = (date: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'UTC',
  }).format(date);
