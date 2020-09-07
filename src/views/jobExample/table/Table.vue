<template>
    <div>
        <el-table
            ref="singleTable"
            :data="showTableData"
            style="width: 100%"
            size="small"
        >
            <el-table-column
                type="index"
                label="序号"
                :index="indexMethod">
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
        <el-pagination
            :current-page="pageNum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
        </el-pagination>
        <el-dialog
            title="编辑"
            :visible.sync="dialogVisible"
            width="400px"
            center>
            <el-form ref="validateForm" :model="selectedObj" :rules="rules" label-width="80px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="selectedObj.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="selectedObj.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="selectedObj.age"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('validateForm')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'Table',
    data() {
        return {
            pageSize: 5,
            pageNum: 1,
            tableData: [{
                name: '王小虎1',
                sex: '女',
                age: 21
            }, {
                name: '王小虎2',
                sex: '男',
                age: 22
            }, {
                name: '王小虎3',
                sex: '女',
                age: 23
            }, {
                name: '王小虎4',
                sex: '女',
                age: 24
            }, {
                name: '王小虎5',
                sex: '女',
                age: 21
            }, {
                name: '王小虎6',
                sex: '男',
                age: 22
            }, {
                name: '王小虎7',
                sex: '女',
                age: 23
            }, {
                name: '王小虎8',
                sex: '女',
                age: 24
            }],
            sexFilters: [{
                text: '男', value: '男'
            }, {
                text: '女', value: '女'
            }],
            dialogVisible: false,
            selectedObj: {
                name: '',
                sex: '',
                age: ''
            },
            selectedIndex: 0,
            rules: {
                name: [
                    {required: true, message: '请输入活动名称', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                age: [
                    {required: true, message: '年龄不能为空'},
                    {type: 'number', message: '年龄必须为数字值'}
                ]
            }
        };
    },
    computed: {
        beginIndex() {
            return (this.pageNum - 1) * this.pageSize;
        },
        endIndex() {
            // return (this.pageNum - 1) * this.pageSize + 0 + this.pageSize;
            return this.pageNum * this.pageSize - 1;
        },
        showTableData() { // 动态显示当前页的条数
            const showTableData = this.tableData.slice(this.beginIndex, this.endIndex + 1);
            return showTableData;
        }
    },
    methods: {
        filterHandler(value, row, column) { // 筛选
            const property = column.property;
            return row[property] === value;
        },
        handleEdit(index, row) {
            this.selectedObj = Object.assign({}, row);
            this.selectedIndex = index;
            this.dialogVisible = true;
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageNum = val;
        },
        indexMethod(index) { // 序号
            return index + (this.pageNum - 1) * this.pageSize + 1;
        },
        submitForm(validateForm) { // 保存
            this.$refs[validateForm].validate((valid) => {
                if (valid) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.tableData[this.selectedIndex] = Object.assign({}, this.selectedObj);
                    this.$set(this.tableData, this.selectedIndex, Object.assign({}, this.selectedObj));
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>

</style>
