<template>
    <div>
        <el-select v-model="frequency" placeholder="请选择" size="small">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-input v-model="times" placeholder="请输入内容" style="width: 100px;margin-left: 12px" size="small"></el-input>
        <plan-config-table :frequency="frequency" :times="times" style="margin-top: 16px"></plan-config-table>
    </div>
</template>

<script>
export default {
    name: 'JobExample',
    components: {
        PlanConfigTable: () => import('./PlanConfigTable')
    },
    data() {
        return {
            options: [{
                value: 1,
                label: '每年'
            }, {
                value: 2,
                label: '每半年'
            }, {
                value: 3,
                label: '每季度'
            }, {
                value: 4,
                label: '每月'
            }, {
                value: 5,
                label: '每周'
            }],
            frequency: 5,
            times: 1
        };
    }
};
</script>

<style scoped>

</style>
