import { getRelativeLocaleUrl } from 'astro:i18n';

export const languages = { fr: 'FR', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

const fr = {
  'site.tagline': 'conseil régional of electronic music elites',
  'site.description':
    'C.R.E.M.E, collectif de DJs de Paris et Toulouse : bass music, techno, footwork et post-club.',
  'nav.home': 'accueil',
  'nav.members': 'membres',
  'nav.events': 'events',
  'nav.contact': 'contact',
  'about.title': 'à propos',
  'about.text': [
    'La C.R.E.M.E est un collectif de DJs originaires de Paris et Toulouse.',
    'Tout d’abord unis par la culture internet des groupes de memes, ses artistes se sont aujourd’hui rassemblés autour d’une passion commune : les différents styles de bass music, techno, footwork et post-club.',
  ],
  'events.title': 'événements',
  'events.upcoming': 'à venir',
  'events.past': 'événements passés',
  'events.none': 'aucun event prévu pour le moment. restez connectés.',
  'events.seeAll': 'tous les events',
  'events.link': 'voir l’event',
  'events.lineup': 'line-up',
  'members.title': 'membres',
  'members.back': 'retour aux membres',
  'members.links': 'liens',
  'members.listen': 'écouter',
  'members.gigs': 'dates passées',
  'members.gallery': 'galerie',
  'footer.follow': 'suivre',
  'footer.contact': 'contact',
  'notFound.title': 'erreur 404',
  'notFound.text': 'commande introuvable. la page a sûrement été mangée par un meme.',
  'notFound.back': 'retour à l’accueil',
  'lang.switch': 'switch to english',
} as const;

export type UiKey = keyof typeof fr;

const en: Record<UiKey, string | readonly string[]> = {
  'site.tagline': 'conseil régional of electronic music elites',
  'site.description':
    'C.R.E.M.E, a DJ collective from Paris and Toulouse: bass music, techno, footwork and post-club.',
  'nav.home': 'home',
  'nav.members': 'members',
  'nav.events': 'events',
  'nav.contact': 'contact',
  'about.title': 'about',
  'about.text': [
    'C.R.E.M.E is a DJ collective from Paris and Toulouse.',
    'First brought together by the internet culture of meme groups, its artists now share a common passion: bass music, techno, footwork and post-club in all their forms.',
  ],
  'events.title': 'events',
  'events.upcoming': 'upcoming',
  'events.past': 'past events',
  'events.none': 'no event scheduled yet. stay tuned.',
  'events.seeAll': 'all events',
  'events.link': 'see the event',
  'events.lineup': 'line-up',
  'members.title': 'members',
  'members.back': 'back to members',
  'members.links': 'links',
  'members.listen': 'listen',
  'members.gigs': 'past gigs',
  'members.gallery': 'gallery',
  'footer.follow': 'follow',
  'footer.contact': 'contact',
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
