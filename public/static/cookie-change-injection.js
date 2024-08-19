(()=> {
    let lastCookie = document.cookie;
    // rename document.cookie to document._cookie, and redefine document.cookie
    const expando = '_cookie';
    let nativeCookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    Object.defineProperty(Document.prototype, expando, nativeCookieDesc);
    Object.defineProperty(Document.prototype, 'cookie', {
      enumerable: true,
      configurable: true,
      get() {
        return this[expando];
      },
      set(value) {
        this[expando] = value;
        // check cookie change
        let cookie = this[expando];
        if (cookie !== lastCookie) {
          try {
            // dispatch cookie-change messages to other same-origin tabs/frames
            let detail = {oldValue: lastCookie, newValue: cookie};
            this.dispatchEvent(new CustomEvent('cookiechange', {
              detail: detail
            }));
            channel.postMessage(detail);
          } finally {
            lastCookie = cookie;
          }
        }
      }
    });
    // listen cookie-change messages from other same-origin tabs/frames
    const channel = new BroadcastChannel('cookie-channel');
    channel.onmessage = (e)=> {
      lastCookie = e.data.newValue;
      document.dispatchEvent(new CustomEvent('cookiechange', {
        detail: e.data
      }));
    };
  })(window);