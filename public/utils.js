export const storage_key = "discordMusicFast";

export const getBrowser = () => {
    return chrome?.storage ? chrome : browser;
};

export const getStorage = async () => {
    // For Chrome
    if (chrome?.storage) {
        return new Promise((resolve) => {
            chrome.storage.sync.get([storage_key], function (result) {
                resolve(result[storage_key]);
            });
        });
    }
    // For Firefox
    else if (true) {
        return new Promise((resolve) => {
            browser.storage.sync.get([storage_key], function (result) {
                resolve(result[storage_key]);
            });
        });
    }
    // For Dev
    else if (process?.env?.NODE_ENV === "development") {
        return JSON.parse(localStorage.getItem(storage_key));
    }
};

export const setStorage = async (dataObject) => {
    // For Chrome
    if (chrome?.storage) {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ [storage_key]: dataObject }, function (result) {
                resolve(result);
            });
        });
    }
    // For Firefox
    else if (true) {
        return new Promise((resolve) => {
            browser.storage.sync.set({ [storage_key]: dataObject }, function (result) {
                resolve(result);
            });
        });
    }
    // For Dev
    else if (process?.env?.NODE_ENV === "development") {
        return localStorage.setItem(storage_key, JSON.stringify(dataObject));
    }
};

export const sendFromYoutube = async (link) => {
    const app = await getStorage();
    if (app) {
        fetch("https://discord.com/api/v9/channels/" + app.channel.id + "/messages", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: app.token,
                origin: "https://discord.com",
                referer: `https://discord.com/channels/${app.server.id}/${app.channel.id}`,
            },
            body: JSON.stringify({
                content: app.prefix + " " + formatLinkYoutube(link),
                flags: 0,
                nonce: (Math.random() * (9999999999 - 1) + 1).toFixed(0),
                tts: false,
            }),
        });
    }
};

export function formatLinkYoutube(link) {
    let toChangeLink = link;
    if (toChangeLink.includes("watch?playlist=")) toChangeLink = toChangeLink.replace("watch?playlist=", "playlist?list=");
    if (toChangeLink.includes("playlist") && !toChangeLink.includes("feature=share")) toChangeLink += "&feature=share";
    else if (toChangeLink.includes("&list=")) toChangeLink = link.split("&list=")[0];
    return toChangeLink;
}

export function addModificationHandler({ wrapper, popup, condition, newEl, onClick, insert }) {
    // WRAPER
    const wrapperEl = document.querySelector(wrapper);
    if (wrapperEl) {
        const observer = new MutationObserver((mutations, observer) => {
            // POPUP
            const popupEl = wrapperEl.querySelector(popup);

            // CONDITION

            if (popupEl && condition(popupEl)) {
                // NEWEL
                let domElement = document.createElement("div");
                domElement.innerHTML = newEl;
                domElement = domElement.children[0];

                // ONCLICK EVENT
                domElement.onclick = () => {
                    onClick(popupEl);
                };

                insert(popupEl, domElement);
                // INSERT
            }
        });
        observer.observe(wrapperEl, {
            subtree: true,
            childList: true,
        });
    }
}
