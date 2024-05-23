class DeleteLinks {
  #getText;
  #socket;
  #linkRegex;
  #sendMessage;

  constructor(config = {}) {
    this.#linkRegex = /https?:\/\/[^\s]+/g; // Regex pattern to detect URLs
  }

  init(socket, getText) {
    this.#socket = socket;
    this.#getText = getText;
  }

  async process(key, message) {
    const text = this.#getText(key, message);
    const textt = 'Links not permitted ';

    // Check if the message contains a link
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

        // Delete the message
        await this.#socket.deleteMessage(key.remoteJid, {
          id: key.id,
          remoteJid: key.remoteJid,
          fromMe: key.fromMe,
        });
        this.#sendMessage(
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
    }
  }
  
}

module.exports = DeleteLinks;