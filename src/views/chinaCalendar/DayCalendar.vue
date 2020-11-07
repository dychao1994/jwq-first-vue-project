<template>
    <div class="day-calendar">
        <div class="day-calendar-header">
            {{currentDay.common.format('YYYY年MM月DD日 dddd')}}
        </div>
        <div class="day-calendar-day">
            <div class="show-day">{{currentDay.common.format('DD')}}</div>
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
    }
};
</script>

<style lang="scss" scoped>
    .day-calendar{
        height: 100%;
        background: $primary;
        .day-calendar-header{
            text-align: center;
            line-height: 40px;
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
    }
</style>
