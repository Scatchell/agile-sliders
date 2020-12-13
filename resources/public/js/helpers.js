function sessionIdPath(pathname) {
    return pathname.match(/\/session\/[a-zA-Z0-9-_]+/)[0];
}