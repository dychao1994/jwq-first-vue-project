<template>
    <div class="shuttle">
        <div class="shuttle-panel">
            <div class="shuttle-title">
                <el-checkbox v-model="checkAllLeft" :indeterminate="isIndeterminateLeft" @change="(val) => handleCheckAllChange(val, 'Left')">{{titles[0]}}</el-checkbox>
            </div>
            <div class="shuttle-content">
                <el-checkbox-group v-model="checkedLeft" @change="(val) => handleChange(val, 'Left')">
                    <li v-for="item in listLeft" :key="'listLeft_' +item.key" class="single-row">
                        <el-checkbox :key="'checkbox_' + item.key" :label="item.prop" class="check" :disabled="item.disabled">{{item.label}}</el-checkbox>
                    </li>
                </el-checkbox-group>
            </div>
        </div>
        <div class="buttons">
            <el-button size="small" type="primary" icon="el-icon-arrow-left" :disabled="checkedRight.length == 0" @click="transfer('Right', 'Left')">{{buttonTexts[0]}}</el-button>
            <el-button size="small" type="primary" icon="el-icon-arrow-right" :disabled="checkedLeft.length == 0" @click="transfer('Left', 'Right')">{{buttonTexts[1]}}</el-button>
        </div>
        <div class="shuttle-panel">
            <div class="shuttle-title">
                <el-checkbox v-model="checkAllRight" :indeterminate="isIndeterminateRight" @change="(val) => handleCheckAllChange(val, 'Right')">{{titles[1]}}</el-checkbox>
            </div>
            <div class="shuttle-content">
                <el-checkbox-group v-model="checkedRight" @change="(val) => handleChange(val, 'Right')">
                    <draggable
                        tag="ul"
                        :list="listRight"
                        class="list-group"
                        handle=".handle"
                        v-bind="dragOptions">
                        <transition-group type="transition" name="flip-list">
                            <li v-for="item in listRight" :key="'listRight_' + item.key" class="single-row">
                                <el-checkbox :key="'checkbox_' + item.key" :label="item.prop" class="check" :disabled="item.disabled">{{item.label}}</el-checkbox>
                                <i class="iconfont icon-learning-draggable handle" style="cursor:move;"></i>
                                <el-tooltip class="item" effect="light" content="允许筛选标志" placement="top" :open-delay="800">
                                    <i class="iconfont icon-learning-filter" :class="{active: item.searchInput}" @click="$set(item, 'searchInput', !item.searchInput)"></i>
                                </el-tooltip>
                            </li>
                        </transition-group>
                    </draggable>
                </el-checkbox-group>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
    name: 'Shuttle',
    components: {
        draggable
    },
    props: {
        titles: {
            type: Array,
            default: () => { return ['隐藏字段', '显示字段']; }
        },
        buttonTexts: {
            type: Array,
            default: () => { return ['到左边', '到右边']; }
        },
        //  主键字段
        field: {
            type: String,
            default: 'prop'
        },
        value: {
            type: Array,
            default: () => []
        },
        data: {
            type: Array,
            default: () => {
                return [
                    {
                        key: 0,
                        prop: 'code',
                        label: '药品编码',
                        disabled: true,
                        visible: false,
                        minWidth: '120',
                        fixed: 'left'
                    }, {
                        key: 1,
                        prop: 'name',
                        label: '药品名称',
                        disabled: true,
                        minWidth: '100',
                        fixed: 'left',
                        searchInput: true
                    }, {
                        key: 2,
                        prop: 'genericName',
                        label: '药品通用名',
                        minWidth: '100',
                        searchInput: false
                    }, {
                        key: 3,
                        prop: 'tradeName',
                        label: '药品商品名',
                        minWidth: '110',
                        searchInput: true
                    }, {
                        key: 4,
                        prop: 'enName',
                        label: '英文名称',
                        searchInput: false
                    }, {
                        key: 5,
                        prop: 'companyCode',
                        label: '企业编码',
                        searchInput: false
                    }, {
                        key: 6,
                        prop: 'companyName',
                        label: '生产厂家',
                        minWidth: '120',
                        searchInput: true
                    }, {
                        key: 7,
                        prop: 'approvalNumber',
                        label: '批准文号',
                        minWidth: '110',
                        searchInput: true
                    }, {
                        key: 8,
                        prop: 'drugTypeCode',
                        label: '药品类型',
                        searchInput: false
                    }, {
                        key: 9,
                        prop: 'drugTypeName',
                        label: '大类码名称',
                        minWidth: '100',
                        searchInput: false
                    }, {
                        key: 10,
                        prop: 'phaClassName',
                        label: '药理/功效分类',
                        minWidth: '120',
                        searchInput: false
                    }, {
                        key: 11,
                        prop: 'phaClassCode',
                        label: '药理/功效编码',
                        minWidth: '120',
                        searchInput: false
                    }, {
                        key: 12,
                        prop: 'mainName',
                        label: '品种名',
                        searchInput: false
                    }, {
                        key: 13,
                        prop: 'mainEnName',
                        label: '品种名英文',
                        minWidth: '100',
                        searchInput: false
                    }, {
                        key: 14,
                        prop: 'mainCode',
                        label: '品种名代码',
                        minWidth: '100',
                        searchInput: false
                    }, {
                        key: 15,
                        prop: 'dosageCode',
                        label: '剂型代码',
                        searchInput: false
                    }, {
                        key: 16,
                        prop: 'dosageName',
                        label: '剂型名称',
                        searchInput: false
                    }, {
                        key: 17,
                        prop: 'drugSpec',
                        label: '药品规格',
                        searchInput: false
                    }, {
                        key: 18,
                        prop: 'convertUnit',
                        label: '转换系数',
                        searchInput: false
                    }, {
                        key: 19,
                        prop: 'minUnit',
                        label: '最小单位',
                        searchInput: false
                    }, {
                        key: 20,
                        prop: 'packageUnit',
                        label: '包装单位',
                        searchInput: false
                    }, {
                        key: 21,
                        prop: 'remark',
                        label: '备注说明',
                        searchInput: false
                    }, {
                        key: 23,
                        prop: 'isMapped',
                        label: '匹配状态',
                        filters: [
                            {text: '未匹配', value: false, class: 'red'},
                            {text: '已匹配', value: true}
                        ],
                        fixed: 'right',
                        width: 100
                    }
                ];
            }
        }
    },
    data() {
        return {
            listLeft: [],
            checkAllLeft: false,
            checkedLeft: [],
            isIndeterminateLeft: false,
            listRight: [],
            checkAllRight: false,
            checkedRight: [],
            isIndeterminateRight: false
        };
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            };
        }
    },
    watch: {
        value: {
            handler(newVal, oldVal) {
                this.handleData(newVal);
            },
            immediate: true
        }
    },
    created() {
        this.handleData(this.value);
    },
    methods: {
        handleCheckAllChange(val, typeName) {
            this[`isIndeterminate${typeName}`] = val.length == this[`list${typeName}`].length ? false : (val.length ? '' : false);
            this[`checkAll${typeName}`] = val;
            this[`checked${typeName}`] = val ? this[`list${typeName}`].filter(record => !record.disabled).map(record => { return record.prop; }) : [];
        },
        handleChange(val, typeName) {
            if (val.length) {
                const checkedAll = val.length == this[`list${typeName}`].filter(record => !record.disabled).length;
                this[`isIndeterminate${typeName}`] = !checkedAll;
                this[`checkAll${typeName}`] = checkedAll;
            } else {
                this[`isIndeterminate${typeName}`] = false;
            }
        },
        handleData(targetList) {
            const listRight = JSON.parse(JSON.stringify(targetList));
            this.listRight = listRight;
            const targetKey = listRight.map(record => record[this.field]);
            this.listLeft = this.data.filter(record => !targetKey.includes(record[this.field]));
        },
        transfer(from, to) {
            //  1.通过主键找到数据
            const fromList = [];
            const toList = [];
            this[`list${from}`].forEach(record => {
                if (this[`checked${from}`].includes(record[this.field])) {
                    toList.push(record);
                } else {
                    fromList.push(record);
                }
            });
            //  2.赋值
            this[`list${from}`] = fromList;
            this[`list${to}`] = this[`list${to}`].concat(toList);
            //  3.重置状态
            this[`checkAll${from}`] = false;
            this[`isIndeterminate${from}`] = false;
            this[`checked${from}`] = [];
        },
        //  获取排序后的列表
        getSortListRight() {
            return this.listRight.map((record, index) => {
                return {
                    fieldName: record.prop,
                    sort: index,
                    structType: 'dt_data_drug',
                    filterable: (record.searchInput ? 1 : 0)
                };
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .shuttle{
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        .shuttle-panel{
            border: 1px solid #ebeef5;
            border-radius: 4px;
            background: #fff;
            display: inline-block;
            vertical-align: middle;
            min-width: 240px;
            min-height: 680px;
            max-height: 100%;
            height: 100%;
            box-sizing: border-box;
            position: relative;
            .shuttle-title{
                height: 40px;
                line-height: 40px;
                background: #f5f7fa;
                margin: 0;
                padding-left: 15px;
                border-bottom: 1px solid #ebeef5;
                box-sizing: border-box;
                color: #000;
            }
            .shuttle-content{
                height: calc(100% - 40px - 12px);
                overflow: auto;
                padding: 6px 0;
                .single-row{
                    padding-left: 15px;
                    font-weight: 500;
                    font-size: 14px;
                    cursor: pointer;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    line-height: 30px;
                    /deep/.el-checkbox__label:hover{
                        color: $primary;
                    }
                    .check{
                        width: calc(100% - 40px);
                        min-width: 130px;
                    }
                    .sort-no{
                        border: 1px solid $primary;
                        border-radius: 50%;
                        width: 16px;
                        height: 16px;
                        line-height: 16px;
                        text-align: center;
                        color: $primary;
                    }
                    i{

                        font-size: 14px;
                        color: #9da4ac;
                        margin-right: 15px;
                    }
                    .active{
                        color: $primary;
                    }
                }
            }
        }
        .buttons{
            padding: 0 20px;
            >button{
                margin: 4px 10px;
            }
        }
        .ghost {
            opacity: 0.5;
            background: lighten($primary, 40%);
        }

    }

</style>
