const Discord = require('discord.js')

const edit = require('discordbot-script/package/bot/edit')
const addreactions_ = require("discordbot-script/package/bot/addreactions")
const interpret = require('discordbot-script/package/interpreter')

const delete_ = require('discordbot-script/package/bot/delete')

const guildMemberRemove = (client, member) => {

    client.leave.map(async command => {

        let { guild, user } = member

        if (user.id === client.user.id) return

        let message = {
            guild: guild,
            content: "",
            idd: Math.floor(Math.random() * 10101003949393),
            author: user,
            member: member
        }

        client.embeds.set(message.idd, new Discord.MessageEmbed())

        let name = await interpret(client, message, message.content.split(" "), command.name, command.name)

        let channel = await client.channels.fetch(name).catch(err => { })

        if (!channel) return console.error(`Missing or incorrect channel: onLeaveCommand[${name}]`)

        let code = await interpret(client, message, message.content.split(" "), command.name, command.code)

        let dm = client.channel.get(message.idd)

        if (dm) {
            let msg = dm.send(code, client.embeds.get(message.idd)).catch(err => { })

            edit(client, message, msg, client.editIn.get(message.idd))

            delete_(client, message, msg)

            addreactions_(client, message, msg)

            client.addReactions.delete(message.idd)

            client.embeds.delete(message.idd)

            client.suppress.delete(message.idd)
        }

        if (code && !dm) {
            let msg = await require("discordbot-script/package/bot/attachment")(client, message, channel, code)

            edit(client, message, msg, client.editIn.get(message.idd))

            delete_(client, message, msg)

            addreactions_(client, message, msg)

            client.addReactions.delete(message.idd)

            client.embeds.delete(message.idd)

            client.suppress.delete(message.idd)
        }
    })
}

module.exports = guildMemberRemove;