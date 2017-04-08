# PX个人摄影网站

## 整体架构
- 前台
- 内容发布界面
- 初始化页面

## 技术选择
vue.js + MinDB + min-model + 七牛云提供云端数据存储 

## Features
### 纯前端网页

对于用户认证方面，由于七牛存储空间内容对外有隐秘性，不知道文件对应键的情况下，即便是公开的Bucket也无法获取数据，所以利用这个特性，用json文件将密钥存储起来，文件名为secret-<password>.json

通过七牛开发者平台中的工具将其上传到之前创建的 bucket 中，七牛会默认将文件名作为该文件的键，若需要用到密钥，要求操作者输入密码，检查七牛的 bucket 中是否包含该密码作为表示的文件，如果有才会将其数据获取并取得其中的密钥。密钥以如下形式存储。
```
{
"ak":"<access-key>",
"sk":"<secret-key>",
}
```

### 文件上传
七牛的Javascript SDK默认情况下通过File对象上传，而不是单纯的文本上传。但是File对象继承于Blob对象，但是多一个name属性，即文件名。而Blob对象可以手动构建，所以通过JSON.stringify序列化的数据包装为一个Blob对象，并加上name属性来实现上传。

### 代码风格


利用es6的解构特性，Promise来规范异步代码，增强代码可读性
```
Album.load = function() {
  return Album.allInstances()
    .then(albums => {
      if (albums.length > 0) {
        ready = true
        return albums
      } else {
        return filmyBucket.getFile('albums.json')
          .then(body => JSON.parse(body))
      }
    })
    .then(albums => {
      return Promise.all(
        albums.map(album => {
          if (!ready) {
            return new Promise(resolve => {
              const _album = new Album(album._key, album)
              _album.once('ready', () => resolve(_album))
            })
          } else {
            return album
          }
        })
      )
    })
}

 update(password, update = {}, silent = false) {
    if (!isString(password)) {
      throw new TypeError('Password must be a string')
    }

    return filmyBucket.fetchPutToken(password, 'config.json')
      .then(putToken => {
        return Config.load(silent)
          .then(oldConfig => [ oldConfig, putToken ])
          .catch(() => [ {}, putToken ])
      })
      .then(([ config, putToken ]) => {
        config = config || {}

        for (const key of Object.keys(update)) {
          config[key] = update[key]
        }

        const fileData = new Blob([ JSON.stringify(config) ], { type: 'application/json' })
        fileData.name = 'config.json'

        return filmyBucket.putFile(
          fileData.name,
          fileData,
          {
            putToken: putToken
          }
        )
      })
  }
}

```
### 多国语言处理
通过浏览器的navigator.language来得知访客操作系统的首选显示语言，在json文件中记录多语言适配内容

```
{
  "_default": "en",

  "back": {
    "en": "Back",
    "zh": "返回"
  },
  "home": {
    "en": "Home",
    "zh": "首页"
  },
  //...

}
```


