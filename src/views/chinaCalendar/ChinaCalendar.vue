<template>
    <div class="china-calendar">
        <div ref="month" class="china-calendar-month">
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
                        :class="{'is-current-month': month != item.common.month(), holiday: (isHoliday(item.common, true) || ([0, 6].includes(item.common.get('day'))))
                                 , today: isSameDate(item.common), active: selectedDate.common.isSame(item.common), work: isHoliday(item.common, false)}"
                        @click="handleSelectDate(item)"
                    >
                        <i v-if="isHoliday(item.common, true)" class="iconfont icon-learning-rest holiday-icon" ></i>
                        <i v-else-if="isHoliday(item.common, false)" class="iconfont icon-learning-work work-icon" ></i>
                        <span v-else-if="isSameDate(item.common)" class="work-icon">今</span>
                        <div class="number" :class="{red: (isHoliday(item.common, true) || (!isHoliday(item.common, false) &&[0, 6].includes(item.common.get('day'))))}">{{item.common.get('date')}}</div>
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
        <div class="china-calendar-day">
            <day-calendar :current-day="selectedDate" :row-num="dayList.length / 7"></day-calendar>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import {Lunar, Solar, HolidayUtil} from 'lunar-javascript';
export default {
    name: 'ChinaCalendar',
    components: {
        DayCalendar: () => import('./DayCalendar')
    },
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
        },
        height() {
            return this.$refs.month ? this.$refs.month.offsetHeight : 412;
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
            this.yearAndMonth = item.common.format('YYYY-MM');
            this.selectedDate = item;
        },
        isHoliday(item, isRest) {
            const holiday = HolidayUtil.getHoliday(item.year(), item.month() + 1, item.date());
            return holiday && (isRest ? !holiday.isWork() : holiday.isWork());
        }
    }
};
</script>

<style lang="scss" scoped>
    .china-calendar{
        border: 4px solid $primary;
        display: flex;
        justify-content: space-between;
        .china-calendar-month{
            margin: 2px;
            width: calc(100% - 250px);
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
                    justify-content: space-evenly;
                    align-items: center;
                    border-top: 1px solid $text-secondary;
                    /*&:first-child{
                        border-top: 1px solid $primary;
                    }*/
                    /*&:last-child{
                        border-bottom: 1px solid $text-secondary;
                    }*/
                    .single-calendar{
                        position: relative;
                        border: 3px solid white;
                        height: 66px;
                        width: 14.2%;
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
                        i {
                            position: absolute;
                            font-size: 18px;
                            color: $red;
                            left: 4px;
                            top: 4px;
                        }
                        .holiday-icon{
                            color: $red;
                        }
                        .work-icon{
                            color: $text-primary;
                        }
                    }
                    .is-current-month {
                        opacity: .5;
                    }
                    .active {
                        border-color: $primary !important;
                    }
                    .holiday {
                        $color: lighten($red, 40%);
                        background: $color;
                        border-color: $color;
                    }
                    .work{
                        $color: lighten($text-placeholder, 10%);
                        background: $color;
                        border-color: $color;
                    }
                    .calendar-header{
                        height: 32px;
                        text-align: center;
                        padding: 8px 0;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .today{
                        background: lighten($primary, 0%);
                        border-color: $primary;
                        >div {
                            color: white !important;
                        }
                        .work-icon{
                            position: absolute;
                            font-size: 18px;
                            font-weight: bold;
                            left: 8px;
                            top: 8px;
                            color: white !important;
                        }
                    }
                }
            }
        }
        .china-calendar-day{
            width: 240px;
            //background: lighten($primary, 40%);
        }
    }
</style>
