---
title: "Setup neo4j using docker"
description: "importing csv, using apoc plugin."
pubDate: "04/09/2024"
updatedDate: "04/09/2024"
heroImage: ""
---

## TLDR

- Map local directories (`data`, `import`, and `plugins`) to directories in container.
- Instead of editing config file, pass config options using `--env`.

## The simple start

This is the most simple way to get a neo4j server up and running.

```sh
sudo docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    neo4j
```

After running this command, you can go to `http://localhost:7474` and access to the web ui.
The initial login account and password is `neo4j/neo4j`,
and you will be prompted to change the password after your first login.

## Importing csv files

Start a container with this command.

```sh
sudo docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    --volume=$HOME/neo4j/import:/import \
    --env NEO4J_dbms_security_allow__csv__import__from__file__urls=true \
    neo4j
```

And you can copy the csv file(s) to `$HOME/neo4j/import` (this may require sudo).
Then you can import the file in cypher, e.g: you have `$HOME/neo4j/import/a.csv`,
your import url in cypher should be `"file:///a.csv"`.

## Using apoc plugin

Add more options in the docker run command.

```sh
sudo docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    --volume=$HOME/neo4j/import:/import \
    --volume=$HOME/neo4j/plugins:/plugins \
    --env NEO4J_apoc_export_file_enabled=true \
    --env NEO4J_apoc_import_file_enabled=true \
    --env NEO4J_apoc_import_file_use__neo4j__config=true \
    --env NEO4J_PLUGINS=\[\"apoc\"\] \
    neo4j
```
