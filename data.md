## Backup and Restore Test Database Content
During development it will be helpful to have some content loaded into your local database.

You can use the scripts `scrips/dump_mongo.sh` and `scripts/restore_mongo.sh` to backup and restore content. Restoring content will **overwrite** your local data, **be careful**.

## Initial Setup
To use these scripts you will need mongodb and its utilities on your local machine.

Meteor installs a private version of mongo for its own use, but you need to install it mongo again yourself so you have access to it and utilities like `mongodump`.

A good way to install mongo is to use [Homebrew](http://brew.sh/),a package manager for macOS. Package managers manage installing/update/removing software packages and their dependencies.

With homebrew installed you can run this command to install the latest version of mongo and its utilities.

> `brew install mongodb`

If homebrew succeeds, mongo and related utilities will be installed on your machine. Homebrew will also create some links so that you can easily run these programs from terminal. You can verify that mongo is installed with:

> `which mongo`

The terminal should reply with the location of the mongo app, something like: `/usr/local/bin/mongo`

## Creating a Backup

First make sure your mongo app is running.

In terminal `cd` yourself into the main avalanche directory. The script expects you to run it from this location, if you are in a different directory the script won't work properly. Then run:

> `./scripts/dump_mongo.sh`

The script will remove the local `dump` folder and create a new one containing the info from the database. This folder will be committed to git. This will allow us to keep older versions of content for older versions of code, and will make it easy for us to share test code between us. We'll want to manage this data along with our codebase.

## Restoring a Backup

First make sure your mongo app is running.

In terminal `cd` yourself into the main avalanche directory. The script expects you to run it from this location, if you are in a different directory the script won't work properly. Then run:

> `./scripts/restore_mongo.sh`

This script will drop all the info in your database, and load the information found in the local `dump` folder.