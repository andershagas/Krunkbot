module.exports = (bot,msg,cmd,deny) => {
    //return new Promise((resolve,reject) => {
        let pass = false; // Default
        if (cmd.config.enable) { // If command is enabled
            pass = true; // Pass is now true, since command is enabled.
            // These go in priority.
            if(cmd.config.guildOnly) {
                pass = false; // Change to false, if guildonly is true.
                cmd.config.guildOnly.forEach(val => {
                    if(msg.guild.id == val) {
                        pass = true 
                    }
                });
            }
            
            if(cmd.config.userPermission) { // If user permission is enabled
                pass = false;
                cmd.config.userPermission.forEach(val => {
                    if(msg.member.hasPermission(val,false,true,true)) {
                        pass = true; // If user has the permission.
                    } else {
                        pass = "noperm"; // If the user does not have the permission.
                    }
                });
            }
            if (cmd.config.userOverride) {
                var found = false;
                cmd.config.userOverride.forEach(val => {
                    if(msg.author.id == val) {
                        pass = true; // User override gives access to certain users, regardless.
                        found = true;
                    }
                });
                if(found == false) pass = false;
            }
            if (cmd.config.ignoreCmdonly == false) {
                if(deny == true) {
                    pass = false; // Pass = false IF ignoreCmdOnly is enabled of server and command has bypass disabled.
                }
            }
        }
        return pass;
   // });
}