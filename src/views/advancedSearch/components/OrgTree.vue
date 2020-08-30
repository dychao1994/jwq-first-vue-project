<template>
    <div class="org-chart">
        <org-tree-node v-for="(item, index) in treeData" :key="item.id" :node="item" :lastChild="index === treeData.length - 1">
            <template v-if="item.children && item.children.length > 0">
                <org-tree-node
                    v-for="(child, index) in item.children"
                    :key="child.id"
                    :node="child"
                    :lastChild="index === item.length - 1">
                </org-tree-node>
            </template>
        </org-tree-node>
    </div>
</template>

<script>
export default {
    name: 'OrgTree',
    components: {
        OrgTreeNode: () => import('./OrgTreeNode')
    },
    props: {
        treeData: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    watch: {
        treeData: {
            deep: true,
            handler(v) {
            }
        }
    }
};
</script>

<style lang="scss">
.org-chart {
    height: auto;
    .chart-item-wrap {
        height: auto;
    }
}
</style>
