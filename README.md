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
```

Chaque script affiche à la fin la liste des erreurs JavaScript rencontrées (`[]` ou `ERR []` si tout va bien).

## Publier comme Artifact claude.ai

Un Artifact attend la page sans `<!doctype>`, `<html>`, `<head>` ni `<body>` :

```bash
./outils/vers-artefact.sh   # produit build/artefact.html
```

## Systèmes de jeu

| Système | Résumé |
|---|---|
| Forge | Schéma (réutilisable, rang infini) + minerai (8 paliers) + moule et pièces optionnels. Quatre gestes notés : fonte (soufflet), coulée (remplir le moule jusqu'à la ligne), martelage (cercles qui rétrécissent), trempe (couleur visée). La qualité 0–100 fixe les stats. |
| Objets | Arme (épée, dague, hache, masse, lance, marteau), casque, cuirasse, bouclier. Rareté de Commun à Mythique, usure, réparation, démontage. |
| Expéditions | 6 régions sur la carte du monde, la dernière sans fin. Sentier d'étapes (combat, coffre, filon, autel, piège, aventurier tombé), gardien toutes les 5 profondeurs. |
| Combat | Tour par tour : frapper, coup lourd, parer, potion. L'ennemi annonce son intention. |
| Coffres | Scène plein écran, coffres 2,5D par rareté, objets révélés un par un. 8 % de mimiques. |
| Compétences | Forge, Escrime, Endurance, Survie. Chacune monte avec son activité et débloque des paliers. |
| Marché | Potions, réparation, fonderie (3 minerais → 1 du palier supérieur), achat et vente de minerais. |

## Organisation du code (`index.html`)

Le script est découpé en sections commentées, dans cet ordre :

1. **Utilitaires et données** : `RAR`, `ORES`, `TYPES`, `PARTS`, `ZONES`, `ENEM`.
2. **État et sauvegarde** : `S` (état du joueur), `fresh()`, `save()`, migration des anciennes sauvegardes.
3. **Stats et compétences** : `stats()`, `SK` (définition des compétences et paliers), `skXp()`, `showLvl()`.
4. **Objets et butin** : `makeItem()`, `rollRarity()`, `lootEntry()`, `chestLoot()`, `bankLoot()`.
5. **Dessin** : primitives à contour et ombrage (`SH`, `E`, `RR`, `PL`, `TUBE`, `TXT`), personnages (`drawHum`, `drawQuad`, `drawSpider`, `drawSlime`, `drawDragon`), coffres 2,5D (`drawChest3D`), icônes (`itemIcon`, `oreIcon`…), cartes de personnage (`drawCard`).
6. **Vues** : `vForge`, `vEquip`, `vExp`, `vSkills`, `vMarket`, et `render()`.
7. **Mini-jeu de forge** : `startForge`, `mgDown`/`mgUp`, `mgUpdate`, `drawForgeScene`.
8. **Expédition** : décors (`paintBiome`), scène (`drawScene`), sentier (`drawTrail`), carte (`drawWorldMap`), logique (`step`, `cact`, `enemyAct`, `victory`, `goHome`, `defeat`).
9. **Scène de coffre** : `startChestScene`, `chestUpdate`, `drawChestScene`.
10. **Boucle d'animation** `loop()` et **actions** `ACT` (délégation des clics via `data-a`).

## Pistes pour la suite

- Décors de forge (four, enclume, tonneau) en 2,5D comme les coffres.
- Animations de mort et de victoire des personnages.
- Nouveaux emplacements d'équipement (bottes, anneaux, amulettes).
- Compétences actives en combat.
- Découper `index.html` en modules si le fichier devient trop gros.
