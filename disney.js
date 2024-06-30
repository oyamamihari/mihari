/**
 *
 * [Panel]
 * disney_plus_check = script-name=disney_plus_check, title="Disney+ 解锁检测", update-interval=1
 *
 * [Script]
 * disney_plus_check = type=generic, script-path=https://gist.githubusercontent.com/Hyseen/5ae36a6a5cb5690b1f2bff4aa19c766f/raw/disney_plus_check.js, argument=title=Disney+ 解锁检测
 *
 * 支持使用脚本使用 argument 参数自定义配置，如：argument=key1=URLEncode(value1)&amp;key2=URLEncode(value2)，具体参数如下所示，
 * title: 面板标题
 * availableContent: 解锁时展示的的文本内容，支持两个区域占位符 #REGION_FLAG# 和 #REGION_CODE#，用来展示解锁区域国旗 emoji 和解锁区域编码
 * availableIcon: 解锁时展示的图标，内容为任意有效的 SF Symbol Name
 * availableIconColor:  解锁时展示的图标颜色，内容为颜色的 HEX 编码
 * availableStyle: 解锁时展示的图标样式，参数可选值有 good, info, alert, error
 * notAvailableContent: 不支持解锁时展示的文本内容
 * notAvailableIcon: 不支持解锁时展示的图标
 * notAvailableIconColor: 不支持解锁时展示的图标颜色
 * notAvailableStyle: 不支持解锁时展示的图标样式
 * errorContent: 检测异常时展示的文本内容
 * errorIcon: 检测异常时展示的图标
 * errorIconColor: 检测异常时展示的图标颜色
 * errorStyle: 检测异常时展示的图标样式
 */

const BASE_URL = 'https://www.disneyplus.com/'

const DEFAULT_OPTIONS = {
  title: 'Disney+ 解锁检测',
  availableContent: '支持 Disney+，地区：#REGION_FLAG# #REGION_NAME#',
  availableIcon: '',
  availableIconColor: '',
  availableStyle: 'good',
  notAvailableContent: '不支持 Disney+',
  notAvailableIcon: '',
  notAvailableIconColor: '',
  notAvailableStyle: 'alert',
  errorContent: '检测失败，请重试',
  errorIcon: '',
  errorIconColor: '',
  errorStyle: 'error',
}

let options = getOptions()
let panel = {
  title: options.title,
}

;(async () => {
  await Promise.race([test(), timeout()])
    .then(region => {
      if (options.availableIcon) {
        panel['icon'] = options.availableIcon
        panel['icon-color'] = options.availableIconColor ? options.availableIconColor : undefined
      } else {
        panel['style'] = options.availableStyle
      }
      panel['content'] = replaceRegionPlaceholder(options.availableContent, region)
    })
    .catch(error => {
      if (error !== 'Not Available') {
        return Promise.reject(error)
      }

      if (options.notAvailableIcon) {
        panel['icon'] = options.notAvailableIcon
        panel['icon-color'] = options.notAvailableIconColor ? options.notAvailableIconColor : undefined
      } else {
        panel['style'] = options.notAvailableStyle
      }
      panel['content'] = options.notAvailableContent
    })
})()
  .catch(error => {
    console.log(error)
    if (options.errorIcon) {
      panel['icon'] = options.errorIcon
      panel['icon-color'] = options.errorIconColor ? options.errorIconColor : undefined
    } else {
      panel['style'] = options.errorStyle
    }
    panel['content'] = options.errorContent
  })
  .finally(() => {
    $done(panel)
  })

function test() {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
        'Accept-Language': 'en',
      },
    }
    $httpClient.get(option, function (error, response, data) {
      if (error != null || response.status !== 200) {
        reject('Error')
        return
      }

      if (data.indexOf('unavailable') !== -1) {
        reject('Not Available')
        return
      }

      let region = ''
      let re = new RegExp('"regionCode":"(.*?)"', 'gm')
      let result = re.exec(data)
      if (result != null && result.length === 2) {
        region = result[1]
      } else {
        region = 'US'
      }
      resolve(region.toUpperCase())
    })
  })
}

function timeout(delay = 5000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout')
    }, delay)
  })
}

function getCountryFlagEmoji(countryCode) {
  if (countryCode.toUpperCase() == 'TW') {
    countryCode = 'CN'
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

function getOptions() {
  let options = Object.assign({}, DEFAULT_OPTIONS)
  if (typeof $argument != 'undefined') {
    try {
      let params = Object.fromEntries(
        $argument
          .split('&')
          .map(item => item.split('='))
          .map(([k, v]) => [k, decodeURIComponent(v)])
      )
      Object.assign(options, params)
    } catch (error) {
      console.error(`$argument 解析失败，$argument: + ${argument}`)
    }
  }

  return options
}

function replaceRegionPlaceholder(content, region) {
  let result = content

  if (result.indexOf('#REGION_CODE#') !== -1) {
    result = result.replaceAll('#REGION_CODE#', region.toUpperCase())
  }
  if (result.indexOf('#REGION_FLAG#') !== -1) {
    result = result.replaceAll('#REGION_FLAG#', getCountryFlagEmoji(region.toUpperCase()))
  }

  if (result.indexOf('#REGION_NAME#') !== -1) {
    result = result.replaceAll('#REGION_NAME#', RESION_NAMES?.[region.toUpperCase()]?.chinese ?? '')
  }

  if (result.indexOf('#REGION_NAME_EN#') !== -1) {
    result = result.replaceAll('#REGION_NAME_EN#', RESION_NAMES?.[region.toUpperCase()]?.english ?? '')
  }

  return result
}

// prettier-ignore
const RESION_NAMES={AF:{chinese:"阿富汗",english:"Afghanistan",},AL:{chinese:"阿尔巴尼亚",english:"Albania",},DZ:{chinese:"阿尔及利亚",english:"Algeria",},AO:{chinese:"安哥拉",english:"Angola",},AR:{chinese:"阿根廷",english:"Argentina",},AM:{chinese:"亚美尼亚",english:"Armenia",},AU:{chinese:"澳大利亚",english:"Australia",},AT:{chinese:"奥地利",english:"Austria",},AZ:{chinese:"阿塞拜疆",english:"Azerbaijan",},BH:{chinese:"巴林",english:"Bahrain",},BD:{chinese:"孟加拉国",english:"Bangladesh",},BY:{chinese:"白俄罗斯",english:"Belarus",},BE:{chinese:"比利时",english:"Belgium",},BZ:{chinese:"伯利兹",english:"Belize",},BJ:{chinese:"贝宁",english:"Benin",},BT:{chinese:"不丹",english:"Bhutan",},BO:{chinese:"玻利维亚",english:"Bolivia",},BA:{chinese:"波斯尼亚和黑塞哥维那",english:"Bosnia and Herzegovina",},BW:{chinese:"博茨瓦纳",english:"Botswana",},BR:{chinese:"巴西",english:"Brazil",},VG:{chinese:"英属维京群岛",english:"British Virgin Islands",},BN:{chinese:"文莱",english:"Brunei",},BG:{chinese:"保加利亚",english:"Bulgaria",},BF:{chinese:"布基纳法索",english:"Burkina-faso",},BI:{chinese:"布隆迪",english:"Burundi",},KH:{chinese:"柬埔寨",english:"Cambodia",},CM:{chinese:"喀麦隆",english:"Cameroon",},CA:{chinese:"加拿大",english:"Canada",},CV:{chinese:"佛得角",
