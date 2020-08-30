import xml2js from 'xml2js';
//  xml 转 json
export function xmlToJson(xml) {
    return new Promise((resolve, reject) => {
        //  explicitRoot（默认值:)：true如果要在结果对象中获取根节点
        //  attrkey（默认值$：）：用于访问属性的前缀。版本0.1默认为@。
        //  charkey（默认值_：）：用于访问字符内容的前缀。版本0.1默认为#。
        //  attrNameProcessors（默认值null：）：允许添加属性名称处理功能。接受Array具有以下签名的函数
        const xmlParser = new xml2js.Parser({
            mergeAttrs: true,
            explicitArray: false,
            explicitRoot: true,
            trim: true,
            attrNameProcessors: [function(name) {
                if (name.startsWith('xmlns')) {
                    return `$${name}`;
                }
                return `@${name}`;
            }]
        });
        // xml -> json
        xmlParser.parseString(xml, (err, result) => {
            // 将返回的结果再次格式化
            resolve(formateJson(JSON.stringify(result)));
        });
    });
}

//  json 转 xml
export function jsonToXml(content) {
    const builder = new xml2js.Builder({headless: true, attrkey: '$'});
    let json; const xmlJson = {};
    try {
        json = JSON.parse(content);
        transformXmlJson(xmlJson, json);
    } catch (e) {
        window.$vue.$message.error('json格式有误，转换xml失败！');
    }
    return formateXml(builder.buildObject(xmlJson));
}

//  格式化json数据
export function formateJson(content) {
    try {
        const o = JSON.parse(content); // may throw if json is malformed
        content = JSON.stringify(o, null, 4); // 4 is the indent size,该方法来自https://github.com/beautify-web/js-beautify/blob/master/js/lib/beautify.js
    } catch (e) {
        window.$vue.$message.error('json格式有误，格式化失败！');
    }
    return content;
}

//  转换成xml所需的json
export function transformXmlJson(result, contentJson) {
    Object.keys(contentJson).forEach(key => {
        const value = contentJson[key];
        if (!(value instanceof Object)) {
            if (key.startsWith('$') || key.startsWith('@')) {
                const contentKey = key.substring(1, key.length);
                if (!result.$) {
                    result.$ = {};
                }
                result.$[contentKey] = value;
            } else {
                result[key] = value;
            }
        } else {
            result[key] = {};
            transformXmlJson(result[key], value);
        }
    });
    return result;
}

// 格式化xml代码
export function formateXml(xmlStr) {
    let text = xmlStr;
    // 使用replace去空格
    text = `\n${text.replace(/(<\w+)(\s.*?>)/g, ($0, name, props) => {
        return `${name} ${props.replace(/\s+(\w+=)/g, ' $1')}`;
    }).replace(/>\s*?</g, '>\n<')}`;
    // 处理注释
    text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, ($0, text) => {
        const ret = `<!--${escape(text)}-->`;
        return ret;
    }).replace(/\r/g, '\n');
    // 调整格式  以压栈方式递归调整缩进
    const rgx = /\n(<(([^?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
    const nodeStack = [];
    const output = text.replace(rgx, ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) => {
        const isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
        let prefix = '';
        if (isBegin == '!') { //! 开头
            prefix = this.setPrefix(nodeStack.length);
        } else {
            if (isBegin != '/') { // /开头
                prefix = this.setPrefix(nodeStack.length);
                if (!isClosed) { // 非关闭标签
                    nodeStack.push(name);
                }
            } else {
                nodeStack.pop();// 弹栈
                prefix = this.setPrefix(nodeStack.length);
            }
        }
        const ret = `\n${prefix + all}`;
        return ret;
    });
    let outputText = output.substring(1);
    // 还原注释内容
    outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, ($0, prefix, text) => {
        if (prefix.charAt(0) == '\r') { prefix = prefix.substring(1); }
        text = unescape(text).replace(/\r/g, '\n');
        const ret = `\n${prefix}<!--${text.replace(/^\s*/mg, prefix)}-->`;
        return ret;
    });
    outputText = outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
    return outputText;
}
export function setPrefix(prefixIndex) {
    // 计算头函数 用来缩进
    let result = '';
    const span = '    ';// 缩进长度
    const output = [];
    for (let i = 0; i < prefixIndex; ++i) {
        output.push(span);
    }
    result = output.join('');
    return result;
}
