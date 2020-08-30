<template>
    <div>
        <el-form label-width="80px">
            <el-form-item label="主题色：">
                <el-radio-group v-model="theme">
                    <el-radio
                        v-for="item in themeOptions"
                        :key="item"
                        :label="item"
                    >{{item}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="语言：">
                <el-radio-group v-model="lang" @change="handleLangChange">
                    <el-radio
                        v-for="item in langOptions"
                        :key="item.value"
                        :label="item.value"
                    >{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>


        <div class="ace-editor">
            <div class="format-btn" title="格式化" @click="format">
                <i class="iconfont icon-learning-format"/>
            </div>
            <editor ref="editor" :key="theme" v-model="content" :lang="lang" :theme="theme" height="400" @init="editorInit"></editor>
        </div>
        <el-table
            class="table"
            size="small"
            :data="tableData">
            <el-table-column prop="paramCode" label="参数名"></el-table-column>
            <el-table-column prop="paramName" label="中文名"></el-table-column>
            <el-table-column prop="paramType" label="类型"></el-table-column>
            <el-table-column
                prop="domain"
                label="值域"
                show-overflow-tooltip></el-table-column>
            <el-table-column
                prop="description"
                label="描述"
                show-overflow-tooltip></el-table-column>
        </el-table>
    </div>

</template>

<script>
import xml2js from 'xml2js';
import {xmlToJson, jsonToXml} from '@/utils/utils.js';
export default {
    name: 'AceEditor',
    components: {
        editor: () => import('@/components/Editor.js')
    },
    data() {
        return {
            tableData: [],
            content: /* '{\n' +
                '    "$xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",\n' +
                '    "$xmlns:web": "http://webservice.zhending.com",\n' +
                '    "soap:Header": "",\n' +
                '    "soap:Body": {\n' +
                '        "web:getData": {\n' +
                '            "@a": "123",\n' +
                '            "web:token": "?",\n' +
                '            "web:json": "?"\n' +
                '        }\n' +
                '    }\n' +
                '}', */ '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:web="http://webservice.zhending.com">\n' + '   <soap:Header/>\n' +
                '   <soap:Body>\n' +
                '      <web:getData a="123">\n' +
                '         <!--Optional:-->\n' +
                '         <web:token>?</web:token>\n' +
                '         <!--Optional:-->\n' +
                '         <web:json>?</web:json>\n' +
                '      </web:getData>\n' +
                '   </soap:Body>\n' +
                '</soap:Envelope>',
            lang: 'xml', // json、xml
            langOld: 'xml',
            langOptions: [{
                label: 'json',
                value: 'json'
            }, {
                label: 'xml',
                value: 'xml'
            }], // json、xml
            theme: 'chrome',
            themeOptions: ['ambiance', 'chaos', 'chrome', 'clouds_midnight', 'clouds', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore_soft', 'merbivore', 'mono_industrial', 'monokai', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'sqlserver', 'terminal', 'textmate', 'tomorrow_night_blue', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'tomorrow_night', 'tomorrow', 'twilight', 'vibrant_ink', 'xcode']
        };
    },
    watch: {
        lang(newVal, oldVal) {
            this.langOld = oldVal;
        }
    },
    methods: {
        editorInit() {
        },
        format() {
            const editor = this.$refs.editor.editor;
            const val = editor.session.getValue();
            if (val) {
                if (this.lang == 'json') {
                    this.content = this.formateJson(this.content);
                } else if (this.lang == 'xml') {
                    editor.session.setValue(this.formateXml(val));
                }
            }
        },
        formateJson(content) {
            try {
                const o = JSON.parse(content); // may throw if json is malformed
                content = JSON.stringify(o, null, 4); // 4 is the indent size,该方法来自https://github.com/beautify-web/js-beautify/blob/master/js/lib/beautify.js
            } catch (e) {
                this.$message.error('json格式有误，格式化失败！');
            }
            return content;
        },
        handleLangChange(val) {
            const {langOld} = this;
            if (val == 'json' && langOld == 'xml') {
                xmlToJson(this.content).then(res => {
                    this.content = res;
                    const json = JSON.parse(res);
                    this.tableData = this.formatTableData(json);
                });
                /* this.xmlToJson(this.content).then(res => {
                    this.content = res;
                    const json = JSON.parse(res);
                    this.tableData = this.formatTableData(json);
                });*/
            } else if (val == 'xml' && langOld == 'json') {
                //  headless（默认值false：）：省略XML标头。在0.4.3。中添加。
                //  attrkey（默认值$：）：用于访问属性的前缀。版本0.1默认为@。
                /* const builder = new xml2js.Builder({headless: true, attrkey: '$'});
                let json; const xmlJson = {};
                try {
                    json = JSON.parse(this.content);
                    this.transformXmlJson(xmlJson, json);
                } catch (e) {
                    this.$message.error('json格式有误，转换xml失败！');
                }*/
                const content = this.content;
                this.content = jsonToXml(this.content);
                this.tableData = this.formatTableData(JSON.parse(content));
            }
        },
        xmlToJson(xml) {
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
                    resolve(this.formateJson(JSON.stringify(result)));
                });
            });
        },
        formatTableData(json) {
            const result = [];
            Object.keys(json).forEach(key => {
                if (!key.startsWith('$') && !key.startsWith('@')) {
                    result.push({
                        paramCode: key,
                        paramName: key,
                        paramType: 'json',
                        domain: (json[key] instanceof Object ? '' : json[key])
                    });
                }
            });
            return result;
        },
        //  转换成xml所需的json
        transformXmlJson(result, contentJson) {
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
                    this.transformXmlJson(result[key], value);
                }
            });
            return result;
        }
    }
};
</script>

<style lang="scss" scoped>
    .ace-editor{
        position: relative;
        .format-btn{
            position: absolute;
            right: 6px;
            top: 2px;
            z-index: 2;
            border: 1px solid $primary-light;
            background-color: #FFFFFF;
            border-radius: 2px;
            cursor: pointer;
            i{
                color: $primary;
                font-size: 20px;
            }
        }
    }
</style>
