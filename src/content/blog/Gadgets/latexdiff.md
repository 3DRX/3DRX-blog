---
title: "Comparing manuscript versions with latexdiff"
description: "how to generate a pdf with diff info of a article consists of multiple tex files"
pubDate: "09/18/2024"
updatedDate: "09/19/2024"
---

## Prerequisites

1. A lextex distro, you need to have pdflatex (or another latex engine), bibtex in your PATH.
2. [latexdiff](https://github.com/ftilmann/latexdiff).

## The Script

```Makefile
MAIN_TEX = main.tex
NEW_DIR = scripts
OLD_DIR = scripts-old

.PHONY: clean sty figures bib

diff.pdf: diff.tex
	pdflatex --interaction=nonstopmode diff.tex ; \
	bibtex diff ; \
	pdflatex --interaction=nonstopmode diff.tex ; \
	pdflatex --interaction=nonstopmode diff.tex ; \

diff.tex: sty figures bib
	latexdiff --flatten $(OLD_DIR)/$(MAIN_TEX) $(NEW_DIR)/$(MAIN_TEX) > diff.tex

sty:
	cp $(NEW_DIR)/*.sty .

figures:
	cp -r $(NEW_DIR)/figures .

bib:
	cp $(NEW_DIR)/*.bib .

clean:
	rm -rf diff* *.log *.aux *.out *.sty *.bib figures
```
