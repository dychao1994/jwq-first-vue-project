<template>
    <div class="liu-yao-search">
        <el-form ref="form" :model="searchForm" label-width="100px" size="small">
            <el-form-item label="公历时间：">
                <el-date-picker
                    v-model="searchForm.date"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="起卦方式：">
                <el-radio-group
                    v-model="searchForm.type">
                    <el-radio v-for="(item, index) in typeArray" :key="index" :value="item" :label="item"></el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="button-panel">
                <el-button type="primary" size="small">查询</el-button>
                <el-button size="small">重置</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'LiuYaoSearch',
    data() {
        return {
            searchForm: {
                date: this.$dayjs(),
                type: ''
            },
            typeArray: ['电脑自动', '手工指定', '时间起卦', '手动摇卦', '报数起卦']
        };
    }
};
</script>

<style lang="scss" scoped>
    .liu-yao-search{
        .button-panel{
            height: 40px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
    }
</style>
