<template>
    <div class="yao" :class="{'liu-yao-mode': mode == 'liuYao'}" :style="height? 'height:' + height + 'px' : ''">
        <div v-if="type == 1" class="yang" :class="{active: active}"></div>
        <div v-else class="yin" :class="{active: active}">
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Yao',
    props: {
        height: {
            type: [String, Number],
            default: ''
        },
        type: {
            type: [String, Number],
            default: 1
        },
        active: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: '',
            validator: (value) => {
                // 这个值必须匹配下列字符串中的一个
                return ['', 'liuYao'].indexOf(value) !== -1;
            }
        }
    }
};
</script>

<style lang="scss">
    .yao{
        display: flex;
        align-items: center;
        height: 32px;
        .yang{
            height: calc(100% - 10px);
            width: 100%;
            background: #ff4d4f;
            &.active{
                background: $active;
            }
        }
        .yin{
            display: flex;
            height: calc(100% - 10px);
            width: 100%;
            justify-content: space-between;
            >div{
                width: 40%;
                height: 100%;
                background: #1890ff;

            }
            &.active{
                >div{
                    background: $active;
                }

            }
        }
    }
    .liu-yao-mode{
        .yang{
            background: $text-primary;
        }
        .yin{
            >div{
                background: $text-primary;
            }
        }
    }
</style>
