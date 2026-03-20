const CookieUtils = {
    set: function(name, value, options) {
        options = options || {};
        let expires = '';
        if (options.days) {
            const date = new Date();
            date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        const path = options.path ? '; path=' + options.path : '; path=/';
        const domain = options.domain ? '; domain=' + options.domain : '';
        const secure = options.secure ? '; secure' : '';
        const samesite = options.samesite ? '; SameSite=' + options.samesite : '; SameSite=Lax';
        document.cookie = name + '=' + encodeURIComponent(value) + expires + path + domain + secure + samesite;
    },

    get: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length));
            }
        }
        return null;
    },

    delete: function(name, path) {
        path = path || '/';
        document.cookie = name + '=; Max-Age=-99999999; path=' + path;
    },

    getAll: function() {
        const cookies = {};
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            const eqPos = c.indexOf('=');
            if (eqPos > -1) {
                const name = c.substring(0, eqPos).trim();
                const value = decodeURIComponent(c.substring(eqPos + 1).trim());
                cookies[name] = value;
            }
        }
        return cookies;
    },

    exists: function(name) {
        return this.get(name) !== null;
    }
};