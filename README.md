# Enclume & Errance

Jeu de navigateur : tu es un forgeron humain qui forge ses propres armes et armures, puis part en expédition affronter des humains et des monstres. Après chaque étape, tu choisis de continuer (plus de risque, meilleur butin) ou de rentrer. Si tu tombes, tu perds le butin de l'expédition et une partie de ton équipement.

Version jouable publiée : https://claude.ai/artifact/FPFvKMRytmkJZCXEW8nueq

## Lancer le jeu

Tout tient dans un seul fichier, `index.html`, sans compilation. Ouvre-le dans un navigateur. Ressources externes : la police Google Fonts (Lilita One, Nunito) et Three.js r128 depuis cdnjs pour le monde en 3D. Sans réseau, le jeu bascule sur le rendu 2D du village et des îles, avec les polices de secours.

La progression est sauvegardée dans le `localStorage` du navigateur (clé `enclume-errance-v1`).

## Tests

Les tests pilotent le jeu avec Playwright (Chromium). Ils servent Three.js depuis `node_modules` (faire `npm install` une fois) à la place du CDN et enregistrent des captures dans `tests/captures/` (ignoré par git).

```bash
mkdir -p tests/captures
node tests/partie-complete.js   # forge une épée, part en expédition, combat, coffres, retour
node tests/scene-coffre.js      # scène d'ouverture de coffre (peu commun et mythique)
node tests/planche-coffres.js   # les 6 coffres 2,5D fermés et ouverts
node tests/competences.js       # onglet Compétences et aperçu de forge
node tests/embranchements.js    # chaque voie d'un embranchement (grotte, pont, campement…)
node tests/monde.js             # village (déplacement, bâtiments) et île (rencontre, combat, coffre)
node tests/generation-iles.js   # 120 îles : filons dans la roche, coffres placés, arène accessible et lointaine
```

Chaque script affiche à la fin la liste des erreurs JavaScript rencontrées (`[]` ou `ERR []` si tout va bien).

## Publier comme Artifact claude.ai

Un Artifact attend la page sans `<!doctype>`, `<html>`, `<head>` ni `<body>` :

```bash
./outils/vers-artefact.sh   # produit build/artefact.html
```

## Direction artistique

Style cartoon à plat : fond lavande uni, couleurs unies, une seule bande d'ombre nette (bas-droite) et un liseré clair (haut-gauche) par forme, facette claire sur la moitié gauche des lames, contours épais teintés dans la couleur de l'objet, trame de points discrète. Le héros est un forgeron trapu (grosse tête carrée, mains rondes) qui commence sans armure. Ce qu'il équipe apparaît sur lui, dans la couleur du minerai et avec une forme qui évolue selon le palier : casque à nasal puis heaume à chevrons, cotte de mailles puis plastron, bouclier rond puis écu puis bouclier orné. Primitives : `SH`, `FACET`, `GRIP`, `heroHelm`, `knightShield`, `mailBody`, `drawHero`.

## Systèmes de jeu

