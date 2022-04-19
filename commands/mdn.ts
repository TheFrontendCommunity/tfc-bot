import axios from 'axios'
import { MessageEmbed } from 'discord.js'
import { ICommand } from 'wokcommands'


export default {
    category: 'Code Help',
    description: 'Searches the official MDN docs',
    slash: 'both',
    testOnly: true,
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<search-query>',
    options: [
        {
            name: 'search-query',
            type: 'STRING',
            description: 'Term to search in MDN docs',
            required: true
        }
    ],

    callback: async ({ text }) => {
        const base = 'https://developer.mozilla.org'
        const uri = `${base}/api/v1/search?q=${encodeURIComponent(
            text
        )}&locale=en-US`

        const documents = (await axios(uri)).data.documents

        if(documents){
            const embed = new MessageEmbed()
                .setAuthor({
                    name: `MDN Documentation`,
                    iconURL: 'https://avatars.githubusercontent.com/u/7565578?s=200&v=4'
                })
                .setColor(0x2296f3)

            let truncated = false
            if(documents.length > 3){
                documents.length = 3
                truncated = true
            }
            for(let { mdn_url, title, summary } of documents){
                summary = summary.replace(/(\r\n|\n|\r)/gm, '')
                embed.addField(title, `${summary}\n[**Link**](${base}${mdn_url})`)
            }
            if(truncated){
                embed.addField(
                    'More results found!',
                    `To view all search results, [click here](https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(text)}).`
                )
            }
            return embed
        }
        return 'Could not find any term maching your query in MDN documentation.'
    }
} as ICommand