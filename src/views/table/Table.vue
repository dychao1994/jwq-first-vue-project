<template>
    <div>
        <el-table
            ref="singleTable"
            :data="tableData"
            style="width: 100%"
            @current-change="handleCurrentChange">
            <el-table-column
                type="index"
                label="序号">
            </el-table-column>
            <el-table-column
                property="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                property="sex"
                label="性别"
                :filters="sexFilters"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                property="age"
                sortable
                label="年龄">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'Table',
    data() {
        return {
            tableData: [{
                name: '王小虎',
                sex: '女',
                age: 21
            }, {
                name: '王小虎',
                sex: '男',
                age: 22
            }, {
                name: '王小虎',
                sex: '女',
                age: 23
            }, {
                name: '王小虎',
                sex: '女',
                age: 24
            }],
            currentRow: null,
            sexFilters: [{
                text: '男', value: '男'
            }, {
                text: '女', value: '女'
            }]
        };
    },
    methods: {
        filterHandler(value, row, column) {
            const property = column.property;
            return row[property] === value;
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        }
    }
};
</script>

<style scoped>

</style>
