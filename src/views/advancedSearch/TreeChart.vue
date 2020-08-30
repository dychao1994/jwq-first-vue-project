<template>
    <div :ref="id" class="tree-chart">
        <div class="chart-container">
            <ul class="chart-header">
                <li class="active-header">模型属性选择</li>
                <li>运算符</li>
                <li>数据元允许值</li>
                <li>单位</li>
                <li>操作</li>
            </ul>
            <org-tree :treeData="treeData"></org-tree>
        </div>
    </div>
</template>

<script>
import UUID from 'uuid-js';
export default {
    components: {
        OrgTree: () => import('./components/OrgTree')
    },
    props: {
        data: {
            type: Array,
            default() {
                return [{
                    id: UUID.create().hex,
                    label: '新建项目',
                    level: 0,
                    selResult: {
                        values: []
                    },
                    children: []
                }];
            }
        },
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            treeData: [],
            deep: ''
        };
    },
    watch: {
        /* treeData: {
            deep: true,
            handler(newVal) {
                this.$emit('updateTreeData', newVal);
            }
        }*/
    },
    created() {
        this.treeData = JSON.parse(JSON.stringify(this.data));
        this.$root.$on('onAdd', this.handleAdd);
        this.$root.$on('onDelete', this.handleDelete);
        this.$root.$on('onUpdated', this.handleUpdate);
        this.getDeep();
    },
    mounted() {
        this.layout();
    },
    methods: {
        clear() {
            this.treeData = [{
                id: UUID.create().hex,
                label: '新建项目',
                level: 0,
                selResult: {
                    values: []
                },
                children: []
            }];
        },
        // 获取tree的最深层级，页面按最深层级对齐
        getDeep() {
            this.nodeList = [];
            this.treeData.forEach(node => {
                this.deepTraversal(node);
            });
            this.deep = this.nodeList.reduce((res, node) => {
                res = node.level > res.level ? node : res;
                return res;
            }).level;
        },
        layout(flag) {
            if (this.$refs[this.id]) {
                this.$refs[this.id].querySelectorAll('.org-chart-node .name').forEach(ele => {
                    if (flag || this.deep - parseInt(ele.dataset.level) > 0) {
                        ele.style.marginRight = `${40 * (this.deep - ele.dataset.level) + 20}px`;
                    }
                });
                this.$refs[this.id].querySelector('.active-header').style.marginRight = `${40 * (this.deep) + 20}px`;
            }
        },
        // 为tree每一项添加level字段
        setLevel(data, level) {
            data.forEach(item => {
                level = level || 0;
                item.level = level;
                if (item.children && item.children.length > 0) {
                    this.setLevel(item.children, level + 1);
                }
                if (item.hasChild && item.children && item.children.length === 0) {
                    item.hasChild = false;
                    item.label = '新建项目';
                }
            });
        },
        handleAdd({id}) {
            const maxFloor = this.getMaxFloor(this.treeData);
            console.log(maxFloor);
            if (maxFloor > 1) {
                this.$message.error('目前只支持1层嵌套！');
                return;
            }
            this.addNode(this.treeData, {id});
            this.$nextTick(() => {
                this.handleUpdate();
            });
        },
        getMaxFloor(treeData) {
            let max = 0;
            function each(data, floor) {
                data.forEach(e => {
                    e.floor = floor;
                    if (floor > max) {
                        max = floor;
                    }
                    if (e.children && e.children.length > 0) {
                        each(e.children, floor + 1);
                    }
                });
            }
            each(treeData, 1);
            return max;
        },
        handleDelete(node) {
            if (node.hasChild) {
                if (node.level !== 0) {
                    this.$confirm(`<div>
                            <p class="title"><i class="el-icon el-icon-warning"></i> 删除节点提示</p>
                            <p class="cont"><b>仅删除节点: </b>节点下的条件将保留，并移动到上级节点。</p>
                            <p class="cont"><b>删除节点及下属条件: </b>节点及下属所有条件均会被删除。</p>
                        </div>`, {
                        customClass: 'del-confirm',
                        distinguishCancelAndClose: true,
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '删除节点及下属条件',
                        cancelButtonText: '仅删除节点',
                        showClose: false
                    }).then(() => {
                        this.delete(this.treeData, node);
                        this.$nextTick(() => {
                            this.handleUpdate(true);
                            this.$forceUpdate();
                        });
                    }).catch(action => {
                        this.deleteNode(this.treeData, node);
                        this.$nextTick(() => {
                            this.$forceUpdate();
                        });
                    });
                } else {
                    this.clear();
                }
            } else {
                if (node.level === 0) {
                    this.clear();
                } else {
                    this.delete(this.treeData, node);
                    this.$nextTick(() => {
                        this.handleUpdate(true);
                    });
                }
            }
        },
        handleUpdate(flag) {
            this.getDeep();
            this.layout(flag);
        },
        delete(nodeList, node) {
            for (let index = 0, len = nodeList.length; index < len; index++) {
                const element = nodeList[index];
                if (element.id === node.id) {
                    nodeList.splice(index, 1);

                    this.setLevel(this.treeData);
                    this.$nextTick(() => {
                        this.handleUpdate(true);
                    });
                    break;
                }
                if (element.children && element.children.length > 0) {
                    this.delete(element.children, node);
                }
            }
        },
        deleteNode(nodeList, node) {
            for (let index = 0, len = nodeList.length; index < len; index++) {
                const element = nodeList[index];
                if (element.id === node.id) {
                    const children = element.children;
                    const level = element.level - 1;
                    if (!children) {
                        nodeList.splice(index, 1);
                    } else {
                        nodeList.splice(index, 1);
                        this.setNodeList(this.treeData, children, level);
                    }
                    this.setLevel(this.treeData);
                    this.$nextTick(() => {
                        this.handleUpdate(true);
                    });
                    break;
                }
                if (element.children && element.children.length > 0) {
                    this.deleteNode(element.children, node);
                }
            }
        },
        setNodeList(nodeList, children, level) {
            nodeList.forEach(item => {
                if (item.level === level) {
                    item.children = item.children.concat(children);
                }
                if (item.children && item.children.length > 0) {
                    this.setNodeList(item.children, children, level);
                }
            });
        },
        addNode(nodeList, {id}) {
            for (let index = 0, len = nodeList.length; index < len; index++) {
                const element = nodeList[index];
                if (!element.children) {
                    element.children = [];
                }
                if (element.id === id) {
                    element.hasChild = true;
                    element.children.push({
                        id: UUID.create().hex,
                        label: '新建项目',
                        selResult: {
                            values: []
                        },
                        level: element.level + 1
                    });
                    if (element.children.length < 2) {
                        const el = {
                            id: UUID.create().hex,
                            label: element.label,
                            value: element.value,
                            mode: element.mode,
                            selectArr: element.selectArr,
                            operator: element.operator,
                            operatorArr: element.operatorArr,
                            level: element.level + 1,
                            selResult: element.selResult
                        };
                        element.children.unshift(el);
                    }
                    element.label = '并';
                    element.value = 'and';
                    element.positive = true;
                    delete element.mode;
                    delete element.operator;
                    delete element._value;
                    delete element._queryParam;
                    break;
                }
                this.addNode(element.children, {id});
            }
        },
        deepTraversal(node) {
            if (node) {
                this.nodeList.push(node);
                const children = node.children || [];
                for (let i = 0, len = children.length; i < len; i++) {
                    this.deepTraversal(children[i]);
                }
            }
        }
    }
};
</script>

