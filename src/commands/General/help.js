const commandParams = {
    
    name: "help",
    aliases: ["h"],
    desc: {
        en: "Displays the help of the bot.",
        fr: "Affiche l'aide du bot."
    },
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: 4000

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd) {

        let prefix = db.guild.get(`guilds.${msg.guild.id}.prefix`).value()

        let embed = new MessageEmbed()
            .setTitle(lang["help"]["title"][la])
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/a/a4/Cute-Ball-Help-icon.png")
        
        let categories = fs.readdirSync(`./src/commands`).filter(file => !file.startsWith("_"))
        categories.forEach(category => {
            let content = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith(".js") && !file.startsWith("_")).map(
                commandName => {
                    let command = bot.commands.get(commandName.split(".")[0])
                    return command.verification.enabled == true && command.permission.owner == false ? `\`${prefix}${commandName.split(".")[0]}\`${command.info.aliases.filter(val => !val.startsWith("_")).length > 0 ? ` (ou ${command.info.aliases.filter(val => !val.startsWith("_")).map(val => `\`${prefix}${val}\``).join(" | ")})`:""} | ${this.checkCommand(command)} ${command["info"]["desc"][la]}\n` : ""
                } 
            ).join("");
            if (content.length > 0) embed.addField(category, content)
            
        })

        msg.channel.send(embed)

    }

    checkCommand (command) {
        
        let text = ""
        if (command.verification.nsfw == true) text+="[**NSFW**] "
        if (command.permission.memberPermission.includes("ADMINISTRATOR")) text+="[**ADMIN**] "
        if (command.info.cooldown !== null) text+=`[**${command.info.cooldown}** sec] `
        return text
    }

}