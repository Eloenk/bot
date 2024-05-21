class TagEveryone {
  #socket;
  #getText;
  #sendMessage;
  #membersLimit;
  #trigger;

  constructor(config = {}) {
    this.#membersLimit = config.membersLimit || 100;
    this.#trigger = config.trigger || "all";
  }

  init(socket, getText, sendMessage) {
    this.#socket = socket;
    this.#getText = getText;
    this.#sendMessage = sendMessage;
  }

  async process(key, message) {
    const textd = this.#getText(key, message);

    if (!textd.toLowerCase().includes("@" + this.#trigger)) return;

    try {
      const grp = await this.#socket.groupMetadata(key.remoteJid);
      const members = grp.participants;
      const text = this.#getText(key, message)

      const mentions = [];
      const items = [];

      members.forEach(({ id, admin }) => {
        mentions.push(id);
        console.log(id,admin);
        items.push("@" + id.slice(0, 12) + (admin ? " 👑 " : ""));
        console.log(items);
      });

      if (members.length < this.#membersLimit)
        this.#sendMessage(
          key.remoteJid,
          {  text: textd.slice(this.#trigger.length), mentions },
          
          
        );
        console.log(textd.slice(this.#trigger.length))
    } catch (err) {
      console.log("ERROR in TagEveryone:", err);
    }
  }
}

module.exports = TagEveryone;
