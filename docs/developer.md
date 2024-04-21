The basecode is written in typescript, using the shell integration of the bun runtime.  
`/bin/kliper-deployer` is a ts file as well, just without extension. Keep it as the entrypoint for any CLI utility.

You can find some utility scripts in `/dev/utils` which are also available as scripts in the _package.json_.

`/scripts` contains the logic for all the subcommmands of the CLI.  
The subfolder `/scripts/target` implements architecture and distribution specific strategies to handle the basic operations used in the rest of the logic.

Finally, `/templates` has inside all the scripts which are needed to generate configuration files for the different services.  
The subfolder `/templates/profiles` hosts basic preconfigured profiles to be used as baseline or right out of the box.
