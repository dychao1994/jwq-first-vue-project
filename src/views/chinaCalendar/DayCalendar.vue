<template>
    <div class="day-calendar" :style="'height:' + height + 'px'">
        <el-scrollbar style="height: 100%;">
            <div class="day-calendar-header">
                {{currentDay.common.format('YYYY年MM月DD日')}} 星期{{currentDay.chinaLunar.getWeekInChinese()}}
            </div>
            <div class="day-calendar-day">
                <div class="show-day">{{currentDay.common.format('D')}}</div>
            </div>
            <div class="key-value">
                <div class="key">农</div>
                <div class="value">
                    [{{chinaLunar.getYearShengXiaoExact()}}]&#12288;{{chinaLunar.getYearInChinese()}}年{{chinaLunar.getMonthInChinese()}}月{{chinaLunar.getDayInChinese()}}
                </div>
            </div>
            <div class="key-value">
                <div class="key">甲</div>
                <div class="value ganzhi">
                    <div>
                        <div>{{chinaLunar.getYearGanExact()}}</div>
                        <div>{{chinaLunar.getYearZhiExact()}}</div>
                    </div>
                    <div>
                        <div>{{chinaLunar.getMonthGanExact()}}</div>
                        <div>{{chinaLunar.getMonthZhiExact()}}</div>
                    </div>
                    <div>
                        <div>{{chinaLunar.getDayGan()}}</div>
                        <div>{{chinaLunar.getDayZhi()}}</div>
                    </div>
                </div>
            </div>
            <div v-if="festival" class="key-value">
                <div class="key festival">节</div>
                <div class="value">
                    {{festival}}
                </div>
            </div>
            <div class="key-value">
                <div class="key yi">宜</div>
                <div class="value">
                    {{chinaLunar.getDayYi().join('、')}}
                </div>
            </div>

            <div class="key-value">
                <div class="key ji">忌</div>
                <div class="value">
                    {{chinaLunar.getDayJi().join('、')}}
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'DayCalendar',
    props: {
        currentDay: {
            type: Object,
            default: () => { return {}; }
        },
        rowNum: {
            type: Number,
            default: 5
        }
    },
    computed: {
        chinaLunar() {
            return this.currentDay.chinaLunar;
        },
        solarLunar() {
            return this.currentDay.solarLunar;
        },
        height() {
            return 412 + (this.rowNum - 5) * 67;
        },
        festival() {
            return this.chinaLunar.getFestivals().concat(this.solarLunar.getFestivals()).concat(this.chinaLunar.getOtherFestivals()).concat(this.solarLunar.getOtherFestivals()).join('、');
        }
    }
};
</script>

<style lang="scss">
    .day-calendar{
        height: 100%;
        width: 100%;
        background: $primary;
        .day-calendar-header{
            text-align: center;
            line-height: 32px;
            color: white;
            font-weight: bold;
        }
        .day-calendar-day{
            display: flex;
            justify-content: center;
            align-items: center;
            .show-day{
                $width: 80px;
                width: $width;
                height: $width;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;

                font-size: 40px;
                font-weight: bold;
                color: white;
                background: lighten($yellow, 5%);
            }
        }
        .key-value{
            padding: 4px 0;
            line-height: 24px;
            display: flex;
            align-items: flex-start;
            font-size: 16px;
            color: white;
            border-bottom: 1px dashed white;
            .key{
                /*width: 70px;*/
                font-weight: bold;
                width: 24px;
                line-height: 22px;
                text-align: center;
                border-radius: 4px;
                border: 1px solid white;
                background: white;
                color: $primary;
                margin-right: 16px;
            }
            .value {
                width: calc(100% - 24px);
                font-weight: bold;
            }
            .ganzhi{
                font-weight: bold;
                display: flex;
                >div{
                    margin-right: 20px;
                    >div{
                        line-height: 24px;
                        font-weight: bold;
                    }
                }
            }
            .yi{
                $yi: #F5222D;
                background-color: $yi !important;
                border-color: $yi !important;
                color: white !important;
            }
            .ji{
                background-color: $green !important;
                border-color: $green !important;
                color: white !important;
            }
            .festival{
                background-color: $blue !important;
                border-color: $blue !important;
                color: white !important;
            }
        }
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
        .el-scrollbar__view{
            padding: 8px;
        }
    }
</style>