| Système | Résumé |
|---|---|
| Rendu 3D | Village et îles en 3D (Three.js) : matériaux « toon » à 3 tons, contours épais en coque inversée, ombres portées, personnages chibi en volumes simples dont l'équipement (arme, bouclier, casque, armure) change selon le palier, ennemis modélisés par type (humanoïdes, bêtes, araignées, vases, dragons, mimiques). Combats mis en scène sur place : charge, entaille, éclats, ondes de choc, chiffres de dégâts, arène dégagée. Repli 2D si Three.js n'est pas disponible. |
| Combat en temps réel | Sur les îles, plus de duel au tour par tour : **Espace** frappe, **X** assène un coup lourd (brise la garde), **F** pare (parade juste avant un coup puissant = riposte), **R** boit une potion ; quatre boutons ronds sur la vue pour le tactile. Les ennemis annoncent leur coup (élan, cercle rouge au sol) puis frappent : on esquive en sortant du cercle. Barres de vie au-dessus des têtes. Formules de dégâts inchangées (`rtHeroHit`, `rtHeroHurt`). |
| Endurance | Jauge sous les PV, sur les îles. **Maj** maintenu : sprint (×1,55), qui la vide. **C** : roulade d'esquive, coûte un quart de jauge et rend invulnérable le temps du roulé. Elle remonte après un court répit ; à zéro on est essoufflé jusqu'à un quart. La compétence Endurance agrandit la jauge. Réglages dans `STA`. Au village, le sprint est libre. |
| Coffres dans le monde | **E** devant un coffre : le couvercle s'ouvre sur place, le butin jaillit pièce par pièce puis vole vers le héros (`chest3`, `chestFx`). Une Mimique devient un ennemi en temps réel. Filons minés et lieux visités sans changer d'écran ; ce qu'ils libèrent (adversaire, coffre, filon) apparaît sur l'île. |
| Forge dans le village | Entrer dans la Forge ne change plus de page : la commande se choisit dans un panneau posé sur la vue 3D, puis le forgeron va de poste en poste dans la cour (foyer, établi de coulée, enclume, bac de trempe, meule). Les cinq gestes gardent leurs règles (`MG`, `mgUpdate`), avec jauges dessinées sur la vue (`forgeHud`) et mise en scène 3D (`forgeFx`). Sans Three.js, l'ancienne page 2D reste en repli. |
| Îles | 140 × 100 cases. Le sol est une seule nappe lissée (`terrain3`) : rivage arrondi avec plage, couleurs fondues par plaques, mares et lave en creux ; plus de damier. Ennemis seuls ou en groupes nommés (`PACK` : meute, équipe, nid…) qui s'alertent entre eux. Hameaux abandonnés (`hut3`), éperons rocheux espacés (`crag3`) et une vraie grotte (`cave3`) dans la plus grande zone de roche. |
| Village (lobby) | Monde explorable (ZQSD/WASD/flèches ou toucher le sol, E pour interagir). Bâtiments : Forge, Marché, Atelier des étoiles (sac et étoiles), Maître d'armes (compétences), Tableau d'honneur (classement), Navire d'expédition. Les autres joueurs qui ont la page ouverte y apparaissent en direct avec leur équipement, leur nom et leur Puissance (capacité `room`). |
| Caméra | Caméra de poursuite en plongée de trois-quarts qui regarde dans la direction de la marche, recule quand un ennemi te poursuit ; glisser sur la vue (ou boutons ↺ ↻) pour tourner, molette pour zoomer ; les touches suivent l'orientation de la caméra. |
| Ambiance | Étalonnage des couleurs selon le moment : exploration, combat (plus contrasté), gardien (bandes noires, vignette), coup puissant annoncé (pulsation rouge), PV bas (désaturé, rouge), victoire (lueur dorée), coffre. Météo changeante par île : ciel clair, pluie, orage (éclairs ; peut rendre un coffre plus précieux), brouillard (les ennemis repèrent de moins loin), neige, tempête de sable, cendres, nuit de lucioles et pluie d'étoiles (plus de fragments). |
| Gardiens | Entrée en scène : caméra qui tourne autour du gardien, rugissement (onde de choc, secousse), carton de titre et bandes noires. |
| Butin | Coffres rares visibles de loin (colonne de lumière à la couleur de la rareté). Équipement prêt à porter dans les coffres. Contenu révélé du moins rare au plus rare ; avant chaque objet, la lueur monte de rareté en rareté ; tampons ÉPIQUE / LÉGENDAIRE / MYTHIQUE ; mention NOUVEAU ! pour les schémas supérieurs, pièces, moules et objets inédits ; « Meilleur butin » mis en avant. |
| Placement sur les îles | Filons uniquement dans les zones rocheuses (plaques de roche et rochers), grotte creusée dans la plus grande avec un filon. Coffres jamais au hasard : près des ruines, campements et sanctuaires, au fond des culs-de-sac (rareté +1), au bord des falaises ; trois sur quatre sont gardés. Ennemis en petites patrouilles. Arène du gardien à l'opposé du navire : sol de pierre, cercle de runes, piliers à torches, une seule entrée tournée vers le navire. |
| Îles | Chaque expédition est une île fermée générée (désert, forêt, cryptes, marais, volcan, Abysse) : ennemis qui rôdent et poursuivent, coffres, filons, autels, aventuriers tombés, grottes, campements, ruines, tanières, sanctuaires. Le danger (niveau des ennemis et du butin) monte en s'éloignant du navire ; le gardien est au bout de l'île ; on rentre en revenant au navire. Dans l'Abysse, un portail mène à la couche suivante. Mini-carte, ténèbres sans Lumière. |
| Forge | Schéma (réutilisable, rang infini) + minerai (8 paliers) + moule et pièces optionnels. Cinq gestes notés, en gros plan : fonte (taper le soufflet, le minerai fond dans le creuset, attention à la surchauffe), coulée (remplir chaque cavité du moule — lame, garde, poignée… — jusqu'à sa ligne), martelage (frapper les cibles posées sur la pièce chaude avant qu'elle refroidisse ; la pièce s'aplatit coup après coup), trempe (couleur visée), affûtage ou polissage (la pièce glisse sur la meule, aiguiser chaque section au trait sans la brûler). Puis assemblage animé. La qualité 0–100 fixe les stats. |
| Objets | Arme (épée, dague, hache, masse, lance, marteau), casque, cuirasse, bouclier. Rareté de Commun à Mythique, usure, réparation, démontage. |
| Expéditions | 6 régions sur la carte du monde, la dernière sans fin. Sentier d'étapes (combat, coffre, filon, autel, aventurier tombé), gardien toutes les 5 profondeurs. |
| Embranchements | Rares : 40 % de chance à la profondeur 3 de chaque tranche de 5. Le chemin se divise en 2 voies (parfois 3) : rester sur la route (sûr) et une ou deux voies tirées parmi grotte (créature + filon riche), pont de corde, campement abandonné, ruines, tanière du champion (élite), raccourci (saute une profondeur), sanctuaire. Chaque voie affiche son niveau de risque. |
| Combat | Tour par tour : frapper, coup lourd, parer, potion. L'ennemi annonce son intention. |
| Coffres | Scène plein écran, coffres 2,5D par rareté, objets révélés un par un. 8 % de mimiques. |
| Compétences | Forge, Escrime, Endurance, Survie. Chacune monte avec son activité et débloque des paliers. |
| Puissance et étoiles | Inspiré de Trove. Puissance = résumé de toute la force (stats, Lumière, étoiles, maîtrise), avec des titres de forgeron. Chaque objet monte jusqu'à 5 ★ (+12 % de stats, +20 % de Lumière par étoile) avec des fragments d'étoile ✦ et de l'or. Stats bonus aléatoires selon la rareté (ATQ %, PV, critique, dégâts critiques, Lumière, double frappe, vol de vie, DÉF). Lumière exigée dans les régions profondes (sinon ténèbres : ennemis renforcés, coups affaiblis). Maîtrise : collection des objets (type × minerai × rareté), +1 % ATQ/PV par niveau. |
| Reliques | 14 objets ultra-rares (rareté « Relique ») tirés des légendes et de clins d'œil aux films et séries : Excalibur, Durandal, Mjöllnir, Gungnir, l'Égide, le Casque d'Hadès, Lame du Héros en vert, Bouclier étoilé du Capitaine, Sabre stellaire… Chacune tombe d'un gardien, des coffres rares et élites d'une région, des champions des tanières ou des coffres profonds de l'Abysse (1 à 5 %). Chance qui grimpe à chaque échec, doublon changé en fragments, relique liée à l'âme (jamais perdue). Collection et classement dédiés. |
| Classement | Classement partagé entre les joueurs de l'artefact publié (capacités `db` et `user`) : puissance, étoiles, profondeur dans l'Abysse, maîtrise. Chaque joueur écrit sa ligne `classement/<id>` ; il faut l'accès Contributeur pour y apparaître. Hors claude.ai, l'onglet indique que le classement n'est pas disponible. |
| Marché | Potions, réparation, fonderie (3 minerais → 1 du palier supérieur), achat et vente de minerais. |

## Organisation du code (`index.html`)

Le script est découpé en sections commentées, dans cet ordre :

1. **Utilitaires et données** : `RAR`, `ORES`, `TYPES`, `PARTS`, `ZONES`, `ENEM`.
2. **État et sauvegarde** : `S` (état du joueur), `fresh()`, `save()`, migration des anciennes sauvegardes.
3. **Stats et compétences** : `stats()`, `SK` (définition des compétences et paliers), `skXp()`, `showLvl()`.
4. **Objets et butin** : `makeItem()`, `rollRarity()`, `lootEntry()`, `chestLoot()`, `bankLoot()`.
5. **Dessin** : primitives à contour et ombrage (`SH`, `E`, `RR`, `PL`, `TUBE`, `TXT`), personnages (`drawHum`, `drawQuad`, `drawSpider`, `drawSlime`, `drawDragon`), coffres 2,5D (`drawChest3D`), icônes (`itemIcon`, `oreIcon`…), cartes de personnage (`drawCard`).
6. **Vues** : `vForge`, `vEquip`, `vExp`, `vSkills`, `vMarket`, et `render()`.
7. **Mini-jeu de forge** : `startForge`, `mgDown`/`mgUp`, `mgUpdate`, `pieceInfo` (cavités du moule), gros plans `drawPour`, `drawHammer`, `drawGrind`, `drawAssembly`, `drawForgeScene`.
8. **Monde** : `HUBM`/`drawHub` (village), `genIsland`/`drawIsle` (îles), `moveActor`, `findPath`, présence `ROOM`. **Expédition** : décors (`paintBiome`), scène (`drawScene`), sentier (`drawTrail`), carte (`drawWorldMap`), logique (`step`, `resolveEvent`, embranchements `FORKS`/`genFork`/`chooseFork`, `cact`, `enemyAct`, `victory`, `goHome`, `defeat`).
9. **Scène de coffre** : `startChestScene`, `chestUpdate`, `drawChestScene`.
10. **Boucle d'animation** `loop()` et **actions** `ACT` (délégation des clics via `data-a`).

## Pistes pour la suite

- Décors de forge (four, enclume, tonneau) en 2,5D comme les coffres.
- Animations de mort et de victoire des personnages.
- Nouveaux emplacements d'équipement (bottes, anneaux, amulettes).
- Compétences actives en combat.
- Découper `index.html` en modules si le fichier devient trop gros.
