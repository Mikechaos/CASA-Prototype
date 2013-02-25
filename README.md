# CASA

## Créer un nouveau fichier de migration
Dans le dossier db/migrates créer un fichier de migration.
Mettre le timestamp du moment de la création et la description de la migration.
Pour appliquer les migrations sur une nouvelle base de données, il faut appliquer ce code.

	sequel -m ./db/migrates sqlite://db/data.d

On doit se trouver à la racine du projet. La deuxième partie est la base de données.