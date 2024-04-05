Referencing [diagram](./usage.drawio).  
A minimal list of operations to be supported by the CLI.

## init

Generate a new uncommitted config file in the local folder, or fill in the uncommitted one with defaults from the schema.

## add instance

CLI operation to change the current uncommitted to add an instance.

## commit

Save the current config as the source to be used for any new operation. From now on it is assumed to be locked.

## clone

Clone repos and compressed archives for the requested components.

## pull

Update repos to the latest commit on branch if possible.

## install

Install all dependencies for the services requested, and build venv environments if needed. Global services will be created here (but not started)

## uninstall

Remove all venv environments and repos stored locally.  
System dependencies which have been installed will not be marked for deletion since this might break other components.

## apply

Create instances for all the entries in the config file.  
Entries which were already created before will only have their service file updated, but the rest of their configuration is not going to be touched.

## start

Start global and instance services

## stop

Stop global and instance services

## amend

Keep the folders for those services already constructed. Backup the prior configuration. Ready to amend the config file again.
