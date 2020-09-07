<template>
    <div>
        <el-table :data="tableData" size="small">
            <el-table-column label="序号" type="index"></el-table-column>

            <el-table-column label="预检时段">
                <template slot-scope="scope">
                    {{showTime(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column label="预检时段">
                <template slot-scope="scope">
                    <el-date-picker
                        v-if="frequency != 5"
                        v-model="scope.row.month"
                        type="month"
                        size="small"
                        placeholder="选择月">
                    </el-date-picker>
                    <el-date-picker
                        v-else
                        v-model="scope.row.month"
                        type="week"
                        size="small"
                        format="yyyy第WW周"
                        placeholder="选择周"
                        @change="(val) => changeWeek(val, scope.row)"
                    >
                    </el-date-picker>
                </template>
            </el-table-column>

            <el-table-column v-if="frequency != 1" label="类型">
                <template slot-scope="scope">
                    {{showType(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleRemove(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import dayjs from 'dayjs';
const weekYear = require('dayjs/plugin/weekYear');
const weekOfYear = require('dayjs/plugin/weekOfYear'); // dependent on weekOfYear plugin
const isoWeeksInYear = require('dayjs/plugin/isoWeeksInYear');
const isLeapYear = require('dayjs/plugin/isLeapYear'); // dependent on isLeapYear plugin
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
export default {
    props: {
        detailPlanConfigList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        frequency: Number,
        times: [Number, String]
    },
    data() {
        return {
            tableData: this.createTableData({})
        };
    },
    computed: {
        params() {
            const {frequency, times} = this;
            return {frequency, times};
        }
    },
    watch: {
        params(newVal) {
            this.tableData = this.createTableData(newVal);
        }
    },
    created() {
    },
    methods: {
        createTableData(params) {
            const result = [];
            const frequency = params.frequency || this.frequency;
            const times = params.times || this.times;
            if (this.detailPlanConfigList.length == 0) {
                const MonthArray = [12, 6, 3];
                if (frequency < 4) {
                    //  每年
                    if (MonthArray[frequency - 1] % times == 0) {
                        const step = MonthArray[frequency - 1] / times;
                        //  能被整除
                        for (let i = 1; i <= 12; i = i + step) {
                            result.push(this.getDate(i));
                        }
                    }
                } else if (frequency == 4) {
                    for (let i = 1; i <= 12; i++) {
                        for (let j = 0; j < times; j++) {
                            result.push(this.getDate(i));
                        }
                    }
                } else if (frequency == 5) {
                    //  每周
                    const weeks = dayjs().isoWeeksInYear();// 一年周数
                    for (let i = 1; i <= weeks; i++) {
                        for (let j = 0; j < times; j++) {
                            result.push(this.getWeek(i));
                        }
                    }
                }
            } else {
                return JSON.parse(JSON.stringify(this.detailPlanConfigList));
            }
            return result;
        },
        getDate(month) {
            //  生成month月份的第一天和最后一天
            const targetMonth = dayjs().set('month', month - 1);
            const startDay = targetMonth.startOf('month').format('YYYY-MM-DD');
            const endDay = targetMonth.endOf('month').format('YYYY-MM-DD');
            return {
                startTime: startDay,
                endTime: endDay,
                month: targetMonth.format('YYYY-MM')
            };
        },
        getWeek(weekNum) {
            //  生成Week的第一天和最后一天
            const targetWeek = dayjs().week(weekNum);
            const startDay = targetWeek.startOf('week').format('YYYY-MM-DD');
            const endDay = targetWeek.endOf('week').format('YYYY-MM-DD');
            return {
                startTime: startDay,
                endTime: endDay,
                month: startDay
            };
        },
        showTime(row) {
            if (row.startTime) {
                return `${dayjs(row.startTime).month() + 1}月（${row.startTime} - ${row.endTime})`;
            }
        },
        showType(row) {
            const month = dayjs(row.startTime).month();
            if (this.frequency == 2) {
                //  每半年
                if (month < 6) {
                    return '上半年';
                }
                return '下半年';
            }
            if (this.frequency == 3) {
                //  每季度
                return `第${parseInt(month / 3) + 1}季度`;
            }
            if (this.frequency == 4) {
                //  每季度
                return `${month + 1}月`;
            }
            if (this.frequency == 5) {
                const week = (dayjs(row.startTime).week() + 50) % 52 + 1;
                return `${week}周`;
            }
        },
        handleRemove(record) {
        },
        changeWeek(val, record) {
            const currentWeek = dayjs(val);
            record.startTime = currentWeek.day(0).format('YYYY-MM-DD');
            record.endTime = currentWeek.day(6).format('YYYY-MM-DD');
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
