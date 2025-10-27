#! /bin/bash

if [[ ! -d $HOME/backups ]]; then
    mkdir $HOME/backups
fi

cp *.tar $HOME/backups

