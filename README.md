# Enclume & Errance

Jeu de navigateur : tu es un forgeron humain qui forge ses propres armes et armures, puis part en expédition affronter des humains et des monstres. Après chaque étape, tu choisis de continuer (plus de risque, meilleur butin) ou de rentrer. Si tu tombes, tu perds le butin de l'expédition et une partie de ton équipement.

Version jouable publiée : https://claude.ai/artifact/FPFvKMRytmkJZCXEW8nueq

## Lancer le jeu

Tout tient dans un seul fichier, `index.html`, sans dépendance ni compilation. Ouvre-le dans un navigateur. La seule ressource externe est la police Google Fonts (Lilita One, Nunito) ; sans réseau, le jeu marche avec les polices de secours.

La progression est sauvegardée dans le `localStorage` du navigateur (clé `enclume-errance-v1`).

## Tests

Les tests pilotent le jeu avec Playwright (Chromium) et enregistrent des captures dans `tests/captures/` (ignoré par git).

```bash
mkdir -p tests/captures
node tests/partie-complete.js   # forge une épée, part en expédition, combat, coffres, retour
node tests/scene-coffre.js      # scène d'ouverture de coffre (peu commun et mythique)
node tests/planche-coffres.js   # les 6 coffres 2,5D fermés et ouverts
node tests/competences.js       # onglet Compétences et aperçu de forge
node tests/embranchements.js    # chaque voie d'un embranchement (grotte, pont, campement…)
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
8. **Expédition** : décors (`paintBiome`), scène (`drawScene`), sentier (`drawTrail`), carte (`drawWorldMap`), logique (`step`, `resolveEvent`, embranchements `FORKS`/`genFork`/`chooseFork`, `cact`, `enemyAct`, `victory`, `goHome`, `defeat`).
9. **Scène de coffre** : `startChestScene`, `chestUpdate`, `drawChestScene`.
10. **Boucle d'animation** `loop()` et **actions** `ACT` (délégation des clics via `data-a`).

## Pistes pour la suite

- Décors de forge (four, enclume, tonneau) en 2,5D comme les coffres.
- Animations de mort et de victoire des personnages.
- Nouveaux emplacements d'équipement (bottes, anneaux, amulettes).
- Compétences actives en combat.
- Découper `index.html` en modules si le fichier devient trop gros.
