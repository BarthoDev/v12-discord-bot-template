const low           = require('lowdb'),
      FileSync      = require('lowdb/adapters/FileSync')

module.exports = {



    loadJSON () {

        fs.readdirSync(`./src/db`).filter(val => val.endsWith(".json")).forEach(file => {
            let adapter = new FileSync(`./src/db/${file}`)
            db[file.replace(".json", "")] = low(adapter)
        })
    },



    loadLogs () {

        client.logger = fs.createWriteStream('./logs.txt', {
            flags: 'a'
        })
    },



    loadEvents () {

        fs.readdirSync(`./src/events`).filter(file => file.endsWith('.js')).forEach(file => {
            const eventName = file.split(".")[0]
            const eventClass = new (require(`../events/${file}`))()
            bot.on(eventName, (...args) => eventClass.run(...args))
            delete require.cache[require.resolve(`../events/${file}`)]
        })
    },



    loadCommands () {

        let categories = fs.readdirSync(`./src/commands`).filter(file => !file.includes("."))
        for (let i in categories) {
            fs.readdirSync(`./src/commands/${categories[i]}`).filter(file => !file.startsWith("_")).forEach(file => {

                if (file.endsWith('.js')) {

                    const command = new (require(`../commands/${categories[i]}/${file}`))()
                    bot.commands.set(command.info.name, command)
                    delete require.cache[require.resolve(`../commands/${categories[i]}/${file}`)]
                }
                else if (!file.includes(".")) {
                    this.getSubCommands(file, categories[i])
                }

            })
        }
    },



    getSubCommands (path, category) {

        fs
            .readdirSync(`./src/commands/${category}/${path}`)
            .filter(file => !file.startsWith("_"))
            .forEach(file => {

                if (file.endsWith(".js")) {

                    let command = new (require(`../commands/${category}/${path}/${file}`))()
                    command.info.name = path + "/" + command.info.name
                    bot.commands.set(command.info.name, command)
                    delete require.cache[require.resolve(`../commands/${category}/${path}/${file}`)]
                } 
                else if (!file.includes(".")) {
                    this.getSubCommands(`${path}/${file}`, category)
                }
            })
    }

}