#!/usr/bin/env bash
# Remove the template's `.freedom-worktree.json` from a freshly minted wiki, and COMMIT that removal.
#
# Deleting the file from the working tree was enough until Freedom's gate learned to read the
# marker from HEAD when the file is missing (freedom-dev#425: an uncommitted `rm` must not switch
# a shared checkout's gate off). From then on a new wiki was gated again, and the set-up-a-wiki
# step after this one ("commit once right after scaffolding") was refused in a repo one person had
# ever touched (freedom-dev#546, reported by @brayantenesaca10-boop). Committing the removal with a
# pathspec, which the gate allows, makes the wiki's HEAD carry no marker, so nothing is left to
# fall back to.
set -u
marker=.freedom-worktree.json
rm -f "$marker"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1 && git cat-file -e "HEAD:$marker" 2>/dev/null; then
  if git commit -q -m "Remove the template's worktree marker" -- "$marker"; then
    echo "Removed and committed the template's worktree marker: this repo is yours, not a shared checkout."
  else
    echo "Removed the template's worktree marker. Commit that removal before anything else:"
    echo "  git commit -m \"Remove the template's worktree marker\" -- $marker"
  fi
else
  echo "Removed the template's worktree marker: this repo is yours, not a shared checkout."
fi
