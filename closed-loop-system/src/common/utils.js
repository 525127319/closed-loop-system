export default {
    getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
    base64Encode: function (input) {
        return encodeURIComponent(input)
    },
    base64Decode: function (input) {
        return decodeURIComponent(input)
    }

}