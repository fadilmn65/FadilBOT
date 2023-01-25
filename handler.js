require('dotenv').config()
const fs = require('fs-extra')
const { decryptMedia } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
let vCardsJS = require('vcards-js');

const stickerArr = ['XM1N7CiW1xxkL8Oi6sCD2+xECehai2DI4bE37I7PIhw=', 'toFAeTndmqlzGRdBUY4K2EAnLdwCqgGF7nmMiaAX2Y0=', 'UWK/E5Jf/OLg+zFgICX3bwXc0iXfPEZ+PDDf0C+3Qvw=', 'BfppV7tESHi/QmrxuJG4WdXKYsO3lNTiXf0aBfasJ4E=', 'mHbEuCjA+RVWftr2AFuLieAJcyHYZnibd7waZPqvDNQ=']

const msgFilter = require('./lib/msgFilter')
const ruleArr = JSON.parse(fs.readFileSync('./lib/rule.json'))
const color = require('./lib/color')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        const prefix = "#"
        const ownerNumber = "62895334951166@c.us"
        const vcard = vCard.getFormattedString();
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
	    const isRule = ruleArr.includes(chat.id)
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
       let vCard = vCardsJS();

	const botNumber = await client.getHostNumber()
	const groupId = isGroupMsg ? chat.groupMetadata.id : ''
	const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
	const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
	if ((message.type == 'sticker') && (stickerArr.includes(message.filehash))) return await sticker.stickerHandler(message, client, isGroupAdmins, isBotGroupAdmins, groupAdmins, color, time)
	if (isGroupMsg && isRule && (type === 'chat' && message.body.includes('chat.whatsapp.com') && isBotGroupAdmins) && !isGroupAdmins) return await client.removeParticipant(chat.id, author)
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        if (!isCmd && !isGroupMsg) return prefix(message, color, true, time)
        if (!isCmd && isGroupMsg) return prefix(message, color, false, time)
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        // eg [9190xxxxxxxx, 49xxxxxxxx] replace my number also 
        const isowner = botadmins.includes(sender.id) 

        msgFilter.addFilter(from)

        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
            switch (command) {
                case 'sticker':
                    //console.log(type)
                                if (isMedia && type == 'video') {
                                        return await sendSticker.sendAnimatedSticker(message)
                                } else if (isMedia && type == 'image') {
                                      const mediaData = await decryptMedia(message)
                                      const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                                      const baseImg = imageBase64.replace('video/mp4','image/gif')
                                      await client.sendImageAsSticker(from, baseImg)
                                } else if (quotedMsg && quotedMsg.type == 'image') {
                                    const mediaData = await decryptMedia(quotedMsg)
                                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                                    await client.sendImageAsSticker(from, imageBase64)
                            } else if (quotedMsg && quotedMsg.type == 'video') {
                                           if (quotedMsg.duration < 15) {
                                          sendSticker.sendAnimatedSticker(quotedMsgObj)
                                          } else {
                                          await client.reply(from, 'The given file is too large for converting', id)
                                          } 
                            } else {
                                  client.reply(from, 'You did not tag a picture or video, Baka', message.id)
                                }
                break

                case 'owner':
                    await client.sendContact(from, ownerNumber, vcard,'Eric Nesser')
                    break
                case 'toimg':
       	if(!quotedMsg) return client.reply(from, '.', id)
		else if (quotedMsg && quotedMsg.type == 'video'){
		return client.reply(from, 'that\'s not a sticker, Baka', id)
		} if(quotedMsg) {
	const mediaData = await decryptMedia(quotedMsg)
	const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
	await client.sendFile(from, imageBase64, 'img.jpg')
		}
		break
        default:
            console.log(color('[PREFIX-CALL]', 'green'), color(time, 'yellow'), 'Command from', color(pushname))
 	    return client.reply(from, 'No such Command!', id)
            break
    
    }
} catch (err) {
    console.log(color('[ERROR]', 'red'), err)
}
}