<template>
    <div class="china-calendar">
        <div class="calendar-title">
            <i class="el-icon-back" @click="handleMonth(-1)"></i>
            <div v-if="!isEdit" class="calendar-title-value" @click="isEdit = true">
                {{year}}年{{month + 1}}月
            </div>
            <el-date-picker
                v-else
                v-model="yearAndMonth"
                type="month"
                size="small"
                placeholder="选择月"
                style="width: 120px;"
                value-format="yyyy-MM"
                :clearable="false"
                @change="isEdit = false"
            >
            </el-date-picker>
            <i class="el-icon-right" @click="handleMonth(1)"></i>
        </div>
        <div class="china-calendar-content">
            <div class="tr-calendar">
                <div v-for="(item, index) in ['日', '一', '二', '三', '四', '五', '六']" :key="index" class="single-calendar calendar-header">
                    {{item}}
                </div>
            </div>
            <div v-for="(outItem, outIndex) in showDayList" :key="outIndex" class="tr-calendar">
                <div v-for="(item, index) in outItem" :key="index" class="single-calendar">
                    <div class="number">{{item.common.get('date')}}</div>
                    <div class="nong-li">{{item.lunar.dayCn}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import solarLunar from 'solarlunar';
import {Lunar} from 'lunar-javascript';
export default {
    name: 'ChinaCalendar',
    data() {
        return {
            isEdit: false,
            yearAndMonth: `${dayjs().year()}-${dayjs().month() + 1}`,
            dayList: []
        };
    },
    computed: {
        year() {
            return this.yearAndMonth.split('-')[0];
        },
        month() {
            return this.yearAndMonth.split('-')[1] - 1;
        },
        showDayList() {
            const result = [];
            let tempList = [];
            for (let i = 0; i < this.dayList.length; i++) {
                tempList.push(this.dayList[i]);
                if (tempList.length == 7) {
                    result.push(tempList);
                    tempList = [];
                }
            }
            return result;
        }
    },
    watch: {
        yearAndMonth(newVal) {
            this.getDayList(this.year, this.month);
        }
    },
    created() {
        this.getDayList(this.year, this.month);
    },
    methods: {
        getDayList(year, month) {
            const dayList = [];
            //  目标日期
            const targetTime = dayjs().year(year).month(month);
            //  开始日期
            const beginDay = targetTime.startOf('month').set('day', 0);
            //  结束日期
            const endDay = targetTime.endOf('month').set('day', 6);
            let tempDay = beginDay.clone();
            do {
                dayList.push({
                    common: tempDay.clone(),
                    lunar: solarLunar.solar2lunar(tempDay.year(), tempDay.month() + 1, tempDay.date()),
                    chinaLunar: Lunar.fromDate(new Date(tempDay.format('YYYY-MM-DD')))
                });
                tempDay = tempDay.add(1, 'day');
            } while (tempDay.isBefore(endDay));
            this.dayList = dayList;
        },
        handleMonth(num) {
            this.yearAndMonth = dayjs(this.yearAndMonth).add(num, 'month').format('YYYY-MM');
        }
    }
};
</script>

<style lang="scss" scoped>
    .china-calendar{
        .calendar-title{
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .calendar-title-value{
                cursor: pointer;
                font-weight: bold;
                font-size: 20px;
            }
            i{
                cursor: pointer;
                &:hover{
                    color: $primary;
                }
            }
        }
        .china-calendar-content{

            .tr-calendar{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                border-top: 1px solid #333333;
                &:last-child{
                    border-bottom: 1px solid #333333;
                }
                .single-calendar{
                    width: 14%;
                    text-align: center;
                    //border-right: 1px solid #333333;
                    padding: 8px 0 ;
                    &:first-child{
                        //border-left: 1px solid #333333;
                    }
                    .number{
                        line-height: 30px;
                        font-size: 24px;
                        font-weight: 500;

                        color: $text-primary;
                    }
                    .nong-li{
                        line-height: 20px;
                        font-size: 16px;
                        color: $text-regular;
                    }

                }
                .calendar-header{
                    text-align: center;
                    padding: 8px 0;
                    font-size: 16px;
                    font-weight: bold;
                }
            }
        }
    }
</style>
