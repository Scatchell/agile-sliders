'use strict';

describe('Helpers', () => {

    it('should get session id from pathname with version', () => {
        expect(sessionIdPath("/session/xRbYOYDOx1/version/t2"))
            .toEqual("/session/xRbYOYDOx1");
    });

    it('should get session id from pathname with only session id', () => {
        expect(sessionIdPath("/session/xRbYOYDOx1"))
            .toEqual("/session/xRbYOYDOx1");
        expect(sessionIdPath("/session/xRbYOYDOx1/"))
            .toEqual("/session/xRbYOYDOx1");
    });

    it('should get session id from pathname with special characters in session id', () => {
        expect(sessionIdPath("/session/xRbYOY_Ox1"))
            .toEqual("/session/xRbYOY_Ox1");
        expect(sessionIdPath("/session/xRbYOY-Ox1"))
            .toEqual("/session/xRbYOY-Ox1");
    });
});