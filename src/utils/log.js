export default class Log {
  constructor(prefix) {
    this.mark = 'TalkmateLive';
    this.prefix = prefix || '';
  }

  setPrefix(param) {
    let prefix = `[${this.mark}`;
    if (this.prefix.length > 0) {
      prefix += `.${this.prefix}]:`;
    } else {
      prefix += ']:';
    }
    param.unshift(prefix);
  }

  log(...params) {
    const param = Array.from(params);
    this.setPrefix(param);
    console.log(console, param);
  }

  warn(...params) {
    const param = Array.from(params);
    this.setPrefix(param);
    console.warn(console, param);
  }

  error(...params) {
    const param = Array.from(params);
    this.setPrefix(param);
    console.error(console, param);
  }
}
