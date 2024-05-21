
class TagEveryone {
  #socket;
  #getText;
  #sendMessage;
  #imgMes;
  #trigger;
  #botta;
  #dem;

  constructor(config = {}) {
   
    this.#trigger = config.trigger || "all";
    this.#botta = config.botta ; // Initialize #botta
    this.#dem = config.dem
  }

  init(socket, getText, sendMessage,imgMes) {
    this.#socket = socket;
    this.#getText = getText;
    this.#sendMessage = sendMessage;
    this.#imgMes = imgMes;
  }

  async process(key, message) {

    const text = this.#getText(key, message);

    if (!text.toLowerCase().includes(this.#trigger)) return;

    try {
      const grp = await this.#socket.groupMetadata(key.remoteJid);
      const members = grp.participants;

      const admins = [];
      const mentions = [];

      // Collect admins and mentions
      members.forEach(({ id, admin }) => {
        if (admin) { // Correct check for admin status
          admins.push(id);
        }
        mentions.push(id);
      });

      console.log(admins);

      // Ensure key.participant and this.#botta are in the admins list
      if (!admins.includes(key.participant)) return;
      console.log('Here ooo');
      console.log(this.#botta);
      console.log(this.#dem);
      
      if(!admins.some(item=>item.includes(this.#botta))) return;
      console.log('Here 1')
      if(!admins.some(item=>item.includes(this.#dem))) return;
      console.log('here two');

      //check for tagged message
      console.log('Here two');

      if (message.extendedTextMessage && message.extendedTextMessage.contextInfo) {
        const quotedMessage = message.extendedTextMessage.contextInfo.quotedMessage;
        const content = '';


        if (quotedMessage.conversation) {
          content = quotedMessage.conversation;
        } else if (quotedMessage.imageMessage) {
          
          await this.#imgMes(this.#socket,quotedMessage,key.remoteJid,mentions)
        }


         else {
          await this.#sendMessage(key.remoteJid, {
            text: content,
            mentions: mentions,
            contextInfo: { mentionedJid: mentions }
          });
        }
      } else {
        if (message.imageMessage) {
          console.log('There')
         // if(!message.imageMessage.caption.include(this.#trigger)) return;
          console.log('there')
          await this.#imgMes(this.#socket,message,key.remoteJid,mentions)
          }
        else {
          await this.#sendMessage(key.remoteJid, 
            {
            text: text.slice(this.#trigger.length),mentions
            
          }
        );
        }
        } 
      }
     catch (err) {
      console.log("ERROR in TagEveryone:", err);
    }
  }

  isEmptyString(str) {
    return str.trim().length === 0;
  }

  async processAndResendImageMessage(socket, message, remoteJid) {
      

    if (message.imageMessage) {
        try {
            // Download the image from the quoted message
            const mediaBuffer = await downloadMediaMessage(socket, quotedMessage);
            const mimeType = quotedMessage.imageMessage.mimetype;
            const caption = quotedMessage.imageMessage.caption || '';

            // Sending the image back
            const messageOptions = {
                image: mediaBuffer,
                caption: caption,
                mimetype: mimeType
            };

            await socket.sendMessage(remoteJid, messageOptions);
            console.log('Image resent successfully');
        } catch (err) {
            console.error('Error processing image message:', err);
        }
    }
}
}


module.exports = TagEveryone;
