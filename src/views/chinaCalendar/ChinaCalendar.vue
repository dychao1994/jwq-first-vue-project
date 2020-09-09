<template>
    <div class="china-calendar">万年历
        <div class="china-calendar-content">
            <div class="tr-calendar">
                <div v-for="(item, index) in ['日', '一', '二', '三', '四', '五', '六']" :key="index" class="single-calendar">
                    {{item}}
                </div>
            </div>
            <div v-for="(outItem, outIndex) in showDayList" :key="outIndex" class="tr-calendar">
                <div v-for="(item, index) in outItem" :key="index" class="single-calendar">
                    {{item.common.get('date')}}
                    {{item.lunar.dayCn}}
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
            year: dayjs().year(),
            month: dayjs().month(),
            dayList: []
        };
    },
    computed: {
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
        }
    }
};
</script>

<style lang="scss" scoped>
    .china-calendar{
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

                    border-right: 1px solid #333333;
                    &:first-child{
                        border-left: 1px solid #333333;
                    }

                }
            }
        }
    }
</style>
