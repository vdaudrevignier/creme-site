// All the meme copy of the site, in one place. Edit freely: lists are picked from at random.
// ⚠ Placeholder jokes for now — to be replaced by the crew's own memes / private jokes.
import type { Lang } from '../i18n/ui';

export type BootStatus = 'OK' | 'WARN' | 'FAIL';

interface MemeCopy {
  /** Home "boot sequence": 2 random lines are shown between the fixed first/last ones. */
  boot: [BootStatus, string][];
  /** Headlines of the scrolling news ticker. */
  ticker: string[];
  /** Tab title shown while the visitor is on another tab. */
  tabAway: string[];
  /** 404 page variants: ASCII art + message. */
  notFound: { art: string; text: string }[];
}

export const memes: Record<Lang, MemeCopy> = {
  fr: {
    boot: [
      ['OK', 'calibrage des vibes'],
      ['WARN', 'trop de basses détectées, on continue quand même'],
      ['FAIL', 'sleep.exe — DJ DORMIR il est fatiger'],
      ['OK', 'téléchargement de 4 Go de footwork'],
      ['OK', 'compression des memes en .jpeg qualité 3%'],
      ['WARN', 'BPM > 160, TOYOTA PEPPER détecté'],
      ['OK', 'connexion au groupe facebook de memes (2014)'],
      ['FAIL', 'impossible de trouver la sortie du club'],
      ['OK', 'dépoussiérage des vinyles'],
    ],
    ticker: [
      'BREAKING : DJ HYPERLAX a encore acheté des vinyles',
      'MÉTÉO : averses de sub-bass sur Paris et Toulouse',
      'TOYOTA PEPPER refuse de descendre sous 160 BPM, les autorités dépassées',
      'DJ DORMIR il est fatiger, plus d’infos à suivre',
      "DJ DORMIR s'est perdu dans le club, contactez la police si vous le voyez",
      'DJ LOGITECH confirme : sa souris est bien sans fil',
      'SONDAGE : 100% des membres préfèrent les memes aux slides PowerPoint',
      'BOURSE : le cours du footwork en hausse de 808%',
    ],
    tabAway: ['reviens stp 🥺', '[process paused]', 'la basse t’attend…', 'alt+tab détecté'],
    notFound: [
      {
        art: '   ¯\\_(ツ)_/¯',
        text: 'commande introuvable. essayez de péter dans votre bite.',
      },
      { art: '  (╯°□°)╯︵ ┻━┻', text: 'cette page a quitté le collectif.' },
      { art: '   ( ͡° ͜ʖ ͡°)', text: 'il n’y a rien ici. ou alors c’est un secret.' },
      {
        art: '   [ 404 ]\n   ▓▓▓░░░░░ 37%',
        text: 'téléchargement de la page… échec. réessayez en 2014.',
      },
    ],
  },
  en: {
    boot: [
      ['OK', 'calibrating vibes'],
      ['WARN', 'too much bass detected, proceeding anyway'],
      ['FAIL', 'sleep.exe — DJ DORMIR is tired'],
      ['OK', 'downloading 4 GB of footwork'],
      ['OK', 'compressing memes to 3% quality .jpeg'],
      ['WARN', 'BPM > 160, TOYOTA PEPPER detected'],
      ['OK', 'connecting to facebook meme group (2014)'],
      ['FAIL', 'unable to locate club exit'],
      ['OK', 'dusting off the records'],
    ],
    ticker: [
      'BREAKING: DJ HYPERLAX bought more records again',
      'WEATHER: sub-bass showers over Paris and Toulouse',
      'TOYOTA PEPPER refuses to go below 160 BPM, authorities overwhelmed',
      'DJ DORMIR is tired, more to follow',
      'DJ LOGITECH confirms: his mouse is indeed wireless',
      'POLL: 100% of members prefer memes over PowerPoint slides',
      'MARKETS: footwork stock up 808%',
    ],
    tabAway: ['come back pls 🥺', '[process paused]', 'the bass is waiting…', 'alt+tab detected'],
    notFound: [
      { art: '   ¯\\_(ツ)_/¯', text: 'command not found. this page was probably eaten by a meme.' },
      { art: '  (╯°□°)╯︵ ┻━┻', text: 'this page has left the collective.' },
      { art: '   ( ͡° ͜ʖ ͡°)', text: 'nothing here. or maybe it’s a secret.' },
      {
        art: '   [ 404 ]\n   ▓▓▓░░░░░ 37%',
        text: 'downloading page… failed. please retry in 2014.',
      },
    ],
  },
};
