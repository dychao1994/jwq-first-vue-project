<template>
    <div
        class="org-chart-node tree-drag"
        :data-level="treeNode.level"
        :class="{
            'is-child': treeNode.level>0,
            'has-child': treeNode.children && treeNode.children.length>0,
            'is-last': lastChild
        }">
        <div class="chart-item-cont">
            <!-- 搜索主题 -->
            <div class="cont name" :data-level="treeNode.level">
                <span :class="{'mouse-over': treeNode.label === '新建项目'}" @click="handleClick">{{treeNode.label}}</span>

                <el-dropdown v-if="treeNode.children && treeNode.children.length>0" trigger="click"  @command="onChartMenuClick">
                    <span class="el-dropdown-link">
                        <i  class="el-icon el-icon-s-operation mouse-over" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="or">或者</el-dropdown-item>
                        <el-dropdown-item command="and">并且</el-dropdown-item>
                        <el-dropdown-item command="add">添加子句</el-dropdown-item>
                        <el-dropdown-item command="del">删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <i v-else class="el-icon el-icon-plus mouse-over" @click.stop="handleAdd"></i>

                <el-switch
                    v-if="treeNode.children && treeNode.children.length > 0"
                    v-model="treeNode.positive"
                    :width="54"
                    :active-text="showName"
                    class="active-switch"
                    @change="handlePositiveChange">
                </el-switch>
            </div>
            <!-- 搜索条件 -->
            <el-select
                v-model="treeNode.selResult.operatorName"
                placeholder="请选择"
                size="small"
                class="cont"
                :class="{disabled: treeNode.children && treeNode.children.length > 0}"
                :disabled="treeNode.children && treeNode.children.length > 0"
                @change="handleChangeOperate">
                <el-option
                    v-for="opt in treeNode.operatorArr"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value">
                </el-option>
            </el-select>

            <!-- 值域范围 -->
            <el-select
                v-if="treeNode.mode === 'select'"
                key="select"
                v-model="treeNode.selResult.values[0]"
                placeholder="请选择"
                size="small"
                filterable
                class="cont value"
                :disabled="treeNode.children && treeNode.children.length > 0">
                <el-option
                    v-for="opt in treeNode.selectArr"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value">
                </el-option>
            </el-select>
            <el-select
                v-else-if="treeNode.mode === 'multiple'"
                key="multiple"
                v-model="treeNode.selResult.values"
                multiple
                filterable
                placeholder="请选择"
                size="small"
                class="cont value"
                :disabled="treeNode.children && treeNode.children.length > 0">
                <el-option
                    v-for="opt in treeNode.selectArr"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value">
                </el-option>
            </el-select>

            <el-select
                v-else-if="treeNode.mode === 'search'"
                key="search"
                v-model="treeNode.selResult.values"
                class="cont value"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                size="small"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                    v-for="item in options"
                    :key="item.name"
                    :label="item.text"
                    :value="item.name">
                </el-option>
            </el-select>

            <el-date-picker
                v-else-if="treeNode.mode === 'date'"
                v-model="treeNode.selResult.values[0]"
                size="small"
                class="value"
                type="date"
                value-format="yyyy-MM-dd"
                clearable
                placeholder="选择日期"
                style="width:200px">
            </el-date-picker>
            <el-date-picker
                v-else-if="treeNode.mode === 'daterange'"
                v-model="treeNode.selResult.values"
                class="date-value"
                size="small"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-input
                v-else-if="treeNode.mode === 'input'"
                v-model="treeNode.selResult.values[0]"
                size="small"
                class="value"
                :disabled="treeNode.children && treeNode.children.length > 0"/>
            <div v-else-if="treeNode.mode === 'inputRange'" class="value input-range">
                <el-input
                    v-model="treeNode.selResult.values[0]"
                    size="small"
                    class="value-item"/>
                <el-input
                    v-model="treeNode.selResult.values[1]"
                    size="small"
                    class="value-item"/>
            </div>
            <span v-else class="span-value value" :class="{disable: treeNode.children && treeNode.children.length > 0}"></span>
            <el-select
                v-if="treeNode.level > 0"
                key="search1"
                v-model="treeNode.selResult.values"
                class="cont value"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请选择"
                size="small"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                    v-for="item in options"
                    :key="item.name"
                    :label="item.text"
                    :value="item.name">
                </el-option>
            </el-select>
            <i v-if="treeNode.level > 0" class="delete-icon el-icon-circle-plus-outline" style="margin-right: 14px" @click="handleAdd"></i>
            <i v-if="treeNode.level > 0" class="delete-icon el-icon-circle-close" @click="handleDelete"></i>
        </div>
        <org-tree
            v-if="treeNode.children && treeNode.children.length > 0"
            :treeData="treeNode.children">
        </org-tree>
    </div>
</template>

