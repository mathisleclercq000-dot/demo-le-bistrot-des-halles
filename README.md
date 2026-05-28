# Le Bistrot des Halles — site web

Site statique HTML/CSS/JS — généré par le skill `resto-site-builder` (V2). Tier Signature, mood Bistro.

## Statut de ce test

Cette version (V2) implémente les **2 brisures anti-générique** demandées par l'étape 3 bis du skill :

- **Détail signature** : Marquee défilant des producteurs nommés (Dierendonck, criée d'Ostende, Antre des Fromagers, vins nature de Thomas…) directement sous le hero. Tiré du brief de Charlotte & Thomas.
- **Asymétrie structurelle** : Section "En chiffres" (2017 / 6 sem. / 12 / 3) avec stats décalées verticalement en grille brisée, + cadre rouge décalé sur la photo de l'about (effet "polaroïd encadré").

## Ce qui est livré

- `index.html` — version française
- `styles.css` — mood Bistro (palette crème/tomate, fonts Playfair Display + Lora + Yeseva One)
- `script.js` — nav scroll, burger mobile, filtres galerie, smooth scroll
- `client-data.json` — brief client (à ne PAS commit publiquement)
- `assets/logo.svg`, `assets/favicon.svg` — assets vectoriels
- `assets/photos/` — vide, voir liste des photos attendues ci-dessous

## Ce qui n'est PAS encore livré (test focalisé)

- `en.html` et `nl.html` — non générés dans ce test (focus sur l'amélioration anti-générique vs V1)
- Photos clientes — voir liste ci-dessous

## Photos attendues (à déposer dans `assets/photos/`)

| Nom | Description | Format conseillé |
|---|---|---|
| `hero.jpg` | Photo principale (salle ambiance soir) | 1920×1080 |
| `plat-1.jpg` | Tartare de bœuf | 800×600 |
| `plat-2.jpg` | Joue de bœuf braisée | 800×600 |
| `plat-3.jpg` | Cabillaud rôti | 800×600 |
| `plat-4.jpg` | Tarte tatin | 800×600 |
| `interieur-1.jpg` à `interieur-4.jpg` | Vues de la salle | 800×600 |
| `equipe-1.jpg`, `equipe-2.jpg`, `equipe-3.jpg` | Charlotte, Thomas, ensemble | 800×600 |
| `evenement-1.jpg` | Soirée vin nature nov. 2025 | 800×600 |

En attendant les vraies photos, un placeholder CSS hachuré beige s'affiche automatiquement (système `<picture class="img-with-fallback">`).

## Déploiement Hostinger (rappel)

1. `git init && git add . && git commit -m "init"`
2. Push sur GitHub privé
3. Connecter Hostinger au repo, auto-deploy à chaque push

## Vérifications post-déploiement

- Schema.org Restaurant validé via [Rich Results Test](https://search.google.com/test/rich-results)
- Vitesse via Lighthouse (cible > 95)
- Fiche Google Business mise à jour avec la nouvelle URL
