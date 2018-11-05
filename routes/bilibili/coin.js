const axios = require('../../utils/axios');
const cache = require('./cache');

module.exports = async (ctx) => {
    const uid = ctx.params.uid;

    const name = await cache.getUsernameFromUID(ctx, uid);

    const response = await axios({
        method: 'get',
        url: `https://api.bilibili.com/x/space/coin/video?vmid=${uid}&jsonp=jsonp`,
        headers: {
            Referer: `https://space.bilibili.com/${uid}/`,
        },
    });
    const data = response.data.data;

    ctx.state.data = {
        title: `${name} 的 bilibili 投币视频`,
        link: `https://space.bilibili.com/${uid}`,
        description: `${name} 的 bilibili 投币视频`,
        item: data.map((item) => ({
            title: item.title,
            description: `${item.desc}<br><img referrerpolicy="no-referrer" src="${item.pic}">`,
            pubDate: new Date(item.time * 1000).toUTCString(),
            link: `https://www.bilibili.com/video/av${item.aid}`,
        })),
    };
};
