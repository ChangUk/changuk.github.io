import { signout } from "/private/private.mjs"

export default function () {
    let url = new URL(window.location);
    if (url.pathname === "/private/") {
        signout();
    }
}
