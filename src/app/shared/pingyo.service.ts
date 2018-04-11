import { OnInit, Injectable } from '@angular/core';

declare function unescape(s: string): string;
declare function escape(s: string): string;

@Injectable()
export class PingYoService {
    constructor() {
        this.getUrlVars();
        this.setAffiliateId();
        this.setSubAffiliate();
        this.setCampaign();
        this.setApplicationExtension();

        this.buildApplyLink();
        console.log(this.buildApplyLink());
    }

    iframeSrc: string = "https://apply.onlyloanz.com";
    defaultAffiliate: string = 'usa_test';
    defaultSubAffiliate: null;
    defaultCampaign: null;
    defaultApplicationExtension: null;
    mobileBannerImage: string = 'http://www.onlyloanz.com/Content/Images/dl_mobbanner.jpg'; //Full URL for mobile application form banner
    detectMobile: boolean = true;
    cookieExpiryTime: number = 1; //In Days, null for session
    getValue: Function = function (n) {
        var c = JSON.parse(this.readCookie());

        if (c !== undefined && c !== null) {
            for (var p in c) {
                if (p === n) {
                    return c[p];
                }
            }
        }

        return null;
    };
    setAffiliateId: Function = function (id) {
        id = this.getUrlVars().id;
        if (id === undefined || id === null || id.length < 1) {
            return this.defaultAffiliate = 'usa_test';
        } else {
            return this.defaultAffiliate = id;
        }
    };
    setSubAffiliate: Function = function (sub) {
        sub = this.getUrlVars().subid;
        if (sub === undefined || sub === null || sub.length < 1) {
            return this.defaultSubAffiliate = null;
        } else {
            return this.defaultSubAffiliate = sub;
        }
    };
    setCampaign: Function = function (c) {
        c = this.getUrlVars().campaign;
        if (c === undefined || c === null || c.length < 1) {
            return this.defaultCampaign = 'Test';
        } else {
            return this.defaultCampaign = c;
        }
    };
    setApplicationExtension: Function = function (appExtension) {
        let urlKeys = ['la', 'term', 'fn', 'ln', 'em', 'campaign', 'id', 'subid'];
        let appExtensionArray = [];
        let urlProperties = this.getUrlVars();

        for (var key in urlProperties) {
            if (urlKeys.includes(key) == false) {
                appExtensionArray.push({ [key]: urlProperties[key] });
            }
        }
        return this.defaultApplicationExtension = appExtensionArray;

    }
    setValue: Function = function (n, v) {
        var set = false;
        var c = JSON.parse(this.readCookie());

        if (c !== undefined && c !== null) {
            for (var p in c) {
                if (p === n) {
                    c[n] = v;
                    set = true;
                }
            }
        }

        if (!set) {
            if (c === undefined || c === null) {
                c = new Object;
            }

            c[n] = v;
        }

        this.createCookie(c);
    };
    buildApplyLink: Function = function () {
        var urlVars = this.getUrlVars();
        var params = new Array();
        var prepop = new Array();
        var paramsString = null;
        var a = "";
        var i = 0;

        prepop['id'] = this.defaultAffiliate;
        prepop['subid'] = this.defaultSubAffiliate;
        prepop['campaign'] = this.defaultCampaign;

        var c = JSON.parse(this.readCookie());

        for (var prop in c) {
            prepop[prop] = c[prop];
        }

        for (var up in urlVars) {
            prepop[up] = urlVars[up];
        }

        var idIsSet = false;
        var subIdIsSet = false;
        var campaignIsSet = false;

        for (var pp in prepop) {
            //if (pp.toUpperCase() === "ID") {
            //    if (!idIsSet) {
            //        idIsSet = true;
            //        a = prepop[pp];
            //        this.createCookief(a);
            //        delete prepop[pp];
            //    }
            //} else if (pp.toUpperCase() === "SUBID") {
            //    if (!subIdIsSet) {
            //        subIdIsSet = true;
            //        if (prepop[pp] !== null && prepop[pp].length > 0) {
            //            a += "/" + prepop[pp];
            //        } else {
            //            a += "/-";
            //        }
            //        delete prepop[pp];
            //    }
            //} else if (pp.toUpperCase() === "CAMPAIGN") {
            //    if (!campaignIsSet) {
            //        campaignIsSet = true;
            //        if (prepop[pp] !== null && prepop[pp].length > 0) {
            //            a += "/" + prepop[pp];
            //        } else {
            //            a += "/-";
            //        }
            //        delete prepop[pp];
            //    }
            //} else
            if (prepop[pp] !== null && prepop[pp].length === 0) {
                delete prepop[pp];
            } else {
                if (pp.toUpperCase() === "ID") {
                    var id = prepop[pp];
                    this.createCookief(id);
                    params[i] = pp + "=" + prepop[pp];
                    i++;
                } else if (pp.toUpperCase() === "CID") {
                    var cid = prepop[pp];
                    this.createCookieCid(cid);
                    params[i] = pp + "=" + prepop[pp];
                    i++;
                }
                else {
                }
            }
        }

        a += "/";

        if (params.length > 0) {
            a += "?";
            paramsString = params.join("&");
        }

        return (a + (paramsString ? paramsString : params));
    };
    getUrlVars: Function = function () {
        var vars = {};
        let replacerFunction = (m, key, value) => {
            return vars[key] = decodeURI(value);
        }

        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, replacerFunction);
        return vars;
    };
    createCookie: Function = function (nc) {
        var c = this.readCookie();

        if (c === null) {
            c = new Object;
        } else {
            c = JSON.parse(c);
        }

        for (var prop in nc) {
            c[prop] = nc[prop];
        }

        var value = JSON.stringify(c);

        if (this.cookieExpiryTime < 1 || this.cookieExpiryTime === undefined) {
            document.cookie = "AffPop=" + escape(value) + ";path=/"; //Session only cookie
        } else {
            var date = new Date();
            date.setTime(date.getTime() + (this.cookieExpiryTime * 1 * 60 * 60 * 1000));
            document.cookie = "AffPop=" + escape(value) + ";expires=" + date.toUTCString() + ";path=/";
        }

        if (!this.readCookie()) {
            document.cookie = "AffPop=" + escape(value);
        }
    };
    createCookief: Function = function (v) {
        var date = new Date();
        date.setTime(date.getTime() + (30 * 1 * 60 * 60 * 1000));
        document.cookie = "iframe_id=" + escape(v) + ";expires=" + date.toUTCString() + ";path=/";
    };
    createCookieCid: Function = function (v) {
        var date = new Date();
        date.setTime(date.getTime() + (30 * 1 * 60 * 60 * 1000));
        document.cookie = "cid_id=" + escape(v) + ";expires=" + date.toUTCString() + ";path=/";
    };
    readCookie: Function = function () {
        var n = "AffPop=";
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(n) === 0) {
                return unescape(c.substring(n.length, c.length));
            }
        }

        return null;
    };
    // resetLinkUrls: Function = function () {
    //     if ($('a.mobileApplyLink').length) {
    //         var p = this.buildApplyLink();
    //         var j = "&";

    //         if (p.indexOf('?') === -1) {
    //             j = "?";
    //         }

    //         var href = this.iframeSrc + p + j;// + "mobile=on&bannerurl=";

    //         //if (this.mobileBannerImage !== undefined && this.mobileBannerImage !== null) {
    //         //    href = href + encodeURIComponent(this.mobileBannerImage);
    //         //}

    //         $('a.mobileApplyLink').attr('href', href);
    //     }
    // };
    // mobileliseLinkUrls: Function = function () {
    //     if ($('a.mobile-apply').length) {
    //         var p = this.buildApplyLink();
    //         var j = "&";

    //         if (p.indexOf('?') === -1) {
    //             j = "?";
    //         }

    //         var href = this.iframeSrc + p + j;// + "mobile=on&bannerurl=";

    //         //if (this.mobileBannerImage !== undefined && this.mobileBannerImage !== null) {
    //         //    href = href + encodeURIComponent(this.mobileBannerImage);
    //         //}

    //         $('a.mobile-apply').attr('href', href);

    //         if (!$('a.mobile-apply').attr('rel')) {
    //             $('a.mobile-apply').attr('rel', 'nofollow');
    //         }
    //     }
    // };
    // configureIframe: Function = function () {
    //     if ($('iframe.applyForm').length) {
    //         var params = this.buildApplyLink();

    //         var m = "";
    //         if (this.detectMobile) {
    //             if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    //                 || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    //                 if (params === null || params === undefined || params.indexOf("?") < 0) {
    //                     m = '?mobile=on';
    //                 } else {
    //                     m = '&mobile=on';
    //                 }
    //             }
    //         }
    //         var s = this.iframeSrc + params + m;
    //         $('iframe.applyForm').attr('src', s);
    //     }
    // }
}