<script>
export default {
    name: 'OrgTreeNode',
    filters: {
        valueFilter(v) {
            return v === 'and' || v === 'or' ? '' : v;
        }
    },
    components: {
        OrgTree: () => import('./OrgTree')
    },
    props: {
        node: {
            type: Object,
            default() {
                return {};
            }
        },
        lastChild: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectArr: [],
            showChartMenu: false,
            treeNode: {},
            loading: false,
            options: []
        };
    },
    computed: {
        showName() {
            return this.treeNode.positive ? '是' : '非';
        }
    },
    watch: {
        node: {
            deep: true,
            immediate: true,
            handler(v) {
                this.treeNode = Object.assign({}, v);
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.clickListener);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.clickListener);
    },
    methods: {
        handleChangeOperate(v) {
            if (v === 'bw') {
                if (this.node.mode === 'input') {
                    this.$set(this.node, 'mode', 'inputRange');
                } else {
                    this.$set(this.node, 'mode', 'daterange');
                }
            } else if (this.node.mode === 'daterange') {
                this.$set(this.node, 'mode', 'date');
            } else if (this.node.mode === 'inputRange') {
                this.$set(this.node, 'mode', 'input');
            }
        },
        clickListener(e) {
            this.$set(this.treeNode, '_showMenu', false);
        },
        handleAdd() {
            if (!this.node.children) {
                this.node.children = [];
            }
            this.$root.$emit('onAdd', {id: this.node.id});
        },
        handleDelete() {
            this.$root.$emit('onDelete', this.node);
        },
        handleClick() {
            if (this.node.children && this.node.children.length > 0) {
                return;
            }
            this.$root.$emit('onClick', this.node);
        },

        onChartMenuClick(menu) {
            this.$set(this.treeNode, '_showMenu', false);
            switch (menu) {
                case 'or':
                    this.node.value = 'or';
                    this.node.label = '或';
                    break;
                case 'and':
                    this.node.value = 'and';
                    this.node.label = '并';
                    break;
                case 'add':
                    this.handleAdd(this.node);
                    break;
                case 'del':
                    this.handleDelete(this.node);
                    break;
                default:
                    break;
            }
        },
        handleShow(e) {
            e.stopPropagation();
            e.preventDefault();
            this.$set(this.treeNode, '_showMenu', !this.treeNode._showMenu);
        },
        handleChange() {
            this.node.selResult.values = [];
            this.node.selResult.values = Array.isArray(this.node.value) ? this.node.value : this.node.value.split(',');
        },
        remoteMethod(query) {
            if (query) {
                const o = {
                    disease: 'diseases',
                    drug: 'drugs'
                };
                const type = o[this.node.selResult.type] ? o[this.node.selResult.type] : this.node.selResult.type;
                this.loading = true;
                const paramPath = {
                    diseases: 'es_basic:getDiseaseItemSearch',
                    symptom: 'es_basic:getSymptomItem',
                    drugs: 'es_basic:getDrugItemSearch',
                    operation: 'es_basic:getOperationItem'
                };
                const params = {
                    path: paramPath[type],
                    params: {
                        text: query
                    }
                };
                this.$global.doRpcRequestResult(this.$config.url.searchPath, params).then(res => {
                    const result = res.result;
                    this.options = result[type] || result;
                });
                this.loading = false;
            } else {
                this.options = [];
            }
        },
        handlePositiveChange(v) {
            this.$set(this.node, 'positive', v);
        }
    }
};
</script>

<style lang="scss">
.org-chart-node {
    position: relative;
    min-height: 40px;
    &.is-child {
        margin-left: 40px;
        &::before {
            content: '';
            display: inline-block;
            width: 18px;
            border-left: 2px solid $primary;
            border-bottom: 2px solid $primary;
            position: absolute;
            top: -6px;
            bottom: calc(100% - 24px);
            left: -20px;

        }
    }
    &.is-child::after {
        content: '';
        display: inline-block;
        width: 20px;
        border-left: 2px solid $primary;
        position: absolute;
        bottom: 0;
        top: 0;
        left: -20px;
    }
    &.is-last::after {
        display: none;
    }
    .chart-item-cont {
        padding: 6px 0;
        .cont {
            position: relative;
            .active-switch {
                position: absolute;
                right: -60px;
                height: 24px;
                line-height: 24px;
                &.is-checked {
                    .el-switch__core {
                        background: $primary;
                        &:after {
                            margin-left: -22px;
                        }
                    }
                }
                .el-switch__label, .el-switch__core {
                    height: 24px;
                }
                .el-switch__core {
                    border-radius: 12px;
                    border: none;
                    background: #f1f1f1;
                    &:after {
                        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
                        width: 22px;
                        height: 22px;
                    }
                }
                .el-switch__label.is-active {
                    color: #333;
                }
                .el-switch__label--right {
                    margin-left: 0px;
                    position: absolute;
                    left: 32px;
                    top: 4px;
                    color: #999;
                    &.is-active {
                        color: #fff;
                        left: 10px;
                    }
                    > span {
                        font-size: 14px;
                        width: auto;
                    }
                }
            }
        }
        .span-value {
            overflow: hidden;
            white-space: nowrap;
            text-emphasis: emphasis;
            border: 1px solid $border-base;
            padding: 0 12px;
            border-radius: 4px;
            line-height: 32px;
            height: 32px;
            box-sizing: border-box;
            &.disable {
                background: #fff;
                border: none;
            }
        }

        .value {
            display: inline-block;
            width: 174px!important;
            flex-shrink: 0;
            margin-right: 20px;
        }
        .date-value {
            width: 300px;
            margin-right: 16px;
        }
        .delete-icon {
            display: flex;
            align-items: center;
            color: $primary;
            font-size: 18px;
            cursor: pointer;
        }
        .input-range {
            display: flex;
            .value-item {
                margin-right: 6px;
            }
        }
    }
    .label {
        margin-left: 26px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    }
    .el-select {
        &.disabled {
            visibility: hidden;
            opacity: 0;
        }
    }
}
</style>
