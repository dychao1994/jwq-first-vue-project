<template>
    <div class="tinymce-editor">
        <editor
            id="tinymce-editor"
            v-model="myValue"
            :init="init"
            :disabled="disabled"
            @onClick="onClick">
        </editor>
    </div>
</template>
<script>
import './zh_CN.js';
import tinymce from 'tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/emoticons';// 插入表情插件
import 'tinymce/plugins/image';// 插入上传图片插件
import 'tinymce/plugins/media';// 插入视频插件
import 'tinymce/plugins/table';// 插入表格插件
import 'tinymce/plugins/lists';// 列表插件
import 'tinymce/plugins/wordcount';// 字数统计插件
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/textcolor';
import Editor from '@tinymce/tinymce-vue';
export default {
    name: 'DsRichText',
    components: {
        Editor
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
        // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
        baseUrl: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        plugins: {
            type: [String, Array],
            default: 'lists image media table wordcount'
        },
        toolbar: {
            type: [String, Array],
            default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
        }
    },
    data() {
        return {
            init: {
                language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
                language: 'zh_CN',
                skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
                content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
                // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
                // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
                plugins: 'code',
                style_formats: [
                    {title: 'deep false', inline: 'span', classes: 'myclass1', deep: false},
                    {title: 'deep true', inline: 'span', classes: 'myclass2', deep: true}
                ],
                content_style: '.myclass1{color:red;} .myclass2{font-weight:700;}'
            },
            myValue: this.value
        };
    },
    watch: {
        value(newValue) {
            this.myValue = newValue;
        },
        myValue(newValue) {
            this.$emit('input', newValue);
        }
    },
    mounted() {
        tinymce.init({
            selector: '#tinymce-editor',
            plugins: [
                'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
                'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                'save table contextmenu directionality emoticons template paste textcolor'
            ],
            // 编辑区域内容样式
            // content_css: 'css/content.css',
            // 工具栏的配置项
            content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
            toolbar: 'basicDateButton selectiveDateButton toggleDateButton splitDateButton menuDateButton',
            setup(editor) {
                /* Helper functions */
                const toDateHtml = function(date) {
                    return `<time datetime="${date.toString()}">${date.toDateString()}</time>`;
                };
                const toGmtHtml = function(date) {
                    return `<time datetime="${date.toString()}">${date.toGMTString()}</time>`;
                };
                const toIsoHtml = function(date) {
                    return `<time datetime="${date.toString()}">${date.toISOString()}</time>`;
                };

                /* Basic button that just inserts the date */
                editor.ui.registry.addButton('basicDateButton', {
                    text: 'Insert Date',
                    tooltip: 'Insert Current Date',
                    onAction(_) {
                        editor.insertContent(toDateHtml(new Date()));
                    }
                });

                /* Basic button that inserts the date, but only if the cursor isn't currently in a "time" element */
                editor.ui.registry.addButton('selectiveDateButton', {
                    icon: 'insert-time',
                    tooltip: 'Insert Current Date',
                    disabled: true,
                    onAction(_) {
                        editor.insertContent(toDateHtml(new Date()));
                    },
                    onSetup(buttonApi) {
                        const editorEventCallback = function(eventApi) {
                            buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'time');
                        };
                        editor.on('NodeChange', editorEventCallback);
                        return function(buttonApi) {
                            editor.off('NodeChange', editorEventCallback);
                        };
                    }
                });

                /* Toggle button that inserts the date, but becomes inactive when the cursor is in a "time" element */
                /* so you can't insert a "time" element inside another one. Also gives visual feedback. */
                editor.ui.registry.addToggleButton('toggleDateButton', {
                    icon: 'insert-time',
                    tooltip: 'Insert Current Date',
                    onAction(_) {
                        editor.insertContent(toDateHtml(new Date()));
                    },
                    onSetup(buttonApi) {
                        const editorEventCallback = function(eventApi) {
                            buttonApi.setActive(eventApi.element.nodeName.toLowerCase() === 'time');
                        };
                        editor.on('NodeChange', editorEventCallback);
                        return function(buttonApi) {
                            editor.off('NodeChange', editorEventCallback);
                        };
                    }
                });

                /* Split button that lists 3 formats, and inserts the date in the selected format when clicked */
                editor.ui.registry.addSplitButton('splitDateButton', {
                    text: 'Insert Date',
                    onAction(_) {
                        editor.insertContent('<p>Its Friday!</p>');
                    },
                    onItemAction(buttonApi, value) {
                        editor.insertContent(value);
                    },
                    fetch(callback) {
                        const items = [
                            {
                                type: 'choiceitem',
                                text: 'Insert Date',
                                value: toDateHtml(new Date())
                            },
                            {
                                type: 'choiceitem',
                                text: 'Insert GMT Date',
                                value: toGmtHtml(new Date())
                            },
                            {
                                type: 'choiceitem',
                                text: 'Insert ISO Date',
                                value: toIsoHtml(new Date())
                            }
                        ];
                        callback(items);
                    }
                });

                /* Menu button that has a simple "insert date" menu item, and a submenu containing other formats. */
                /* Clicking the first menu item or one of the submenu items inserts the date in the selected format. */
                editor.ui.registry.addMenuButton('menuDateButton', {
                    text: 'Date',
                    fetch(callback) {
                        const items = [
                            {
                                type: 'menuitem',
                                text: 'Insert Date',
                                onAction(_) {
                                    editor.insertContent(toDateHtml(new Date()));
                                }
                            },
                            {
                                type: 'nestedmenuitem',
                                text: 'Other formats',
                                getSubmenuItems() {
                                    return [
                                        {
                                            type: 'menuitem',
                                            text: 'GMT',
                                            onAction(_) {
                                                editor.insertContent(toGmtHtml(new Date()));
                                            }
                                        },
                                        {
                                            type: 'menuitem',
                                            text: 'ISO',
                                            onAction(_) {
                                                editor.insertContent(toIsoHtml(new Date()));
                                            }
                                        }
                                    ];
                                }
                            }
                        ];
                        callback(items);
                    }
                });
            }});
    },
    methods: {
        // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
        // 需要什么事件可以自己增加
        onClick(e) {
            this.$emit('onClick', e, tinymce);
        },
        // 可以添加一些自己的自定义事件，如清空内容
        clear() {
            this.myValue = '';
        }
    }
};
</script>
