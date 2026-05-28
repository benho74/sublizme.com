#!/bin/bash
# Remplace COLLE_TON_TOKEN_ICI par ton token GitHub (entre les deux guillemets)
TOKEN="COLLE_TON_TOKEN_ICI"

cd "$(dirname "$0")"
git push "https://benho74:${TOKEN}@github.com/benho74/sublizme.com.git" main
