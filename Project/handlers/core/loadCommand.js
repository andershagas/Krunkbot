// The thing this file does is check for folder and .js files. Check that the file is not empty. The takes the commands into a table and the aliases in to annother table.

const fs = require("fs");

module.exports = bot => {
  bot.commands.clear();
  bot.aliases.clear();
  fs.readdir("./commands/", (err,folder) => {
    if(err) console.error(err);
    folder.forEach(folderName => {
      if (folderName.search(".js") == -1)  {
        fs.readdir("./commands/" + folderName,(err,files) => {
          let jsfile = files.filter(f => f.split(".").pop() === "js");
          if(jsfile.length > 0){
            jsfile.forEach((f,i) => {
              let props = require(`../../commands/${folderName}/${f}`);
              props.config.category = folderName;
              bot.commands.set(props.config.command, props);
              props.config.aliases.forEach(alias => {
                  bot.aliases.set(alias, props.config.command);
              });
              console.log(`Loaded: commands/${folderName}/${f}`);
            });
          }
        });
      }
    });
  });
}