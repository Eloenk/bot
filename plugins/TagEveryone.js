
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
    this.#dem = config.dem;
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
        const quotedMessageKey = message.extendedTextMessage.contextInfo?.stanzaId;
        


        if (quotedMessage.conversation) {
          const content = quotedMessage.conversation;
          await this.#sendMessage(key.remoteJid, {
            text: content,mentions,
            
          });

        } else if (quotedMessage.imageMessage) {
          
          await this.#imgMes(this.#socket,quotedMessage,key.remoteJid,mentions)
        }
        else if(quotedMessage.videoMessage) {
          const wer = 'Everyone';
          await this.#sendMessage( key.remoteJid,
            {text:wer,mentions },
            {qouted: {quotedMessageKey , quotedMessage }}
          );
        }
        else if(quotedMessage.audioMessage){
          const audioMessage = message.audioMessage;
          if (audioMessage && audioMessage.ptt) {
              console.log('Voice message detected, downloading and resending...');

              // Download the audio
              const stream = await downloadContentFromMessage(audioMessage, 'audio');
              let buffer = Buffer.alloc(0);
              for await (const chunk of stream) {
                  buffer = Buffer.concat([buffer, chunk]);
              }

              // Resend the audio as a voice note
              await this.#sendMessage(key.remoteJid, {
                  audio: buffer,
                  mimetype: audioMessage.mimetype,
                  ptt: true,
                  mentions: mentions,
              });

              console.log('Voice message resent successfully.');
          }
        }

         
          
        
      } else {
        if (message.imageMessage) {
          console.log('There')
         // if(!message.imageMessage.caption.include(this.#trigger)) return;
          console.log('there')
          await this.#imgMes(this.#socket,message,key.remoteJid,mentions)
          }
        else {
          const wer = 'Everyone'
          if(this.isEmptyString(text))
            await this.#sendMessage(key.remoteJid, 
              {
              text: text.slice(this.#trigger.length),mentions
              
            }
          );
          else 
          await this.#sendMessage(key.remoteJid,{text:wer,mentions });
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


}


module.exports = TagEveryone;
