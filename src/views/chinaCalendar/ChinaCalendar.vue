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
                <div
                    v-for="(item, index) in outItem"
                    :key="index"
                    class="single-calendar"
                    :class="{'is-current-month': month != item.common.month(), today: isSameDate(item.common), active: selectedDate.common.isSame(item.common), holiday: isHoliday(item.common)}"
                    @click="handleSelectDate(item)"
                >
                    <div class="number">{{item.common.get('date')}}</div>
                    <!-- 节气 -->
                    <div v-if="item.chinaLunar.getJie() || item.chinaLunar.getQi()" class="second-line red">
                        {{item.chinaLunar.getJie() || item.chinaLunar.getQi()}}
                    </div>
                    <!-- 节日 -->
                    <div v-else-if="item.solarLunar.getFestivals().length || item.chinaLunar.getFestivals().length" class="second-line red">
                        {{item.solarLunar.getFestivals().concat(item.chinaLunar.getFestivals()).join('、')}}
                    </div>
                    <!-- 农历 -->
                    <div v-else class="second-line">{{item.chinaLunar.getDayInChinese()}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import {Lunar, Solar, HolidayUtil} from 'lunar-javascript';
export default {
    name: 'ChinaCalendar',
    data() {
        return {
            isEdit: false,
            yearAndMonth: `${dayjs().year()}-${dayjs().month() + 1}`,
            dayList: [],
            selectedDate: {
                common: dayjs(),
                solarLunar: Solar.fromDate(new Date()),
                chinaLunar: Lunar.fromDate(new Date())
            }
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
                    solarLunar: Solar.fromDate(new Date(tempDay.format('YYYY-MM-DD'))),
                    chinaLunar: Lunar.fromDate(new Date(tempDay.format('YYYY-MM-DD')))
                });
                console.log(tempDay.clone().year(), tempDay.clone().month() + 1, tempDay.clone().date())
                console.log(HolidayUtil.getHoliday(tempDay.clone().year(), tempDay.clone().month() + 1, tempDay.clone().date()));
                tempDay = tempDay.add(1, 'day');
            } while (tempDay.isBefore(endDay));
            this.dayList = dayList;
        },
        handleMonth(num) {
            this.yearAndMonth = dayjs(this.yearAndMonth).add(num, 'month').format('YYYY-MM');
        },
        isSameDate(date) {
            return dayjs().isSame(date, 'date');
        },
        handleSelectDate(item) {
            this.selectedDate = item;
        },
        isHoliday(item) {
            const holiday = HolidayUtil.getHoliday(item.year(), item.month() + 1, item.date());
            return holiday && !holiday.isWork();

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
                align-items: center;
                border-top: 1px solid $text-secondary;
                &:last-child{
                    border-bottom: 1px solid $text-secondary;
                }
                .single-calendar{
                    border: 3px solid white;
                    height: 66px;
                    width: 14.285%;
                    text-align: center;
                    cursor: pointer;
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
                    .second-line{
                        line-height: 24px;
                        font-size: 14px;
                        color: $text-regular;
                    }
                    .red{
                        color: $red;
                        font-weight: bold;
                    }

                }
                .is-current-month {
                    opacity: .5;
                }
                .today{
                    background: lighten($primary, 0%);
                    border-color: $primary;
                    >div {
                        color: white !important;
                    }
                }
                .active {
                    border-color: $primary;
                }
                .holiday {
                    background: lighten($red, 40%);
                }
                .calendar-header{
                    height: 32px;
                    text-align: center;
                    padding: 8px 0;
                    font-size: 16px;
                    font-weight: bold;
                }
            }
        }
    }
</style>