<style lang="scss">
.tree-chart {
    height: calc(100% - 96px);
    padding: 12px 30px;
    overflow: auto;
    .chart-header {
        display: flex;
        margin-bottom: 8px;
        color: #999;
        li {
            flex-shrink: 0;
            margin-right: 20px;
            &:first-child {
                width: 200px;
            }
            &:nth-child(2) {
                width: 174px;
            }
            &:nth-child(3) {
                width: 174px;
            }
            &:nth-child(4) {
                width: 174px;
            }
        }
    }
    .chart-container {
        padding-right: 38px;
        height: 100%;
        overflow: auto;
    }
    .chart-item-cont {
        display: flex;

        .cont {
            position: relative;
            flex-shrink: 0;
            white-space: nowrap;
            margin-right: 20px;
            .chart-menu-wrap {
                position: absolute;
                z-index: 10000;
                top: 40px;
                right: 0;
                width: 100px;
                .arrow {
                    position: absolute;
                    display: block;
                    width: 0;
                    height: 0;
                    right: 16px;
                    top: -6px;
                    border: 6px solid transparent;
                    border-top-width: 0;
                    border-bottom-color: $border-lighter;
                    margin-right: 3px;
                    &::after {
                        position: absolute;
                        display: block;
                        border-color: transparent;
                        border-style: solid;
                        content: "";
                        border-width: 6px;
                        top: 2px;
                        margin-left: -6px;
                        border-top-width: 0;
                        border-bottom-color: #FFF;
                    }
                }
                .chart-menu {
                    border: 1px solid $border-base;
                    background: #fff;
                    padding: 8px 0;
                    li {
                        padding: 0 8px;
                        cursor: pointer;
                        &:hover {
                            background: $body-bg
                        }
                    }
                }
            }
        }
        .name {
            width: 200px;
            display: flex;
            align-items: center;
            height: 32px;
            line-height: 32px;
            box-sizing: border-box;
            padding: 0 12px;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            font-size: 12px;
            span {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .el-icon {
                font-size: 16px;
                margin-left: 4px;
                cursor: pointer;
            }
        }
    }
}
.del-confirm {
    .el-message-box__header {
        display: none;
    }
    .title {
        font-size: 16px;
        font-weight: 600;
        .el-icon {
            color: $primary;
            margin: 8px 8px 16px 0;
        }
    }
    .cont {
        padding: 4px 0;
        font-size: 14px;
        b {
            color: $text-primary;
        }
    }
}
</style>
