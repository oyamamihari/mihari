// xiaohongshu_dewatermark.js
var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);

// 处理图片水印
if (url.indexOf('xhslink.com') !== -1 || url.indexOf('/note') !== -1) {
  if (obj.data && obj.data.images_list) {
    obj.data.images_list = obj.data.images_list.map(image => {
      if (image.watermark) {
        image.watermark = false; // 去除图片的水印标记
      }
      return image;
    });
  }

  // 处理视频水印
  if (obj.data && obj.data.video) {
    obj.data.video.has_watermark = false; // 去除视频的水印标记
  }

  // 处理视频的播放链接（可选，根据具体情况修改）
  if (obj.data && obj.data.video && obj.data.video.url) {
    obj.data.video.url = obj.data.video.url.replace('watermark=1', 'watermark=0'); // 替换掉水印参数
  }
}

body = JSON.stringify(obj);
$done({ body });
