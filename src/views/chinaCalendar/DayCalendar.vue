<template>
    <div class="day-calendar">
        <div class="day-calendar-header">
            {{currentDay.common.format('YYYY年MM月DD日 dddd')}}
        </div>
        <div class="day-calendar-day">
            <div class="show-day">{{currentDay.common.format('DD')}}</div>
        </div>
        <div class="key-value">
            <div class="key">农</div>
            <div class="value">
                {{chinaLunar.getYearInChinese()}}年{{chinaLunar.getMonthInChinese()}}月{{chinaLunar.getDayInChinese()}}
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
        <div class="key-value">
            <div class="key">节</div>
            <div class="value">
                {{chinaLunar.getFestivals().concat(chinaLunar.getOtherFestivals()).concat(solarLunar.getFestivals()).concat(solarLunar.getOtherFestivals()).toString()}}
            </div>
        </div>
        <div class="key-value">
            <div class="key yi">宜</div>
            <div class="value">
                {{chinaLunar.getDayYi().toString()}}
            </div>
        </div>

        <div class="key-value">
            <div class="key ji">忌</div>
            <div class="value">
                {{chinaLunar.getDayJi().toString()}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DayCalendar',
    props: {
        currentDay: {
            type: Object,
            default: () => { return {}; }
        }
    },
    computed: {
        chinaLunar() {
            return this.currentDay.chinaLunar;
        },
        solarLunar() {
            return this.currentDay.solarLunar;
        }
    }
};
</script>

<style lang="scss" scoped>
    .day-calendar{
        height: 100%;
        background: $primary;
        padding: 8px;
        overflow: auto;
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
        }
    }
</style>
