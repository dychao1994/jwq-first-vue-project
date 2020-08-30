<template>
    <div class="yao">
        <div v-if="type == 1" class="yang"></div>
        <div v-else class="yin">
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Yao',
    props: {
        type: {
            type: [String, Number],
            default: 1
        }
    }
};
</script>

<style lang="scss" scoped>
    .yao{
        padding: 5px;
        height: 20px;
        .yang{
            height: 100%;
            background: #ff4d4f;
        }
        .yin{
            display: flex;
            height: 100%;
            justify-content: space-between;
            >div{
                width: 40%;
                height: 100%;
                background: #1890ff;
            }
        }
    }
</style>
