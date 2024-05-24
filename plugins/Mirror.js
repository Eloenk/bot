class DeleteLinks {
  #getText;
  #socket;
  #sendMessage;
  #botta;
  #dem;



  constructor(config = {}) {
    this.#botta = config.botta ; // Initialize #botta
    this.#dem = config.dem;
  }

  init(socket, getText, sendMessage,imgMes) {
    this.#socket = socket;
    this.#getText = getText;
    this.#sendMessage = sendMessage;
    
  }

  async process(key, message) {
    const text = this.#getText(key, message);
    const textt = 'Links not permitted ';

    /*/ Check if the message contains a link
    if (this.#linkRegex.test(text)) {
      try {
        if(!key.remoteJid.includes('@g.us')) return;

        const grp = await this.#socket.groupMetadata(key.remoteJid);
        const members = grp.participants;
  
        const admins = [];
        members.forEach(({id,admin}) => {
          if (admin){
            admins.push(id);
          }
        });


        if (admins.includes(key.participant)) return;
        
        if(!admins.some(item=>item.includes(this.#botta))) return;
        console.log('Here 1')
        if(!admins.some(item=>item.includes(this.#dem))) return;
        console.log('here two');

        await this.#sendMessage(key.remoteJid, { delete: { id: key.id, fromMe: false } })
        console.log('Message deleted successfully')
        await this.#sendMessage(
          key.remoteJid,
          {
            text: textt,
          },
          { quoted: { key, message } }
        );
      
        console.log(`Deleted message with link: ${text}`);
      } catch (error) {
        console.error(`Failed to delete message: ${error}`);
      }
    }*/
  }
  
}

module.exports = DeleteLinks;